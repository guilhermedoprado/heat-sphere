import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { cfLocalTurbulent734 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq734({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReX, setReX] = useState<string | number>(ip(initialParams, "ReX", 1e6));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReX: Number(ReX) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReX, needsScaffolding, onParamsChange]);

    const nReX = Number(ReX) || 0;
    const cf = cfLocalTurbulent734(nReX);
    const ok = nReX > 0 && nReX <= 1e8;

    return (
        <SolverWrapper
            title="Eq. (7.34) — Placa plana, turbulento: coeficiente local de atrito"
            equationLatex={String.raw`C_{f,x} = 0{,}0592 \, Re_x^{-1/5}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        Camada limite turbulenta; <InlineMath math={String.raw`Re_x \lesssim 10^8`} />.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`C_{f,x}`} /> ={" "}
                    {!Number.isFinite(cf) ? "—" : cf.toLocaleString(undefined, { maximumSignificantDigits: 5 })}
                    {!ok && nReX > 1e8 && (
                        <span style={{ color: "#ca8a04", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ <InlineMath math={String.raw`Re_x`} /> acima do intervalo típico da correlação
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Re_x" value={ReX} onChange={setReX} placeholderNode={<InlineMath math={String.raw`Re_x`} />} />
        </SolverWrapper>
    );
}
