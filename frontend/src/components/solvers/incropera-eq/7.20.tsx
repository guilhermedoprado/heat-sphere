import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { cfLocalLaminarFlatPlate } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq720({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReX, setReX] = useState<string | number>(ip(initialParams, "ReX", 50000));
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
    const cf = cfLocalLaminarFlatPlate(nReX);
    const laminarOk = nReX > 0 && nReX < 5e5;

    return (
        <SolverWrapper
            title="Eq. (7.20) — Placa plana, laminar: coeficiente local de atrito"
            equationLatex={String.raw`C_{f,x} = 0{,}664 \, Re_x^{-1/2}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`C_{f,x} = \tau_s / (\frac{1}{2}\rho U_\infty^2)`} />; camada limite laminar,{" "}
                        <InlineMath math={String.raw`Re_x = U_\infty x / \nu`} />.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`C_{f,x}`} /> ={" "}
                    {!Number.isFinite(cf) ? "—" : cf.toLocaleString(undefined, { maximumSignificantDigits: 5 })}
                    {!laminarOk && nReX >= 5e5 && (
                        <span style={{ color: "#ca8a04", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ Regime turbulento: usar eq. (7.34).
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Re_x" value={ReX} onChange={setReX} placeholderNode={<InlineMath math={String.raw`Re_x`} />} />
        </SolverWrapper>
    );
}
