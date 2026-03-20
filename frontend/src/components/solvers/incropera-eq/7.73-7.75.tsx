import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { ip } from "./incroperaInitialParam";
import { InlineMath } from "react-katex";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq773_775({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReW, setReW] = useState<string | number>(ip(initialParams, "ReW", 10000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const [G2F2, setG2F2] = useState<string | number>(ip(initialParams, "G2F2", 1));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReW: Number(ReW), Pr: Number(Pr), G2F2: Number(G2F2) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReW, Pr, G2F2, needsScaffolding, onParamsChange]);

    const nRe = Number(ReW) || 0;
    const nPr = Number(Pr) || 0;
    const g = Number(G2F2) || 0;
    const nu = nRe > 0 && nPr > 0 ? Math.pow(nRe, 0.5) * Math.pow(nPr, 0.42) * g : NaN;

    return (
        <SolverWrapper
            title="Eq. (7.73–7.75) — Jato impingente, ranhura única (Martin)"
            equationLatex={String.raw`\frac{\overline{Nu}_w}{Re_w^{1/2} \, Pr^{0{,}42}} = G_2\!\left(\frac{x}{w},\,\frac{H}{w}\right) F_2(Re_w)`}
            equationAside={
                <>
                    <strong>Uso</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Produto <InlineMath math={String.raw`G_2 \cdot F_2`} /> a partir do texto (em função de{" "}
                        <InlineMath math={String.raw`x/w`} />, <InlineMath math={String.raw`H/w`} />, <InlineMath math={String.raw`Re_w`} />
                        ).
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{Nu}_w`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </>
            }
        >
            <SolverInput label="Re_w" value={ReW} onChange={setReW} placeholderNode={<InlineMath math={String.raw`Re_w`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
            <SolverInput label="G2·F2" value={G2F2} onChange={setG2F2} placeholderNode={<span>G₂·F₂</span>} />
        </SolverWrapper>
    );
}
