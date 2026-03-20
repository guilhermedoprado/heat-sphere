import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuBarEq764 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

function initialCFromParams(p: Record<string, unknown>): number {
    if (typeof p.C === "number" || typeof p.C === "string") return Number(p.C);
    if (typeof p.C1 === "number" || typeof p.C1 === "string") return Number(p.C1);
    return 0.27;
}

export function SolverEq764({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [C, setC] = useState<string | number>(initialCFromParams(initialParams));
    const [C2, setC2] = useState<string | number>(ip(initialParams, "C2", 1));
    const [m, setM] = useState<string | number>(ip(initialParams, "m", 0.63));
    const [ReDmax, setReDmax] = useState<string | number>(ip(initialParams, "ReDmax", 50000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const [Prs, setPrs] = useState<string | number>(ip(initialParams, "Prs", 0.71));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = {
            C: Number(C),
            C2: Number(C2),
            m: Number(m),
            ReDmax: Number(ReDmax),
            Pr: Number(Pr),
            Prs: Number(Prs),
        };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [C, C2, m, ReDmax, Pr, Prs, needsScaffolding, onParamsChange]);

    const nC = Number(C) || 0;
    const nC2 = Number(C2) || 0;
    const nm = Number(m) || 0;
    const nRe = Number(ReDmax) || 0;
    const nPr = Number(Pr) || 0;
    const nPrs = Number(Prs) || 0;
    const nuBase = nuBarEq764(nC, nC2, nm, nRe, nPr, nPrs);
    const ok = nPr >= 0.7 && nPr <= 500 && nRe >= 1000 && nRe <= 2e6;

    return (
        <SolverWrapper
            title="Eq. (7.64) — Banco de tubos (Zukauskas)"
            equationLatex={String.raw`\overline{Nu}_D = C \, C_2 \, Re_{D,\max}^{m} \, Pr^{0{,}36} \left(\frac{Pr}{Pr_s}\right)^{1/4}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura média de filme</strong> <InlineMath math={String.raw`\overline{T}_f`} />;{" "}
                        <InlineMath math={String.raw`Pr_s`} /> na temperatura da superfície do tubo.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`10^3 \lesssim Re_{D,\max} \lesssim 2\times10^6`} />
                        ; <InlineMath math={String.raw`0{,}7 \lesssim Pr \lesssim 500`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math="C" />, <InlineMath math="m" /> — <strong>Tabela 7.5</strong>; <InlineMath math="C_2" /> —{" "}
                        <strong>Tabela 7.6</strong> se <InlineMath math={String.raw`N_L < 20`} /> (use <InlineMath math="C_2=1" /> se não houver correção).
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{Nu}_D`} /> ={" "}
                    {!Number.isFinite(nuBase) ? "—" : nuBase.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ Verifique <InlineMath math={String.raw`Pr,\, Re_{D,\max}`} />
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="C" value={C} onChange={setC} placeholderNode={<InlineMath math="C" />} />
            <SolverInput label="C2" value={C2} onChange={setC2} placeholderNode={<InlineMath math="C_2" />} />
            <SolverInput label="m" value={m} onChange={setM} placeholderNode={<InlineMath math="m" />} />
            <SolverInput label="Re_D,max" value={ReDmax} onChange={setReDmax} placeholderNode={<InlineMath math={String.raw`Re_{D,\max}`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
            <SolverInput label="Pr_s" value={Prs} onChange={setPrs} placeholderNode={<InlineMath math={String.raw`Pr_s`} />} />
        </SolverWrapper>
    );
}
