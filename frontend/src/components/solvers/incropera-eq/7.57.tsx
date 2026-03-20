import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuBarEq757 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq757({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReD, setReD] = useState<string | number>(ip(initialParams, "ReD", 100));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 5));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReD: Number(ReD), Pr: Number(Pr) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReD, Pr, needsScaffolding, onParamsChange]);

    const nReD = Number(ReD) || 0;
    const nPr = Number(Pr) || 0;
    const nu = nuBarEq757(nReD, nPr);

    return (
        <SolverWrapper
            title="Eq. (7.57) — Gota em queda livre"
            equationLatex={String.raw`\overline{Nu}_D = 2 + 0{,}6 \, Re_D^{1/2} \, Pr^{1/3}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na temperatura da corrente livre <InlineMath math={String.raw`T_\infty`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`Re_D`} /> baseado no diâmetro da gota e na velocidade relativa gota–ar.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{Nu}_D`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </>
            }
        >
            <SolverInput label="Re_D" value={ReD} onChange={setReD} placeholderNode={<InlineMath math={String.raw`Re_D`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
        </SolverWrapper>
    );
}
