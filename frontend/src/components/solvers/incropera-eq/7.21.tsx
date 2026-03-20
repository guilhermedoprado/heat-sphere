import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuBarExtendedPr } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

/** Extensão Nū_L para todos os Pr (Re_L Pr ≥ 100); não consta na Tabela 7.9 resumida — uso complementar. */
export function SolverEq721({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReL, setReL] = useState<string | number>(ip(initialParams, "ReL", 100000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReL: Number(ReL), Pr: Number(Pr) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReL, Pr, needsScaffolding, onParamsChange]);

    const nReL = Number(ReL) || 0;
    const nPr = Number(Pr) || 0;
    const nu = nuBarExtendedPr(nReL, nPr);
    const ok = nReL > 0 && nPr > 0 && nReL * nPr >= 100;

    return (
        <SolverWrapper
            title="Eq. (7.21*) — Placa laminar: Nū_L (todos os Pr, extensão)"
            equationLatex={String.raw`\overline{Nu}_L = \frac{0{,}6774 \, Re_L^{1/2} \, Pr^{1/3}}{\left[1 + \left(\dfrac{0{,}0468}{Pr}\right)^{2/3}\right]^{1/4}}`}
            equationAside={
                <>
                    <strong>Domínio</strong>
                    <p style={{ margin: "0.35rem 0 0" }}>
                        Propriedades em <InlineMath math={String.raw`T_f = (T_s + T_\infty)/2`} />; <InlineMath math={String.raw`\mu_s`} /> em{" "}
                        <InlineMath math={String.raw`T_s`} />. <InlineMath math={String.raw`Re_L \, Pr \geq 100`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem", color: "#666" }}>
                        Para <InlineMath math={String.raw`\mathrm{Pr} \gtrsim 0{,}6`} />, a Tabela 7.9 usa a eq. (7.30).
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{Nu}_L`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ Exija <InlineMath math={String.raw`Re_L Pr \geq 100`} />
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Re_L" value={ReL} onChange={setReL} placeholderNode={<InlineMath math={String.raw`Re_L`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
        </SolverWrapper>
    );
}
