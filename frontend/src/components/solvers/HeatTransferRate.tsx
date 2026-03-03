import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type HeatTransferProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean; // Prop nova!
};

export function HeatTransferRate({ initialParams = {}, onParamsChange, needsScaffolding = false }: HeatTransferProps) {
    const [h, setH] = useState<string | number>(initialParams.h ?? 10);
    const [area, setArea] = useState<string | number>(initialParams.area ?? 2);
    const [tempSurface, setTempSurface] = useState<string | number>(initialParams.ts ?? 100);
    const [tempAmbient, setTempAmbient] = useState<string | number>(initialParams.tinf ?? 50);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            h: Number(h),
            area: Number(area),
            ts: Number(tempSurface),
            tinf: Number(tempAmbient)
        };

        if (isFirstRender.current) {
            isFirstRender.current = false;
            // Se precisa gerar o esqueleto (bloco tava vazio), avisa o pai AGORA
            if (needsScaffolding && onParamsChange) {
                onParamsChange(currentParams);
            }
            return;
        }

        // Depois da primeira vez, qualquer mudança atualiza o pai
        if (onParamsChange) {
            onParamsChange(currentParams);
        }
    }, [h, area, tempSurface, tempAmbient]); // Tiramos needsScaffolding pra não dar trigger duplo

    // Converte para número apenas na hora do cálculo, ou assume 0 se for inválido
    const numH = Number(h) || 0;
    const numArea = Number(area) || 0;
    const numTs = Number(tempSurface) || 0;
    const numTinf = Number(tempAmbient) || 0;

    const q = numH * numArea * (numTs - numTinf);

    return (
        <SolverWrapper
            title="Heat Transfer Rate (Newton's Law)"
            equationLatex="q = h \cdot A \cdot (T_s - T_\infty)"
            result={
                <>
                    <InlineMath math="q =" /> {q.toLocaleString(undefined, { maximumFractionDigits: 2 })} W
                </>
            }
        >
            <SolverInput
                label="h (W/m²K)"
                value={h}
                onChange={setH}
                placeholderNode={<InlineMath math="h \text{ (W/m²K)}" />}
            />

            <SolverInput
                label="Area (m²)"
                value={area}
                onChange={setArea}
                placeholderNode={<InlineMath math="A \text{ (m²)}" />}
            />

            <SolverInput
                label="Ts (K)"
                value={tempSurface}
                onChange={setTempSurface}
                placeholderNode={<InlineMath math="T_s \text{ (K)}" />}
            />

            <SolverInput
                label="T∞ (K)"
                value={tempAmbient}
                onChange={setTempAmbient}
                placeholderNode={<InlineMath math="T_\infty \text{ (K)}" />}
            />
        </SolverWrapper>
    );
}
