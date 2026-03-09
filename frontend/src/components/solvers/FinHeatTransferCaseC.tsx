import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type FinCaseCProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function FinHeatTransferCaseC({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: FinCaseCProps) {
    const [M,      setM]      = useState<string | number>(initialParams.M      ?? 1.0);
    const [m,      setm]      = useState<string | number>(initialParams.m      ?? 10);
    const [L,      setL]      = useState<string | number>(initialParams.L      ?? 0.1);
    const [thetaB, setThetaB] = useState<string | number>(initialParams.thetaB ?? 50);
    const [thetaL, setThetaL] = useState<string | number>(initialParams.thetaL ?? 20);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            M:      Number(M),
            m:      Number(m),
            L:      Number(L),
            thetaB: Number(thetaB),
            thetaL: Number(thetaL),
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
    }, [M, m, L, thetaB, thetaL]);

    const numM      = Number(M)      || 0;
    const numm      = Number(m)      || 0;
    const numL      = Number(L)      || 0;
    const numThetaB = Number(thetaB) || 0;
    const numThetaL = Number(thetaL) || 0;

    const mL = numm * numL;

    // q_f = M · [cosh(mL) - θL/θb] / sinh(mL)
    const ratio = numThetaB !== 0 ? numThetaL / numThetaB : 0;
    const denom = Math.sinh(mL);

    const qf = denom !== 0
        ? numM * (Math.cosh(mL) - ratio) / denom
        : 0;

    return (
        <SolverWrapper
            title="Fin Heat Transfer — Case C (Prescribed Tip Temp.)"
            equationLatex="q_f = M\,\frac{\cosh(mL) - \theta_L/\theta_b}{\sinh(mL)}"
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
                label="θb — Base excess temp (K)  (T_b - T∞)"
                value={thetaB}
                onChange={setThetaB}
                placeholderNode={<InlineMath math="\theta_b \text{ (K)}" />}
            />
            <SolverInput
                label="θL — Tip excess temp (K)  (T_L - T∞)"
                value={thetaL}
                onChange={setThetaL}
                placeholderNode={<InlineMath math="\theta_L \text{ (K)}" />}
            />
        </SolverWrapper>
    );
}
