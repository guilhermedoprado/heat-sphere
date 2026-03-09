import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type FinCaseAProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function FinHeatTransferCaseA({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: FinCaseAProps) {
    const [M, setM] = useState<string | number>(initialParams.M ?? 1.0);
    const [m, setm] = useState<string | number>(initialParams.m ?? 10);
    const [L, setL] = useState<string | number>(initialParams.L ?? 0.1);
    const [h, setH] = useState<string | number>(initialParams.h ?? 50);
    const [k, setK] = useState<string | number>(initialParams.k ?? 200);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            M: Number(M),
            m: Number(m),
            L: Number(L),
            h: Number(h),
            k: Number(k),
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
    }, [M, m, L, h, k]);

    const numM = Number(M) || 0;
    const numm = Number(m) || 0;
    const numL = Number(L) || 0;
    const numH = Number(h) || 0;
    const numK = Number(k) || 0;

    // h / (m·k)
    const hmk = numm > 0 && numK > 0 ? numH / (numm * numK) : 0;

    const mL = numm * numL;

    // q_f = M · [sinh(mL) + (h/mk)·cosh(mL)] / [cosh(mL) + (h/mk)·sinh(mL)]
    const numerator   = Math.sinh(mL) + hmk * Math.cosh(mL);
    const denominator = Math.cosh(mL) + hmk * Math.sinh(mL);

    const qf = denominator !== 0 ? numM * (numerator / denominator) : 0;

    return (
        <SolverWrapper
            title="Fin Heat Transfer — Case A (Convective Tip)"
            equationLatex="q_f = M\,\frac{\sinh(mL)+(h/mk)\cosh(mL)}{\cosh(mL)+(h/mk)\sinh(mL)}"
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
            <SolverInput
                label="h — Tip conv. coefficient (W/m²·K)"
                value={h}
                onChange={setH}
                placeholderNode={<InlineMath math="h \text{ (W/m²·K)}" />}
            />
            <SolverInput
                label="k — Thermal conductivity (W/m·K)"
                value={k}
                onChange={setK}
                placeholderNode={<InlineMath math="k \text{ (W/m \cdot K)}" />}
            />
        </SolverWrapper>
    );
}
