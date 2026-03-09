import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type FinCaseBProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function FinHeatTransferCaseB({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: FinCaseBProps) {
    const [M, setM] = useState<string | number>(initialParams.M ?? 1.0);
    const [m, setm] = useState<string | number>(initialParams.m ?? 10);
    const [L, setL] = useState<string | number>(initialParams.L ?? 0.1);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            M: Number(M),
            m: Number(m),
            L: Number(L),
        };

        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (needsScaffolding && onParamsChange) {
                onParamsChange(currentParams);
            }
            return;
        }

        if (onParamsChange) {
            onParamsChange(currentParams);
        }
    }, [M, m, L]);

    const numM = Number(M) || 0;
    const numm = Number(m) || 0;
    const numL = Number(L) || 0;

    // q_f = M · tanh(mL)   [Case A — adiabatic tip, Eq. 3.72]
    const qf = numM * Math.tanh(numm * numL);

    return (
        <SolverWrapper
            title="Fin Heat Transfer — Case B (Adiabatic Tip)"
            equationLatex="q_f = M \tanh(mL)"
            result={
                <>
                    <InlineMath math={`q_f = ${qf.toLocaleString(undefined, { maximumFractionDigits: 4 })}`} /> W
                </>
            }
        >
            <SolverInput
                label="M — Fin parameter M (W)"
                value={M}
                onChange={setM}
                placeholderNode={<InlineMath math="M \text{ (W)}" />}
            />
            <SolverInput
                label="m — Fin parameter m (m⁻¹)"
                value={m}
                onChange={setm}
                placeholderNode={<InlineMath math="m \text{ (m}^{-1}\text{)}" />}
            />
            <SolverInput
                label="L — Fin length (m)"
                value={L}
                onChange={setL}
                placeholderNode={<InlineMath math="L \text{ (m)}" />}
            />
        </SolverWrapper>
    );
}
