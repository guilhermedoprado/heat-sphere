import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type ThetaDefProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function ThetaDefinition({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: ThetaDefProps) {
    const [T,    setT]    = useState<string | number>(initialParams.T    ?? 350);
    const [Tb,   setTb]   = useState<string | number>(initialParams.Tb   ?? 400);
    const [Tinf, setTinf] = useState<string | number>(initialParams.Tinf ?? 300);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            T:    Number(T),
            Tb:   Number(Tb),
            Tinf: Number(Tinf),
        };
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(currentParams);
            return;
        }
        if (onParamsChange) onParamsChange(currentParams);
    }, [T, Tb, Tinf]);

    const numT    = Number(T)    || 0;
    const numTb   = Number(Tb)   || 0;
    const numTinf = Number(Tinf) || 0;

    const theta  = numT  - numTinf;
    const thetaB = numTb - numTinf;

    return (
        <SolverWrapper
            title="Fin Excess Temperatures — θ and θ_b"
            equationLatex="\theta = T - T_\infty \qquad \theta_b = T_b - T_\infty"
            result={
                <>
                    <InlineMath math={`\\theta = ${theta.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} /> K
                    {" · "}
                    <InlineMath math={`\\theta_b = ${thetaB.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} /> K
                </>
            }
        >
            <SolverInput
                label="T — Local fin temperature (K)"
                value={T}
                onChange={setT}
                placeholderNode={<InlineMath math="T \text{ (K)}" />}
            />
            <SolverInput
                label="Tb — Base temperature (K)"
                value={Tb}
                onChange={setTb}
                placeholderNode={<InlineMath math="T_b \text{ (K)}" />}
            />
            <SolverInput
                label="T∞ — Ambient temperature (K)"
                value={Tinf}
                onChange={setTinf}
                placeholderNode={<InlineMath math="T_\infty \text{ (K)}" />}
            />
        </SolverWrapper>
    );
}
