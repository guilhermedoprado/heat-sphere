import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuXEq736 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq736({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReX, setReX] = useState<string | number>(ip(initialParams, "ReX", 1e6));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 7));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReX: Number(ReX), Pr: Number(Pr) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReX, Pr, needsScaffolding, onParamsChange]);

    const nReX = Number(ReX) || 0;
    const nPr = Number(Pr) || 0;
    const nu = nuXEq736(nReX, nPr);
    const ok = nReX > 0 && nReX <= 1e8 && nPr >= 0.6 && nPr <= 60;

    return (
        <SolverWrapper
            title="Eq. (7.36) — Placa plana, turbulento: Nu local"
            equationLatex={String.raw`Nu_x = 0{,}0296 \, Re_x^{4/5} \, Pr^{1/3}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`Re_x \lesssim 10^8`} />
                        ;{" "}
                        <InlineMath math={String.raw`0{,}6 \lesssim \mathrm{Pr} \lesssim 60`} />.
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`Nu_x`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ Verifique <InlineMath math={String.raw`Re_x,\ \mathrm{Pr}`} />
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Re_x" value={ReX} onChange={setReX} placeholderNode={<InlineMath math={String.raw`Re_x`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
        </SolverWrapper>
    );
}
