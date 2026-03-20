import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { cfBarMixed740 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

/** Placa com transição em Re_{x,c} = 5×10^5 (constante 1742 da tabela). */
export function SolverEq740({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReL, setReL] = useState<string | number>(ip(initialParams, "ReL", 1e6));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReL: Number(ReL) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReL, needsScaffolding, onParamsChange]);

    const nReL = Number(ReL) || 0;
    const cfBar = cfBarMixed740(nReL);
    const ok = nReL > 0 && nReL <= 1e8;

    return (
        <SolverWrapper
            title="Eq. (7.40) — Placa plana, mista: coeficiente médio de atrito"
            equationLatex={String.raw`\overline{C}_{f,L} = 0{,}074 \, Re_L^{-1/5} - 1742 \, Re_L^{-1}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        Trecho laminar até <InlineMath math={String.raw`Re_{x,c} = 5\times10^5`} />;{" "}
                        <InlineMath math={String.raw`Re_L \lesssim 10^8`} />.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{C}_{f,L}`} /> ={" "}
                    {!Number.isFinite(cfBar) ? "—" : cfBar.toLocaleString(undefined, { maximumSignificantDigits: 5 })}
                    {!ok && nReL > 1e8 && (
                        <span style={{ color: "#ca8a04", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ <InlineMath math={String.raw`Re_L`} /> acima do intervalo indicado
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Re_L" value={ReL} onChange={setReL} placeholderNode={<InlineMath math={String.raw`Re_L`} />} />
        </SolverWrapper>
    );
}
