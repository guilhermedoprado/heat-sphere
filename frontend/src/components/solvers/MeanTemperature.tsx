import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type MeanTempProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function MeanTemperature({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: MeanTempProps) {
    const [Tmi,  setTmi]  = useState<string | number>(initialParams.Tmi  ?? 300);
    const [qs,   setQs]   = useState<string | number>(initialParams.qs   ?? 1000);
    const [P,    setP]    = useState<string | number>(initialParams.P    ?? 0.0314);
    const [x,    setX]    = useState<string | number>(initialParams.x    ?? 1);
    const [mdot, setMdot] = useState<string | number>(initialParams.mdot ?? 0.01);
    const [cp,   setCp]   = useState<string | number>(initialParams.cp   ?? 4182);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            Tmi:  Number(Tmi),
            qs:   Number(qs),
            P:    Number(P),
            x:    Number(x),
            mdot: Number(mdot),
            cp:   Number(cp),
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
    }, [Tmi, qs, P, x, mdot, cp]);

    const numTmi  = Number(Tmi)  || 0;
    const numQs   = Number(qs)   || 0;
    const numP    = Number(P)    || 0;
    const numX    = Number(x)    || 0;
    const numMdot = Number(mdot) || 0;
    const numCp   = Number(cp)   || 0;

    // Tm(x) = Tm,i + q''s · P · x / (ṁ · cp)
    const Tmx = numMdot > 0 && numCp > 0
        ? numTmi + (numQs * numP * numX) / (numMdot * numCp)
        : 0;

    return (
        <SolverWrapper
            title="Internal Flow — Constant Surface Heat Flux"
            equationLatex="T_m(x) = T_{m,i} + \frac{q_s'' \cdot P \cdot x}{\dot{m} \cdot c_p}"
            result={
                <>
                    <InlineMath math={`T_m(x) = ${Tmx.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} /> K
                </>
            }
        >
            <SolverInput
                label="Tm,i — Inlet mean temperature (K)"
                value={Tmi}
                onChange={setTmi}
                placeholderNode={<InlineMath math="T_{m,i} \text{ (K)}" />}
            />
            <SolverInput
                label="q''s — Surface heat flux (W/m²)"
                value={qs}
                onChange={setQs}
                placeholderNode={<InlineMath math="q_s'' \text{ (W/m²)}" />}
            />
            <SolverInput
                label="P — Section perimeter (m)"
                value={P}
                onChange={setP}
                placeholderNode={<InlineMath math="P \text{ (m)}" />}
            />
            <SolverInput
                label="x — Axial position (m)"
                value={x}
                onChange={setX}
                placeholderNode={<InlineMath math="x \text{ (m)}" />}
            />
            <SolverInput
                label="ṁ — Mass flow rate (kg/s)"
                value={mdot}
                onChange={setMdot}
                placeholderNode={<InlineMath math="\dot{m} \text{ (kg/s)}" />}
            />
            <SolverInput
                label="cp — Specific heat (J/kg·K)"
                value={cp}
                onChange={setCp}
                placeholderNode={<InlineMath math="c_p \text{ (J/kgK)}" />}
            />
        </SolverWrapper>
    );
}
