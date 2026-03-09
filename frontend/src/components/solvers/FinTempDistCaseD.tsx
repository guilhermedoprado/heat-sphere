import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type TempDistCaseDProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function FinTempDistCaseD({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: TempDistCaseDProps) {
    const [m,      setm]      = useState<string | number>(initialParams.m      ?? 10);
    const [x,      setX]      = useState<string | number>(initialParams.x      ?? 0.05);
    const [thetaB, setThetaB] = useState<string | number>(initialParams.thetaB ?? 50);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            m:      Number(m),
            x:      Number(x),
            thetaB: Number(thetaB),
        };
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(currentParams);
            return;
        }
        if (onParamsChange) onParamsChange(currentParams);
    }, [m, x, thetaB]);

    const numm      = Number(m)      || 0;
    const numX      = Number(x)      || 0;
    const numThetaB = Number(thetaB) || 0;

    // θ/θb = e^(-mx)
    const ratio = Math.exp(-numm * numX);
    const theta = ratio * numThetaB;

    return (
        <SolverWrapper
            title="Fin Temp. Distribution — Case D (Infinite Fin)"
            equationLatex="\frac{\theta}{\theta_b} = e^{-mx}"
            result={
                <>
                    <InlineMath math={`\\theta/\\theta_b = ${ratio.toLocaleString(undefined, { maximumFractionDigits: 4 })}`} />
                    {" · "}
                    <InlineMath math={`\\theta = ${theta.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} /> K
                </>
            }
        >
            <SolverInput
                label="m — Fin parameter m (m⁻¹)"
                value={m}
                onChange={setm}
                placeholderNode={<InlineMath math="m \text{ (m}^{-1}\text{)}" />}
            />
            <SolverInput
                label="x — Position along fin (m)"
                value={x}
                onChange={setX}
                placeholderNode={<InlineMath math="x \text{ (m)}" />}
            />
            <SolverInput
                label="θb — Base excess temp (K)  (T_b - T∞)"
                value={thetaB}
                onChange={setThetaB}
                placeholderNode={<InlineMath math="\theta_b \text{ (K)}" />}
            />
        </SolverWrapper>
    );
}
