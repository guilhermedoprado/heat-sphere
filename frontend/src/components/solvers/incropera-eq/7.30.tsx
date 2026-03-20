import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuBarEq730 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq730({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReX, setReX] = useState<string | number>(ip(initialParams, "ReX", 100000));
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

    const nRe = Number(ReX) || 0;
    const nPr = Number(Pr) || 0;
    const nu = nuBarEq730(nRe, nPr);
    const ok = nRe > 0 && nPr >= 0.6;

    return (
        <SolverWrapper
            title="Eq. (7.30) — Placa plana, laminar: Nu médio"
            equationLatex={String.raw`\overline{Nu}_x = 0{,}664 \, Re_x^{1/2} \, Pr^{1/3}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`\mathrm{Pr} \gtrsim 0{,}6`} />; superfície isotérmica;{" "}
                        <InlineMath math={String.raw`\overline{Nu}_x`} /> médio de 0 até <InlineMath math="x" />.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{Nu}_x`} /> ={" "}
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
