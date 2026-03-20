import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { deltaLaminar, deltaOverXLaminar } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq719({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReX, setReX] = useState<string | number>(ip(initialParams, "ReX", 50000));
    const [x, setX] = useState<string | number>(ip(initialParams, "x", 0.5));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReX: Number(ReX), x: Number(x) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReX, x, needsScaffolding, onParamsChange]);

    const nReX = Number(ReX) || 0;
    const nx = Number(x) || 0;
    const ratio = deltaOverXLaminar(nReX);
    const delta = deltaLaminar(nx, nReX);
    const laminarOk = nReX > 0 && nReX < 5e5;

    return (
        <SolverWrapper
            title="Eq. (7.19) — Placa plana, laminar: espessura da camada limite hidrodinâmica"
            equationLatex={String.raw`\delta = 5x \, Re_x^{-1/2}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        Camada limite laminar; <InlineMath math="x" /> medido da borda de ataque;{" "}
                        <InlineMath math={String.raw`Re_x = U_\infty x / \nu`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        Definição usual: <InlineMath math={String.raw`u/U_\infty \approx 0{,}99`} /> em <InlineMath math={String.raw`y = \delta`} />.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\delta/x`} /> ={" "}
                    {!Number.isFinite(ratio) ? "—" : ratio.toLocaleString(undefined, { maximumSignificantDigits: 5 })}
                    {" · "}
                    <InlineMath math={String.raw`\delta`} /> ={" "}
                    {!Number.isFinite(delta) ? "—" : delta.toLocaleString(undefined, { maximumSignificantDigits: 5 })}{" m"}
                    {!laminarOk && nReX >= 5e5 && (
                        <span style={{ color: "#ca8a04", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ <InlineMath math={String.raw`Re_x`} /> alto — fluxo pode já ser turbulento (use 7.35).
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Re_x" value={ReX} onChange={setReX} placeholderNode={<InlineMath math={String.raw`Re_x`} />} />
            <SolverInput label="x (m)" value={x} onChange={setX} placeholderNode={<span>x</span>} />
        </SolverWrapper>
    );
}
