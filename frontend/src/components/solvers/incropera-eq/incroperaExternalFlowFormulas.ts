/** Incropera — Tabela 7.9 (*Summary of convection … external flow*). Avaliar propriedades em T_f, T̄_f ou T_∞ conforme a equação. */

/** (7.19) δ = 5x Re_x^{-1/2} — camada limite de velocidade laminar (u/U∞ ≈ 0,99). */
export function deltaOverXLaminar(ReX: number): number {
    if (ReX <= 0) return NaN;
    return 5 / Math.sqrt(ReX);
}

export function deltaLaminar(x: number, ReX: number): number {
    if (x <= 0 || ReX <= 0) return NaN;
    return 5 * x / Math.sqrt(ReX);
}

/** (7.20) C_{f,x} = 0,664 Re_x^{-1/2} — atrito local, laminar. */
export function cfLocalLaminarFlatPlate(ReX: number): number {
    if (ReX <= 0) return NaN;
    return 0.664 / Math.sqrt(ReX);
}

/** (7.24) δ_t = δ Pr^{-1/3} — espessura da camada limite térmica (laminar). */
export function deltaThermalFromDelta(delta: number, Pr: number): number {
    if (delta <= 0 || Pr <= 0) return NaN;
    return delta * Math.pow(Pr, -1 / 3);
}

/** (7.29) C̄_f — coeficiente médio de atrito, laminar (comprimento característico no Re). */
export function cfBarLaminar729(Re: number): number {
    if (Re <= 0) return NaN;
    return 1.328 / Math.sqrt(Re);
}

/** (7.30) Nū médio laminar, Pr ≳ 0,6. */
export function nuBarEq730(Re: number, Pr: number): number {
    if (Re <= 0 || Pr <= 0) return NaN;
    return 0.664 * Math.sqrt(Re) * Math.pow(Pr, 1 / 3);
}

/** (7.32) Metais líquidos, Pe_x ≳ 100. */
export function nuXEq732(PeX: number): number {
    if (PeX <= 0) return NaN;
    return 0.565 * Math.sqrt(PeX);
}

/** (7.34) Atrito local, turbulento. */
export function cfLocalTurbulent734(ReX: number): number {
    if (ReX <= 0) return NaN;
    return 0.0592 * Math.pow(ReX, -0.2);
}

/** (7.35) δ = 0,37x Re_x^{-1/5} — camada limite turbulenta. */
export function deltaOverXTurbulentFlatPlate(ReX: number): number {
    if (ReX <= 0) return NaN;
    return 0.37 * Math.pow(ReX, -0.2);
}

export function deltaTurbulentFlatPlate(x: number, ReX: number): number {
    if (x <= 0 || ReX <= 0) return NaN;
    return 0.37 * x * Math.pow(ReX, -0.2);
}

/** (7.36) Nu_x turbulento local. */
export function nuXEq736(ReX: number, Pr: number): number {
    if (ReX <= 0 || Pr <= 0) return NaN;
    return 0.0296 * Math.pow(ReX, 4 / 5) * Math.pow(Pr, 1 / 3);
}

export function Atransition(ReXc: number): number {
    return 0.037 * Math.pow(ReXc, 4 / 5) - 0.664 * Math.sqrt(ReXc);
}

/** (7.38) Placa mista — Nū_L. */
export function nuBarEq738(ReL: number, Pr: number, ReXc: number): number {
    if (ReL <= 0 || Pr <= 0 || ReXc <= 0) return NaN;
    const A = Atransition(ReXc);
    return (0.037 * Math.pow(ReL, 4 / 5) - A) * Math.pow(Pr, 1 / 3);
}

/** (7.38) Forma explícita com Re_{x,c} = 5×10^5 → A = 871. */
export function nuBarEq738Table(ReL: number, Pr: number): number {
    return nuBarEq738(ReL, Pr, 500_000);
}

/** (7.40) Coeficiente médio de atrito, placa mista; Re_{x,c} = 5×10^5. */
export function cfBarMixed740(ReL: number): number {
    if (ReL <= 0) return NaN;
    return 0.074 * Math.pow(ReL, -0.2) - 1742 / ReL;
}

