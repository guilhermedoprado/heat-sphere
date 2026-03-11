import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type CrossFlowEnergyProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function CrossFlowEnergyBalance({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: CrossFlowEnergyProps) {
    const [Ts,   setTs]   = useState<string | number>(initialParams.Ts   ?? 400);
    const [Tinf, setTinf] = useState<string | number>(initialParams.Tinf ?? 300);
    const [U,    setU]    = useState<string | number>(initialParams.U    ?? 200);
    const [A,    setA]    = useState<string | number>(initialParams.A    ?? 0.5);
    const [mdot, setMdot] = useState<string | number>(initialParams.mdot ?? 0.05);
    const [cp,   setCp]   = useState<string | number>(initialParams.cp   ?? 4182);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            Ts:   Number(Ts),
            Tinf: Number(Tinf),
            U:    Number(U),
            A:    Number(A),
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
    }, [Ts, Tinf, U, A, mdot, cp]);

    const numTs   = Number(Ts)   || 0;
    const numTinf = Number(Tinf) || 0;
    const numU    = Number(U)    || 0;
    const numA    = Number(A)    || 0;
    const numMdot = Number(mdot) || 0;
    const numCp   = Number(cp)   || 0;

    // T_inf,o = Ts - (Ts - T_inf,i) · exp(-UA / ṁcp)
    const Tout = numMdot > 0 && numCp > 0
        ? numTs - (numTs - numTinf) * Math.exp(-(numU * numA) / (numMdot * numCp))
        : 0;

    // q = ṁ cp (Tout - Tinf,i)
    const q = numMdot * numCp * (Tout - numTinf);

    return (
        <SolverWrapper
            title="Cross-Flow Energy Balance — Constant Ts"
            equationLatex={String.raw`\frac{T_s - T_{\infty,o}}{T_s - T_{\infty,i}} = \exp\!\left(-\frac{UA}{\dot{m}\,c_p}\right)`}
            result={
                <>
                    <InlineMath math={`T_{\\infty,o} = ${Tout.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} /> K
                    {" · "}
                    <InlineMath math={`q = ${q.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} /> W
                </>
            }
        >
            <SolverInput
                label="Ts — Surface temperature (K)"
                value={Ts}
                onChange={setTs}
                placeholderNode={<InlineMath math={String.raw`T_s \text{ (K)}`} />}
            />
            <SolverInput
                label="T∞,i — Fluid inlet temperature (K)"
                value={Tinf}
                onChange={setTinf}
                placeholderNode={<InlineMath math={String.raw`T_{\infty,i} \text{ (K)}`} />}
            />
            <SolverInput
                label="U — Overall heat transfer coefficient (W/m²·K)"
                value={U}
                onChange={setU}
                placeholderNode={<InlineMath math={String.raw`U \text{ (W/m²·K)}`} />}
            />
            <SolverInput
                label="A — Total surface area (m²)"
                value={A}
                onChange={setA}
                placeholderNode={<InlineMath math={String.raw`A \text{ (m²)}`} />}
            />
            <SolverInput
                label="ṁ — Mass flow rate (kg/s)"
                value={mdot}
                onChange={setMdot}
                placeholderNode={<InlineMath math={String.raw`\dot{m} \text{ (kg/s)}`} />}
            />
            <SolverInput
                label="cp — Specific heat (J/kg·K)"
                value={cp}
                onChange={setCp}
                placeholderNode={<InlineMath math={String.raw`c_p \text{ (J/kg \cdot K)}`} />}
            />
        </SolverWrapper>
    );
}
