import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuXExtendedPr } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq722({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReX, setReX] = useState<string | number>(ip(initialParams, "ReX", 50000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReX: Number(ReX), Pr: Number(Pr) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReX, Pr, needsScaffolding, onParamsChange]);

    const nReX = Number(ReX) || 0;
    const nPr = Number(Pr) || 0;
    const nu = nuXExtendedPr(nReX, nPr);
    const ok = nReX > 0 && nPr > 0 && nReX * nPr >= 100;

    return (
        <SolverWrapper
            title="Eq. (7.22*) — Placa laminar: Nu_x (todos os Pr, extensão)"
            equationLatex={String.raw`Nu_x = \frac{0{,}3387 \, Re_x^{1/2} \, Pr^{1/3}}{\left[1 + \left(\dfrac{0{,}0468}{Pr}\right)^{2/3}\right]^{1/4}}`}
            equationAside={
                <>
                    <strong>Domínio</strong>
                    <p style={{ margin: "0.35rem 0 0" }}>
                        Mesmas convenções da (7.21). <InlineMath math={String.raw`Re_x \, Pr \geq 100`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem", color: "#666" }}>
                        Para <InlineMath math={String.raw`\mathrm{Pr} \gtrsim 0{,}6`} />, ver eq. (7.23) na Tabela 7.9.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`Nu_x`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ <InlineMath math={String.raw`Re_x Pr \geq 100`} />
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Re_x" value={ReX} onChange={setReX} placeholderNode={<InlineMath math={String.raw`Re_x`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
        </SolverWrapper>
    );
}
