import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuXEq732 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq732({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [PeX, setPeX] = useState<string | number>(ip(initialParams, "PeX", 5000));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { PeX: Number(PeX) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [PeX, needsScaffolding, onParamsChange]);

    const nPe = Number(PeX) || 0;
    const nu = nuXEq732(nPe);
    const ok = nPe >= 100;

    return (
        <SolverWrapper
            title="Eq. (7.32) — Placa plana, laminar: metais líquidos (Nu local)"
            equationLatex={String.raw`Nu_x = 0{,}565 \, Pe_x^{1/2}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`\mathrm{Pr} \lesssim 0{,}05`} />;{" "}
                        <InlineMath math={String.raw`Pe_x = Re_x \, Pr \gtrsim 100`} />.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`Nu_x`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ <InlineMath math={String.raw`Pe_x \gtrsim 100`} />
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Pe_x" value={PeX} onChange={setPeX} placeholderNode={<InlineMath math={String.raw`Pe_x`} />} />
        </SolverWrapper>
    );
}
