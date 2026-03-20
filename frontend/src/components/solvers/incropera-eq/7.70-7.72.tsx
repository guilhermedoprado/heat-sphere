import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { ip } from "./incroperaInitialParam";
import { InlineMath } from "react-katex";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

/** Martin — bocal circular único; G₁(r/D,H/D)·F₁(Re_D) vem do texto (algebraico). */
export function SolverEq770_772({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReD, setReD] = useState<string | number>(ip(initialParams, "ReD", 10000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const [G1F1, setG1F1] = useState<string | number>(ip(initialParams, "G1F1", 1));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReD: Number(ReD), Pr: Number(Pr), G1F1: Number(G1F1) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReD, Pr, G1F1, needsScaffolding, onParamsChange]);

    const nRe = Number(ReD) || 0;
    const nPr = Number(Pr) || 0;
    const g = Number(G1F1) || 0;
    const nu = nRe > 0 && nPr > 0 ? Math.pow(nRe, 0.5) * Math.pow(nPr, 0.42) * g : NaN;

    return (
        <SolverWrapper
            title="Eq. (7.70–7.72) — Jato impingente, bocal circular (Martin)"
            equationLatex={String.raw`\frac{\overline{Nu}_D}{Re_D^{1/2} \, Pr^{0{,}42}} = G_1\!\left(\frac{r}{D},\,\frac{H}{D}\right) F_1(Re_D)`}
            equationAside={
                <>
                    <strong>Uso</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Informe o produto <InlineMath math={String.raw`G_1 \cdot F_1`} /> obtido das expressões de Martin (funções de{" "}
                        <InlineMath math={String.raw`r/D`} />, <InlineMath math={String.raw`H/D`} />, <InlineMath math={String.raw`Re_D`} />
                        ).
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
            <SolverInput label="G1·F1" value={G1F1} onChange={setG1F1} placeholderNode={<span>G₁·F₁</span>} />
        </SolverWrapper>
    );
}
