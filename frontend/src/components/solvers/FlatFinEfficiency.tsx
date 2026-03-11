import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type FlatFinEfficiencyProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function FlatFinEfficiency({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: FlatFinEfficiencyProps) {
    const [m, setm] = useState<string | number>(initialParams.m ?? 10);
    const [L, setL] = useState<string | number>(initialParams.L ?? 0.05);
    const [w, setW] = useState<string | number>(initialParams.w ?? 0.1);
    const [t, setT] = useState<string | number>(initialParams.t ?? 0.002);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            m: Number(m),
            L: Number(L),
            w: Number(w),
            t: Number(t),
        };
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(currentParams);
            return;
        }
        if (onParamsChange) onParamsChange(currentParams);
    }, [m, L, w, t]);

    const numm = Number(m) || 0;
    const numL = Number(L) || 0;
    const numW = Number(w) || 0;
    const numT = Number(t) || 0;

    // Lc = L + t/2
    const Lc = numL + numT / 2;

    // mLc
    const mLc = numm * Lc;

    // η_f = tanh(mLc) / (mLc)   [Eq. 3.94]
    const eta = mLc > 0 ? Math.tanh(mLc) / mLc : 1;

    // Af = 2w·Lc
    const Af = 2 * numW * Lc;

    // Ap = t·L
    const Ap = numT * numL;

    return (
        <SolverWrapper
            title="Flat Fin Efficiency — Rectangular Profile (Eq. 3.94)"
            equationLatex={String.raw`\eta_f = \frac{\tanh(mL_c)}{mL_c} \qquad L_c = L + \frac{t}{2}`}
            result={
                <>
                    <InlineMath math={`L_c = ${Lc.toLocaleString(undefined, { maximumFractionDigits: 4 })}`} /> m
                    {" · "}
                    <InlineMath math={`\\eta_f = ${(eta * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}`} /> %
                    {" · "}
                    <InlineMath math={`A_f = ${Af.toLocaleString(undefined, { maximumFractionDigits: 6 })}`} /> m²
                    {" · "}
                    <InlineMath math={`A_p = ${Ap.toLocaleString(undefined, { maximumFractionDigits: 6 })}`} /> m²
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
                label="L — Fin length: base to tip (m)"
                value={L}
                onChange={setL}
                placeholderNode={<InlineMath math={String.raw`L \text{ (m)}`} />}
            />
            <SolverInput
                label="w — Fin width: span into the page (m)"
                value={w}
                onChange={setW}
                placeholderNode={<InlineMath math={String.raw`w \text{ (m)}`} />}
            />
            <SolverInput
                label="t — Fin thickness: base cross-section (m)"
                value={t}
                onChange={setT}
                placeholderNode={<InlineMath math={String.raw`t \text{ (m)}`} />}
            />
        </SolverWrapper>
    );
}
