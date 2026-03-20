import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { Atransition, nuBarEq738, nuBarEq738Table } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq738({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [useTable871, setUseTable871] = useState<boolean>(initialParams.useTable871 === false ? false : true);
    const [ReL, setReL] = useState<string | number>(ip(initialParams, "ReL", 1e6));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const [ReXc, setReXc] = useState<string | number>(ip(initialParams, "ReXc", 500000));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = useTable871
            ? { useTable871: true, ReL: Number(ReL), Pr: Number(Pr) }
            : { useTable871: false, ReL: Number(ReL), Pr: Number(Pr), ReXc: Number(ReXc) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [useTable871, ReL, Pr, ReXc, needsScaffolding, onParamsChange]);

    const nReL = Number(ReL) || 0;
    const nPr = Number(Pr) || 0;
    const nReXc = Number(ReXc) || 0;
    const A = !useTable871 && nReXc > 0 ? Atransition(nReXc) : NaN;
    const nu = useTable871 ? nuBarEq738Table(nReL, nPr) : nuBarEq738(nReL, nPr, nReXc);
    const ok = nReL > 0 && nPr >= 0.6 && nPr <= 60 && nReL <= 1e8 && (useTable871 || nReL > nReXc);
    const okNu = Number.isFinite(nu) && nu > 0;

    return (
        <SolverWrapper
            title="Eq. (7.38) — Placa plana, mista: Nū médio"
            equationLatex={
                useTable871
                    ? String.raw`\overline{Nu}_L = \left(0{,}037 \, Re_L^{4/5} - 871\right) Pr^{1/3}`
                    : String.raw`\overline{Nu}_L = \left(0{,}037 \, Re_L^{4/5} - A\right) Pr^{1/3}`
            }
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades na <strong>temperatura de filme</strong> <InlineMath math={String.raw`T_f`} />.
                    </p>
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`Re_{x,c} = 5\times10^5`} /> na forma tabulada (constante 871);{" "}
                        <InlineMath math={String.raw`Re_L \lesssim 10^8`} />
                        ;{" "}
                        <InlineMath math={String.raw`0{,}6 \lesssim \mathrm{Pr} \lesssim 60`} />.
                    </p>
                    {!useTable871 && (
                        <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem" }}>
                            <InlineMath math={String.raw`A = 0{,}037\,Re_{x,c}^{4/5} - 0{,}664\,Re_{x,c}^{1/2}`} />.
                        </p>
                    )}
                </>
            }
            result={
                <>
                    {!useTable871 && (
                        <span style={{ fontSize: "0.9rem", fontWeight: 600, marginRight: 8 }}>
                            A = {Number.isFinite(A) ? A.toFixed(1) : "—"} ·{" "}
                        </span>
                    )}
                    <InlineMath math={String.raw`\overline{Nu}_L`} /> ={" "}
                    {!okNu ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && okNu && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ Verifique <InlineMath math={String.raw`Re_L,\ \mathrm{Pr}`} /> ou <InlineMath math={String.raw`Re_L > Re_{x,c}`} />
                        </span>
                    )}
                </>
            }
        >
            <div style={{ marginBottom: 8, fontSize: "0.8rem" }}>
                <label>
                    <input type="checkbox" checked={useTable871} onChange={(e) => setUseTable871(e.target.checked)} /> Usar{" "}
                    <InlineMath math={String.raw`Re_{x,c} = 5\times10^5`} /> (A = 871)
                </label>
            </div>
            <SolverInput label="Re_L" value={ReL} onChange={setReL} placeholderNode={<InlineMath math={String.raw`Re_L`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
            {!useTable871 && (
                <SolverInput label="Re_x,c" value={ReXc} onChange={setReXc} placeholderNode={<InlineMath math={String.raw`Re_{x,c}`} />} />
            )}
        </SolverWrapper>
    );
}
