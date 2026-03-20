import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuBarEq753 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq753({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [C, setC] = useState<string | number>(ip(initialParams, "C", 0.26));
    const [m, setM] = useState<string | number>(ip(initialParams, "m", 0.6));
    const [n, setN] = useState<string | number>(ip(initialParams, "n", 0.37));
    const [ReD, setReD] = useState<string | number>(ip(initialParams, "ReD", 100000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const [Prs, setPrs] = useState<string | number>(ip(initialParams, "Prs", 0.71));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { C: Number(C), m: Number(m), n: Number(n), ReD: Number(ReD), Pr: Number(Pr), Prs: Number(Prs) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [C, m, n, ReD, Pr, Prs, needsScaffolding, onParamsChange]);

    const nC = Number(C) || 0;
    const nm = Number(m) || 0;
    const nn = Number(n) || 0;
    const nReD = Number(ReD) || 0;
    const nPr = Number(Pr) || 0;
    const nPrs = Number(Prs) || 0;
    const nu = nuBarEq753(nC, nm, nn, nReD, nPr, nPrs);
    const ok = nReD >= 1 && nReD <= 1e6 && nPr >= 0.7 && nPr <= 500;

    return (
        <SolverWrapper
            title="Eq. (7.53) — Cilindro em escoamento cruzado"
            equationLatex={String.raw`\overline{Nu}_D = C \, Re_D^{m} \, Pr^{n} \left(\frac{Pr}{Pr_s}\right)^{1/4}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades em <InlineMath math={String.raw`T_\infty`} />; <InlineMath math={String.raw`Pr_s`} /> na temperatura da
                        superfície.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`1 \lesssim Re_D \lesssim 10^6`} />
                        ; <InlineMath math={String.raw`0{,}7 \lesssim Pr \lesssim 500`} />. Constantes <InlineMath math="C" />,{" "}
                        <InlineMath math="m" />, <InlineMath math="n" /> na <strong>Tabela 7.4</strong>.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{Nu}_D`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ Verifique domínio da Tabela 7.9
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="C" value={C} onChange={setC} placeholderNode={<InlineMath math="C" />} />
            <SolverInput label="m" value={m} onChange={setM} placeholderNode={<InlineMath math="m" />} />
            <SolverInput label="n" value={n} onChange={setN} placeholderNode={<InlineMath math="n" />} />
            <SolverInput label="Re_D" value={ReD} onChange={setReD} placeholderNode={<InlineMath math={String.raw`Re_D`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
            <SolverInput label="Pr_s" value={Prs} onChange={setPrs} placeholderNode={<InlineMath math={String.raw`Pr_s`} />} />
        </SolverWrapper>
    );
}
