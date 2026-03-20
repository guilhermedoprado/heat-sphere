import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuBarEq760 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq760({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [C1, setC1] = useState<string | number>(ip(initialParams, "C1", 0.27));
    const [C2, setC2] = useState<string | number>(ip(initialParams, "C2", 1));
    const [m, setM] = useState<string | number>(ip(initialParams, "m", 0.63));
    const [ReDmax, setReDmax] = useState<string | number>(ip(initialParams, "ReDmax", 15000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = {
            C1: Number(C1),
            C2: Number(C2),
            m: Number(m),
            ReDmax: Number(ReDmax),
            Pr: Number(Pr),
        };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [C1, C2, m, ReDmax, Pr, needsScaffolding, onParamsChange]);

    const nu = nuBarEq760(Number(C1) || 0, Number(C2) || 0, Number(m) || 0, Number(ReDmax) || 0, Number(Pr) || 0);
    const nRe = Number(ReDmax) || 0;
    const nPr = Number(Pr) || 0;
    const ok = nRe >= 2000 && nRe <= 4e4 && nPr >= 0.7;

    return (
        <SolverWrapper
            title="Eq. (7.60) — Banco de tubos (Zukauskas, forma simplificada)"
            equationLatex={String.raw`\overline{Nu}_D = 1{,}13 \, C_1 \, C_2 \, Re_{D,\max}^{m} \, Pr^{1/3}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura média de filme</strong> <InlineMath math={String.raw`\overline{T}_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`2000 \lesssim Re_{D,\max} \lesssim 4\times10^4`} />
                        ; <InlineMath math={String.raw`\mathrm{Pr} \gtrsim 0{,}7`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math="C_1" />, <InlineMath math="m" /> — <strong>Tabela 7.5</strong>; <InlineMath math="C_2" /> —{" "}
                        <strong>Tabela 7.6</strong> (efeito do nº de fileiras).
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{Nu}_D`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ Verifique <InlineMath math={String.raw`Re_{D,\max},\ \mathrm{Pr}`} />
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="C1" value={C1} onChange={setC1} placeholderNode={<InlineMath math="C_1" />} />
            <SolverInput label="C2" value={C2} onChange={setC2} placeholderNode={<InlineMath math="C_2" />} />
            <SolverInput label="m" value={m} onChange={setM} placeholderNode={<InlineMath math="m" />} />
            <SolverInput label="Re_D,max" value={ReDmax} onChange={setReDmax} placeholderNode={<InlineMath math={String.raw`Re_{D,\max}`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
        </SolverWrapper>
    );
}
