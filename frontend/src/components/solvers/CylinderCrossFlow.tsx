import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type CylinderCrossFlowProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function CylinderCrossFlow({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: CylinderCrossFlowProps) {
    const [ReD, setReD] = useState<string | number>(initialParams.ReD ?? 10000);
    const [Pr,  setPr]  = useState<string | number>(initialParams.Pr  ?? 0.7296);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            ReD: Number(ReD),
            Pr:  Number(Pr),
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
    }, [ReD, Pr]);

    const numReD = Number(ReD) || 0;
    const numPr  = Number(Pr)  || 0;

    // Churchill-Bernstein — Eq. 7.33 (Incropera)
    const NuD = (() => {
        if (numReD <= 0 || numPr <= 0) return 0;
        const numerator      = 0.62 * Math.pow(numReD, 0.5) * Math.pow(numPr, 1 / 3);
        const denominator    = Math.pow(1 + Math.pow(0.4 / numPr, 2 / 3), 0.25);
        const correctionTerm = Math.pow(1 + Math.pow(numReD / 282000, 5 / 8), 4 / 5);
        return 0.3 + (numerator / denominator) * correctionTerm;
    })();

    const isValid = numReD * numPr >= 0.2;

    return (
        <SolverWrapper
            title="Cylinder in Cross Flow — Churchill-Bernstein"
            equationLatex="\overline{Nu}_D = 0.3 + \frac{0.62\,Re_D^{1/2}\,Pr^{1/3}}{\left[1+(0.4/Pr)^{2/3}\right]^{1/4}}\!\left[1+\!\left(\frac{Re_D}{282000}\right)^{\!5/8}\right]^{\!4/5}"
            result={
                <>
                    <InlineMath math={`\\overline{Nu}_D = ${NuD.toLocaleString(undefined, { maximumFractionDigits: 4 })}`} />
                    {!isValid && (
                        <span style={{ color: "red", marginLeft: 8, fontSize: "0.85em" }}>
                            ⚠ Re·Pr &lt; 0,2 (fora do domínio)
                        </span>
                    )}
                </>
            }
        >
            <SolverInput
                label="Re_D"
                value={ReD}
                onChange={setReD}
                placeholderNode={<InlineMath math="Re_D" />}
            />
            <SolverInput
                label="Pr"
                value={Pr}
                onChange={setPr}
                placeholderNode={<InlineMath math="\mathrm{Pr}" />}
            />
        </SolverWrapper>
    );
}
