import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { ip } from "./incroperaInitialParam";
import { InlineMath } from "react-katex";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq779_781({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReW, setReW] = useState<string | number>(ip(initialParams, "ReW", 10000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const [G4, setG4] = useState<string | number>(ip(initialParams, "G4", 1));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReW: Number(ReW), Pr: Number(Pr), G4: Number(G4) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReW, Pr, G4, needsScaffolding, onParamsChange]);

    const nRe = Number(ReW) || 0;
    const nPr = Number(Pr) || 0;
    const g = Number(G4) || 0;
    const nu = nRe > 0 && nPr > 0 ? Math.pow(nRe, 0.67) * Math.pow(nPr, 0.42) * g : NaN;

    return (
        <SolverWrapper
            title="Eq. (7.79–7.81) — Jatos, arranjo de ranhuras (Martin)"
            equationLatex={String.raw`\frac{\overline{Nu}_w}{Re_w^{0{,}67} \, Pr^{0{,}42}} = G_4\!\left(A_r,\,\frac{H}{w}\right)`}
            equationAside={
                <>
                    <strong>Uso</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`G_4`} /> conforme Martin; depende de <InlineMath math={String.raw`A_r`} /> e{" "}
                        <InlineMath math={String.raw`H/w`} />.
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
            <SolverInput label="G4" value={G4} onChange={setG4} placeholderNode={<InlineMath math={String.raw`G_4`} />} />
        </SolverWrapper>
    );
}
