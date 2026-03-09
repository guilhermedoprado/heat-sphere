import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type ConstTsProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function MeanTemperatureConstTs({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: ConstTsProps) {
    const [Ts,   setTs]   = useState<string | number>(initialParams.Ts   ?? 400);
    const [Tmi,  setTmi]  = useState<string | number>(initialParams.Tmi  ?? 300);
    const [P,    setP]    = useState<string | number>(initialParams.P    ?? 0.0314);
    const [x,    setX]    = useState<string | number>(initialParams.x    ?? 1);
    const [h,    setH]    = useState<string | number>(initialParams.h    ?? 500);
    const [mdot, setMdot] = useState<string | number>(initialParams.mdot ?? 0.01);
    const [cp,   setCp]   = useState<string | number>(initialParams.cp   ?? 4182);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            Ts:   Number(Ts),
            Tmi:  Number(Tmi),
            P:    Number(P),
            x:    Number(x),
            h:    Number(h),
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
    }, [Ts, Tmi, P, x, h, mdot, cp]);

    const numTs   = Number(Ts)   || 0;
    const numTmi  = Number(Tmi)  || 0;
    const numP    = Number(P)    || 0;
    const numX    = Number(x)    || 0;
    const numH    = Number(h)    || 0;
    const numMdot = Number(mdot) || 0;
    const numCp   = Number(cp)   || 0;

    // Tm(x) = Ts - (Ts - Tm,i) · exp(-P·x·h̄ / (ṁ·cp))
    const Tmx = numMdot > 0 && numCp > 0
        ? numTs - (numTs - numTmi) * Math.exp(-(numP * numX * numH) / (numMdot * numCp))
        : 0;

    return (
        <SolverWrapper
            title="Internal Flow — Constant Surface Temperature"
            equationLatex="\frac{T_s - T_m(x)}{T_s - T_{m,i}} = \exp\!\left(-\frac{P \cdot x \cdot \bar{h}}{\dot{m} \cdot c_p}\right)"
            result={
                <>
                    <InlineMath math={`T_m(x) = ${Tmx.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} /> K
                </>
            }
        >
            <SolverInput
                label="Ts — Surface temperature (K)"
                value={Ts}
                onChange={setTs}
                placeholderNode={<InlineMath math="T_s \text{ (K)}" />}
            />
            <SolverInput
                label="Tm,i — Inlet mean temperature (K)"
                value={Tmi}
                onChange={setTmi}
                placeholderNode={<InlineMath math="T_{m,i} \text{ (K)}" />}
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
                label="h̄ — Mean conv. coefficient (W/m²·K)"
                value={h}
                onChange={setH}
                placeholderNode={<InlineMath math="\bar{h} \text{ (W/m²·K)}" />}
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
                placeholderNode={<InlineMath math="c_p \text{ (J/kg \cdot K)}" />}
            />
        </SolverWrapper>
    );
}
