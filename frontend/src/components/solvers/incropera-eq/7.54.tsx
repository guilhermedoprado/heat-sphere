import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuBarEq754 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq754({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReD, setReD] = useState<string | number>(ip(initialParams, "ReD", 10000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.7296));
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
    const nu = nuBarEq754(nReD, nPr);
    const ok = nReD * nPr >= 0.2;

    return (
        <SolverWrapper
            title="Eq. (7.54) — Cilindro: Churchill–Bernstein"
            equationLatex={String.raw`\overline{Nu}_D = 0{,}3 + \frac{0{,}62 \, Re_D^{1/2} \, Pr^{1/3}}{\left[1 + \left(\dfrac{0{,}4}{Pr}\right)^{2/3}\right]^{1/4}} \left[1 + \left(\frac{Re_D}{282\,000}\right)^{5/8}\right]^{4/5}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        Válida para todo <InlineMath math={String.raw`Re_D`} />; exige{" "}
                        <InlineMath math={String.raw`Re_D \, Pr \gtrsim 0{,}2`} />.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{Nu}_D`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ <InlineMath math={String.raw`Re_D Pr \geq 0{,}2`} />
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Re_D" value={ReD} onChange={setReD} placeholderNode={<InlineMath math={String.raw`Re_D`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
        </SolverWrapper>
    );
}
