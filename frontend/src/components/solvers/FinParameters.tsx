import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type FinParametersProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function FinParameters({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: FinParametersProps) {
    const [h,      setH]      = useState<string | number>(initialParams.h      ?? 50);
    const [P,      setP]      = useState<string | number>(initialParams.P      ?? 0.04);
    const [k,      setK]      = useState<string | number>(initialParams.k      ?? 200);
    const [Ac,     setAc]     = useState<string | number>(initialParams.Ac     ?? 1e-4);
    const [thetaB, setThetaB] = useState<string | number>(initialParams.thetaB ?? 50);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            h:      Number(h),
            P:      Number(P),
            k:      Number(k),
            Ac:     Number(Ac),
            thetaB: Number(thetaB),
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
    }, [h, P, k, Ac, thetaB]);

    const numH      = Number(h)      || 0;
    const numP      = Number(P)      || 0;
    const numK      = Number(k)      || 0;
    const numAc     = Number(Ac)     || 0;
    const numThetaB = Number(thetaB) || 0;

    // m = sqrt(hP / kAc)
    const m = numK > 0 && numAc > 0
        ? Math.sqrt((numH * numP) / (numK * numAc))
        : 0;

    // M = sqrt(hPkAc) · θb
    const M = Math.sqrt(numH * numP * numK * numAc) * numThetaB;

    return (
        <SolverWrapper
            title="Fin Parameters — m and M"
            equationLatex={String.raw`m = \sqrt{\frac{hP}{kA_c}} \qquad M = \sqrt{hPkA_c}\,\theta_b`}
            result={
                <>
                    <InlineMath math={`m = ${m.toLocaleString(undefined, { maximumFractionDigits: 4 })}`} /> m⁻¹
                    {" · "}
                    <InlineMath math={`M = ${M.toLocaleString(undefined, { maximumFractionDigits: 4 })}`} /> W
                </>
            }
        >
            <SolverInput
                label="h — Conv. coefficient (W/m²·K)"
                value={h}
                onChange={setH}
                placeholderNode={<InlineMath math={String.raw`h \text{ (W/m²·K)}`} />}
            />
            <SolverInput
                label="P — Fin perimeter (m)"
                value={P}
                onChange={setP}
                placeholderNode={<InlineMath math={String.raw`P \text{ (m)}`} />}
            />
            <SolverInput
                label="k — Thermal conductivity (W/m·K)"
                value={k}
                onChange={setK}
                placeholderNode={<InlineMath math={String.raw`k \text{ (W/m·K)}`} />}
            />
            <SolverInput
                label="Ac — Cross-sectional area (m²)"
                value={Ac}
                onChange={setAc}
                placeholderNode={<InlineMath math={String.raw`A_c \text{ (m²)}`} />}
            />
            <SolverInput
                label="θb — Excess temperature (K)  (T_b - T∞)"
                value={thetaB}
                onChange={setThetaB}
                placeholderNode={<InlineMath math={String.raw`\theta_b \text{ (K)}`} />}
            />
        </SolverWrapper>
    );
}
