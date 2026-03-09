import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type TempDistCaseCProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function FinTempDistCaseC({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: TempDistCaseCProps) {
    const [m,      setm]      = useState<string | number>(initialParams.m      ?? 10);
    const [L,      setL]      = useState<string | number>(initialParams.L      ?? 0.1);
    const [x,      setX]      = useState<string | number>(initialParams.x      ?? 0.05);
    const [thetaB, setThetaB] = useState<string | number>(initialParams.thetaB ?? 50);
    const [thetaL, setThetaL] = useState<string | number>(initialParams.thetaL ?? 20);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            m:      Number(m),
            L:      Number(L),
            x:      Number(x),
            thetaB: Number(thetaB),
            thetaL: Number(thetaL),
        };
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(currentParams);
            return;
        }
        if (onParamsChange) onParamsChange(currentParams);
    }, [m, L, x, thetaB, thetaL]);

    const numm      = Number(m)      || 0;
    const numL      = Number(L)      || 0;
    const numX      = Number(x)      || 0;
    const numThetaB = Number(thetaB) || 0;
    const numThetaL = Number(thetaL) || 0;

    // θ/θb = [(θL/θb)sinh(mx) + sinh(m(L-x))] / sinh(mL)
    const ratioLB  = numThetaB !== 0 ? numThetaL / numThetaB : 0;
    const mL       = numm * numL;
    const sinhML   = Math.sinh(mL);

    const numerator = ratioLB * Math.sinh(numm * numX) + Math.sinh(numm * (numL - numX));
    const ratio     = sinhML !== 0 ? numerator / sinhML : 0;
    const theta     = ratio * numThetaB;

    return (
        <SolverWrapper
            title="Fin Temp. Distribution — Case C (Prescribed Tip Temp.)"
            equationLatex="\frac{\theta}{\theta_b} = \frac{(\theta_L/\theta_b)\sinh(mx)+\sinh[m(L-x)]}{\sinh(mL)}"
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
                label="L — Fin length (m)"
                value={L}
                onChange={setL}
                placeholderNode={<InlineMath math="L \text{ (m)}" />}
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
            <SolverInput
                label="θL — Tip excess temp (K)  (T_L - T∞)"
                value={thetaL}
                onChange={setThetaL}
                placeholderNode={<InlineMath math="\theta_L \text{ (K)}" />}
            />
        </SolverWrapper>
    );
}