/** (7.52) Cilindro — Hilpert; T_f. */
export function nuBarEq752(C: number, m: number, ReD: number, Pr: number): number {
    if (ReD <= 0 || Pr <= 0 || C <= 0) return NaN;
    return C * Math.pow(ReD, m) * Math.pow(Pr, 1 / 3);
}

/** (7.53) Cilindro; T_∞; constantes da Tabela 7.4. */
export function nuBarEq753(C: number, m: number, n: number, ReD: number, Pr: number, Prs: number): number {
    if (ReD <= 0 || Pr <= 0 || Prs <= 0 || C <= 0) return NaN;
    return C * Math.pow(ReD, m) * Math.pow(Pr, n) * Math.pow(Pr / Prs, 0.25);
}

/** (7.54) Churchill–Bernstein. */
export function nuBarEq754(ReD: number, Pr: number): number {
    if (ReD <= 0 || Pr <= 0) return NaN;
    const numerator = 0.62 * Math.pow(ReD, 0.5) * Math.pow(Pr, 1 / 3);
    const denominator = Math.pow(1 + Math.pow(0.4 / Pr, 2 / 3), 0.25);
    const correctionTerm = Math.pow(1 + Math.pow(ReD / 282000, 5 / 8), 4 / 5);
    return 0.3 + (numerator / denominator) * correctionTerm;
}

/** (7.56) Whitaker — esfera. */
export function nuBarEq756(ReD: number, Pr: number, muRatio: number): number {
    if (ReD <= 0 || Pr <= 0 || muRatio <= 0) return NaN;
    return (
        2 +
        (0.4 * Math.sqrt(ReD) + 0.06 * Math.pow(ReD, 2 / 3)) *
            Math.pow(Pr, 0.4) *
            Math.pow(muRatio, 0.25)
    );
}

/** (7.57) Gota em queda. */
export function nuBarEq757(ReD: number, Pr: number): number {
    if (ReD <= 0 || Pr <= 0) return NaN;
    return 2 + 0.6 * Math.sqrt(ReD) * Math.pow(Pr, 1 / 3);
}

/** (7.60) Banco de tubos; T̄_f; Tabelas 7.5 e 7.6. */
export function nuBarEq760(C1: number, C2: number, m: number, ReDmax: number, Pr: number): number {
    if (ReDmax <= 0 || Pr <= 0 || C1 <= 0 || C2 <= 0) return NaN;
    return 1.13 * C1 * C2 * Math.pow(ReDmax, m) * Math.pow(Pr, 1 / 3);
}

/** (7.64) Zukauskas — banco de tubos. */
export function nuBarEq764(C: number, C2: number, m: number, ReDmax: number, Pr: number, Prs: number): number {
    if (ReDmax <= 0 || Pr <= 0 || Prs <= 0 || C <= 0) return NaN;
    return C * C2 * Math.pow(ReDmax, m) * Math.pow(Pr, 0.36) * Math.pow(Pr / Prs, 0.25);
}

/** Correlações Nu placa laminar, todos os Pr (fora da Tabela 7.9) — refs. alternativas. */
export function nuBarExtendedPr(ReL: number, Pr: number): number {
    if (ReL <= 0 || Pr <= 0) return NaN;
    const denom = Math.pow(1 + Math.pow(0.0468 / Pr, 2 / 3), 0.25);
    return (0.6774 * Math.sqrt(ReL) * Math.pow(Pr, 1 / 3)) / denom;
}

export function nuXExtendedPr(ReX: number, Pr: number): number {
    if (ReX <= 0 || Pr <= 0) return NaN;
    const denom = Math.pow(1 + Math.pow(0.0468 / Pr, 2 / 3), 0.25);
    return (0.3387 * Math.sqrt(ReX) * Math.pow(Pr, 1 / 3)) / denom;
}

export function nuXEq723(ReX: number, Pr: number): number {
    if (ReX <= 0 || Pr <= 0) return NaN;
    return 0.332 * Math.sqrt(ReX) * Math.pow(Pr, 1 / 3);
}
