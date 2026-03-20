import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { ip } from "./incroperaInitialParam";
import { InlineMath } from "react-katex";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq776_778({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReD, setReD] = useState<string | number>(ip(initialParams, "ReD", 10000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const [G3, setG3] = useState<string | number>(ip(initialParams, "G3", 1));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReD: Number(ReD), Pr: Number(Pr), G3: Number(G3) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReD, Pr, G3, needsScaffolding, onParamsChange]);

    const nRe = Number(ReD) || 0;
    const nPr = Number(Pr) || 0;
    const g = Number(G3) || 0;
    const nu = nRe > 0 && nPr > 0 ? Math.pow(nRe, 0.6) * Math.pow(nPr, 0.42) * g : NaN;

    return (
        <SolverWrapper
            title="Eq. (7.76–7.78) — Jatos, arranjo de bocais circulares (Martin)"
            equationLatex={String.raw`\frac{\overline{Nu}_D}{Re_D^{0{,}6} \, Pr^{0{,}42}} = G_3\!\left(A_r,\,\frac{H}{D}\right)`}
            equationAside={
                <>
                    <strong>Uso</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`A_r`} />: fração de área de abertura.{" "}
                        <InlineMath math={String.raw`G_3`} /> dado por Martin em função de <InlineMath math={String.raw`A_r`} />,{" "}
                        <InlineMath math={String.raw`H/D`} />.
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
            <SolverInput label="G3" value={G3} onChange={setG3} placeholderNode={<InlineMath math={String.raw`G_3`} />} />
        </SolverWrapper>
    );
}
