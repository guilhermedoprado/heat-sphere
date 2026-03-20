import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { deltaOverXTurbulentFlatPlate, deltaTurbulentFlatPlate } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq735({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReX, setReX] = useState<string | number>(ip(initialParams, "ReX", 1e6));
    const [x, setX] = useState<string | number>(ip(initialParams, "x", 1));
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
    const ratio = deltaOverXTurbulentFlatPlate(nReX);
    const delta = deltaTurbulentFlatPlate(nx, nReX);
    const okRe = nReX > 0 && nReX <= 1e8;
    const turbulentHint = nReX >= 5e5;

    return (
        <SolverWrapper
            title="Eq. (7.35) — Placa plana, turbulento: espessura da camada limite"
            equationLatex={String.raw`\delta = 0{,}37x \, Re_x^{-1/5}`}
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
                    <InlineMath math={String.raw`\delta/x`} /> ={" "}
                    {!Number.isFinite(ratio) ? "—" : ratio.toLocaleString(undefined, { maximumSignificantDigits: 5 })}
                    {" · "}
                    <InlineMath math={String.raw`\delta`} /> ={" "}
                    {!Number.isFinite(delta) ? "—" : delta.toLocaleString(undefined, { maximumSignificantDigits: 5 })}{" m"}
                    {!turbulentHint && nReX > 0 && nReX < 5e5 && (
                        <span style={{ color: "#ca8a04", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ <InlineMath math={String.raw`Re_x`} /> baixo — considere (7.19) laminar
                        </span>
                    )}
                    {!okRe && nReX > 1e8 && (
                        <span style={{ color: "#ca8a04", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ Fora do intervalo <InlineMath math={String.raw`Re_x \lesssim 10^8`} />
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
