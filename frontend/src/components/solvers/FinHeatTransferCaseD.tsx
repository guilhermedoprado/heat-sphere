import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type FinCaseDProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function FinHeatTransferCaseD({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: FinCaseDProps) {
    const [M, setM] = useState<string | number>(initialParams.M ?? 1.0);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = { M: Number(M) };
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(currentParams);
            return;
        }
        if (onParamsChange) onParamsChange(currentParams);
    }, [M]);

    const numM = Number(M) || 0;

    return (
        <SolverWrapper
            title="Fin Heat Transfer — Case D (Infinite Fin)"
            equationLatex="q_f = M"
            result={
                <>
                    <InlineMath math={`q_f = ${numM.toLocaleString(undefined, { maximumFractionDigits: 4 })}`} /> W
                </>
            }
        >
            <SolverInput
                label="M — Fin parameter M (W)"
                value={M}
                onChange={setM}
                placeholderNode={<InlineMath math="M \text{ (W)}" />}
            />
        </SolverWrapper>
    );
}
