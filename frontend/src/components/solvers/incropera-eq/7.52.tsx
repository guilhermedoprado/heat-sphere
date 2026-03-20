import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuBarEq752 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq752({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [C, setC] = useState<string | number>(ip(initialParams, "C", 0.989));
    const [m, setM] = useState<string | number>(ip(initialParams, "m", 0.33));
    const [ReD, setReD] = useState<string | number>(ip(initialParams, "ReD", 10000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { C: Number(C), m: Number(m), ReD: Number(ReD), Pr: Number(Pr) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [C, m, ReD, Pr, needsScaffolding, onParamsChange]);

    const nC = Number(C) || 0;
    const nm = Number(m) || 0;
    const nReD = Number(ReD) || 0;
    const nPr = Number(Pr) || 0;
    const nu = nuBarEq752(nC, nm, nReD, nPr);
    const ok = nReD >= 0.4 && nReD <= 4e5 && nPr >= 0.7;

    return (
        <SolverWrapper
            title="Eq. (7.52) — Cilindro em escoamento cruzado (Hilpert)"
            equationLatex={String.raw`\overline{Nu}_D = C \, Re_D^{m} \, Pr^{1/3}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`0{,}4 \lesssim Re_D \lesssim 4\times10^5`} />
                        ; <InlineMath math={String.raw`\mathrm{Pr} \gtrsim 0{,}7`} />. Constantes <InlineMath math="C" /> e{" "}
                        <InlineMath math="m" /> na <strong>Tabela 7.2</strong> (faixas de <InlineMath math={String.raw`Re_D`} />
                        ).
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
            <SolverInput label="Re_D" value={ReD} onChange={setReD} placeholderNode={<InlineMath math={String.raw`Re_D`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
        </SolverWrapper>
    );
}
