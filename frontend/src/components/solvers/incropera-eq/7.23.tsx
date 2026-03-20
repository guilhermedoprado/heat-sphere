import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuXEq723 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq723({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
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
    const nu = nuXEq723(nReX, nPr);
    const ok = nReX > 0 && nPr >= 0.6;

    return (
        <SolverWrapper
            title="Eq. (7.23) — Placa plana, laminar: Nu local"
            equationLatex={String.raw`Nu_x = 0{,}332 \, Re_x^{1/2} \, Pr^{1/3}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`\mathrm{Pr} \gtrsim 0{,}6`} />; superfície isotérmica.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`Nu_x`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ <InlineMath math={String.raw`\mathrm{Pr} \gtrsim 0{,}6`} />
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
