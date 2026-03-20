import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { deltaLaminar, deltaThermalFromDelta } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

/**
 * (7.24) δ_t = δ Pr^{-1/3}. Pode informar δ diretamente ou calcular δ pela (7.19) com Re_x e x.
 */
export function SolverEq724({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [mode, setMode] = useState<"delta" | "from719">(
        initialParams.mode === "from719" ? "from719" : "delta"
    );
    const [deltaIn, setDeltaIn] = useState<string | number>(ip(initialParams, "delta", 1e-3));
    const [ReX, setReX] = useState<string | number>(ip(initialParams, "ReX", 50000));
    const [x, setX] = useState<string | number>(ip(initialParams, "x", 0.5));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const isFirst = useRef(true);

    useEffect(() => {
        const p =
            mode === "delta"
                ? { mode: "delta" as const, delta: Number(deltaIn), Pr: Number(Pr) }
                : { mode: "from719" as const, ReX: Number(ReX), x: Number(x), Pr: Number(Pr) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [mode, deltaIn, ReX, x, Pr, needsScaffolding, onParamsChange]);

    const nPr = Number(Pr) || 0;
    const deltaHyd =
        mode === "delta"
            ? Number(deltaIn) || 0
            : deltaLaminar(Number(x) || 0, Number(ReX) || 0);
    const deltaT = deltaThermalFromDelta(deltaHyd, nPr);
    const ok = nPr >= 0.6;

    return (
        <SolverWrapper
            title="Eq. (7.24) — Placa plana, laminar: espessura da camada limite térmica"
            equationLatex={String.raw`\delta_t = \delta \, Pr^{-1/3}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`\delta`} />: espessura da camada limite <strong>de velocidade</strong> (eq. 7.19). Relação
                        válida para <InlineMath math={String.raw`\mathrm{Pr} \gtrsim 0{,}6`} /> (perfil similar).
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\delta_t`} /> ={" "}
                    {!Number.isFinite(deltaT) ? "—" : deltaT.toLocaleString(undefined, { maximumSignificantDigits: 5 })}{" m"}
                    <span style={{ marginLeft: 10, fontSize: "0.82rem", color: "#666" }}>
                        (<InlineMath math={String.raw`\delta`} /> ={" "}
                        {!Number.isFinite(deltaHyd) ? "—" : deltaHyd.toLocaleString(undefined, { maximumSignificantDigits: 5 })}{" m"}
                        )
                    </span>
                    {!ok && (
                        <span style={{ color: "#ca8a04", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ Para <InlineMath math={String.raw`\mathrm{Pr} \ll 1`} /> use correlações para metais líquidos (ex. 7.32).
                        </span>
                    )}
                </>
            }
        >
            <div style={{ marginBottom: 8, fontSize: "0.8rem" }}>
                <label style={{ marginRight: 12 }}>
                    <input
                        type="radio"
                        checked={mode === "delta"}
                        onChange={() => setMode("delta")}
                    />{" "}
                    Informar <InlineMath math={String.raw`\delta`} />
                </label>
                <label>
                    <input
                        type="radio"
                        checked={mode === "from719"}
                        onChange={() => setMode("from719")}
                    />{" "}
                    Calcular <InlineMath math={String.raw`\delta`} /> pela (7.19)
                </label>
            </div>
            {mode === "delta" ? (
                <SolverInput label="δ (m)" value={deltaIn} onChange={setDeltaIn} placeholderNode={<InlineMath math={String.raw`\delta`} />} />
            ) : (
                <>
                    <SolverInput label="Re_x" value={ReX} onChange={setReX} placeholderNode={<InlineMath math={String.raw`Re_x`} />} />
                    <SolverInput label="x (m)" value={x} onChange={setX} placeholderNode={<span>x</span>} />
                </>
            )}
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
        </SolverWrapper>
    );
}
