import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { cfBarLaminar729 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

/** Coeficiente médio de atrito no trecho 0 → x (ou 0 → L); use Re no comprimento considerado. */
export function SolverEq729({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [Re, setRe] = useState<string | number>(ip(initialParams, "Re", 100000));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { Re: Number(Re) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [Re, needsScaffolding, onParamsChange]);

    const nRe = Number(Re) || 0;
    const cfBar = cfBarLaminar729(nRe);
    const laminarOk = nRe > 0 && nRe < 5e5;

    return (
        <SolverWrapper
            title="Eq. (7.29) — Placa plana, laminar: coeficiente médio de atrito"
            equationLatex={String.raw`\overline{C}_{f,x} = 1{,}328 \, Re_x^{-1/2}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`Re_x`} /> (ou <InlineMath math={String.raw`Re_L`} />
                        ) avaliado no comprimento sobre o qual se média <InlineMath math={String.raw`\overline{C}_f`} />, com fluxo laminar ao longo da placa.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{C}_{f,x}`} /> ={" "}
                    {!Number.isFinite(cfBar) ? "—" : cfBar.toLocaleString(undefined, { maximumSignificantDigits: 5 })}
                    {!laminarOk && nRe >= 5e5 && (
                        <span style={{ color: "#ca8a04", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ <InlineMath math={String.raw`Re`} /> alto — ver eq. (7.40) para placa mista.
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Re" value={Re} onChange={setRe} placeholderNode={<InlineMath math={String.raw`Re_x\ \mathrm{ou}\ Re_L`} />} />
        </SolverWrapper>
    );
}
