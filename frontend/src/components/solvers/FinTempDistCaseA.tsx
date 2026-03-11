import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type TempDistCaseAProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function FinTempDistCaseA({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: TempDistCaseAProps) {
    const [m,      setm]      = useState<string | number>(initialParams.m      ?? 10);
    const [L,      setL]      = useState<string | number>(initialParams.L      ?? 0.1);
    const [x,      setX]      = useState<string | number>(initialParams.x      ?? 0.05);
    const [h,      setH]      = useState<string | number>(initialParams.h      ?? 50);
    const [k,      setK]      = useState<string | number>(initialParams.k      ?? 200);
    const [thetaB, setThetaB] = useState<string | number>(initialParams.thetaB ?? 50);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            m:      Number(m),
            L:      Number(L),
            x:      Number(x),
            h:      Number(h),
            k:      Number(k),
            thetaB: Number(thetaB),
        };
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(currentParams);
            return;
        }
        if (onParamsChange) onParamsChange(currentParams);
    }, [m, L, x, h, k, thetaB]);

    const numm      = Number(m)      || 0;
    const numL      = Number(L)      || 0;
    const numX      = Number(x)      || 0;
    const numH      = Number(h)      || 0;
    const numK      = Number(k)      || 0;
    const numThetaB = Number(thetaB) || 0;

    // θ/θb = [cosh(m(L-x)) + (h/mk)sinh(m(L-x))] / [cosh(mL) + (h/mk)sinh(mL)]
    const hmk  = numm > 0 && numK > 0 ? numH / (numm * numK) : 0;
    const mL   = numm * numL;
    const mLx  = numm * (numL - numX);

    const numerator   = Math.cosh(mLx) + hmk * Math.sinh(mLx);
    const denominator = Math.cosh(mL)  + hmk * Math.sinh(mL);

    const ratio = denominator !== 0 ? numerator / denominator : 0;
    const theta = ratio * numThetaB;

    return (
        <SolverWrapper
            title="Fin Temp. Distribution — Case A (Convective Tip)"
            equationLatex={String.raw`\frac{\theta}{\theta_b} = \frac{\cosh[m(L-x)]+(h/mk)\sinh[m(L-x)]}{\cosh(mL)+(h/mk)\sinh(mL)}`}
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
                placeholderNode={<InlineMath math={String.raw`m \text{ (m}^{-1}\text{)}`} />}
            />
            <SolverInput
                label="L — Fin length (m)"
                value={L}
                onChange={setL}
                placeholderNode={<InlineMath math={String.raw`L \text{ (m)}`} />}
            />
            <SolverInput
                label="x — Position along fin (m)"
                value={x}
                onChange={setX}
                placeholderNode={<InlineMath math={String.raw`x \text{ (m)}`} />}
            />
            <SolverInput
                label="h — Tip conv. coefficient (W/m²·K)"
                value={h}
                onChange={setH}
                placeholderNode={<InlineMath math={String.raw`h \text{ (W/m²·K)}`} />}
            />
            <SolverInput
                label="k — Thermal conductivity (W/m·K)"
                value={k}
                onChange={setK}
                placeholderNode={<InlineMath math={String.raw`k \text{ (W/mK)}`} />}
            />
            <SolverInput
                label="θb — Base excess temp (K)  (T_b - T∞)"
                value={thetaB}
                onChange={setThetaB}
                placeholderNode={<InlineMath math={String.raw`\theta_b \text{ (K)}`} />}
            />
        </SolverWrapper>
    );
}
