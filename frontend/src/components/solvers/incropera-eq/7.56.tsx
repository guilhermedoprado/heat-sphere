import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "../SolverWrapper";
import { InlineMath } from "react-katex";
import { nuBarEq756 } from "./incroperaExternalFlowFormulas";
import { ip } from "./incroperaInitialParam";

type P = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

export function SolverEq756({ initialParams = {}, onParamsChange, needsScaffolding = false }: P) {
    const [ReD, setReD] = useState<string | number>(ip(initialParams, "ReD", 1000));
    const [Pr, setPr] = useState<string | number>(ip(initialParams, "Pr", 0.71));
    const [muRatio, setMuRatio] = useState<string | number>(ip(initialParams, "muRatio", 1.2));
    const isFirst = useRef(true);

    useEffect(() => {
        const p = { ReD: Number(ReD), Pr: Number(Pr), muRatio: Number(muRatio) };
        if (isFirst.current) {
            isFirst.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(p);
            return;
        }
        onParamsChange?.(p);
    }, [ReD, Pr, muRatio, needsScaffolding, onParamsChange]);

    const nReD = Number(ReD) || 0;
    const nPr = Number(Pr) || 0;
    const nMu = Number(muRatio) || 0;
    const nu = nuBarEq756(nReD, nPr, nMu);
    const ok =
        nReD >= 3.5 &&
        nReD <= 7.6e4 &&
        nPr >= 0.71 &&
        nPr <= 380 &&
        nMu >= 1.0 &&
        nMu <= 3.2;

    return (
        <SolverWrapper
            title="Eq. (7.56) — Esfera em escoamento externo (Whitaker)"
            equationLatex={String.raw`\overline{Nu}_D = 2 + \left(0{,}4 \, Re_D^{1/2} + 0{,}06 \, Re_D^{2/3}\right) Pr^{0{,}4} \left(\frac{\mu}{\mu_s}\right)^{1/4}`}
            equationAside={
                <>
                    <strong>Condições</strong>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem" }}>
                        Propriedades em <InlineMath math={String.raw`T_\infty`} />; <InlineMath math={String.raw`\mu_s`} /> avaliada na temperatura da
                        superfície <InlineMath math={String.raw`T_s`} />.
                    </p>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`3{,}5 \lesssim Re_D \lesssim 7{,}6\times10^4`} />
                    </p>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`0{,}71 \lesssim Pr \lesssim 380`} />
                    </p>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.72rem" }}>
                        <InlineMath math={String.raw`1{,}0 \lesssim \mu/\mu_s \lesssim 3{,}2`} />
                    </p>
                </>
            }
            result={
                <>
                    <InlineMath math={String.raw`\overline{Nu}_D`} /> ={" "}
                    {!Number.isFinite(nu) ? "—" : nu.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {!ok && (
                        <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.85em", fontWeight: 600 }}>
                            ⚠ Fora do domínio da Tabela 7.9
                        </span>
                    )}
                </>
            }
        >
            <SolverInput label="Re_D" value={ReD} onChange={setReD} placeholderNode={<InlineMath math={String.raw`Re_D`} />} />
            <SolverInput label="Pr" value={Pr} onChange={setPr} placeholderNode={<InlineMath math={String.raw`\mathrm{Pr}`} />} />
            <SolverInput
                label="μ/μ_s"
                value={muRatio}
                onChange={setMuRatio}
                placeholderNode={<InlineMath math={String.raw`\mu/\mu_s`} />}
            />
        </SolverWrapper>
    );
}
