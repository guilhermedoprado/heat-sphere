import { useState, useEffect, useRef } from "react";
import { SolverWrapper, SolverInput } from "./SolverWrapper";
import { InlineMath } from "react-katex";

type LinearInterpolationProps = {
    initialParams?: Record<string, any>;
    onParamsChange?: (params: Record<string, any>) => void;
    needsScaffolding?: boolean;
};

export function LinearInterpolation({
    initialParams = {},
    onParamsChange,
    needsScaffolding = false,
}: LinearInterpolationProps) {
    const [x1, setX1] = useState<string | number>(initialParams.x1 ?? 300);
    const [y1, setY1] = useState<string | number>(initialParams.y1 ?? 1.589);
    const [x2, setX2] = useState<string | number>(initialParams.x2 ?? 350);
    const [y2, setY2] = useState<string | number>(initialParams.y2 ?? 2.076);
    const [x,  setX]  = useState<string | number>(initialParams.x  ?? 325);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const currentParams = {
            x1: Number(x1),
            y1: Number(y1),
            x2: Number(x2),
            y2: Number(y2),
            x:  Number(x),
        };
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (needsScaffolding && onParamsChange) onParamsChange(currentParams);
            return;
        }
        if (onParamsChange) onParamsChange(currentParams);
    }, [x1, y1, x2, y2, x]);

    const numX1 = Number(x1);
    const numY1 = Number(y1);
    const numX2 = Number(x2);
    const numY2 = Number(y2);
    const numX  = Number(x);

    // y = y1 + [(x - x1) / (x2 - x1)] * (y2 - y1)
    const dx = numX2 - numX1;
    const valid = dx !== 0 && !isNaN(numX1) && !isNaN(numY1) && !isNaN(numX2) && !isNaN(numY2) && !isNaN(numX);
    const t = valid ? (numX - numX1) / dx : null;
    const y = t !== null ? numY1 + t * (numY2 - numY1) : null;

    const outOfRange = t !== null && (t < 0 || t > 1);

    const resultNode = (() => {
        if (!valid) return <>Invalid inputs — check that x₁ ≠ x₂.</>;
        if (y === null) return null;
        return (
            <>
                <InlineMath math={`y = ${y.toPrecision(6)}`} />
                {outOfRange && (
                    <span style={{ fontSize: "0.8rem", color: "#92400e", marginLeft: "0.5rem" }}>
                        ⚠ x is outside [x₁, x₂]
                    </span>
                )}
            </>
        );
    })();

    return (
        <SolverWrapper
            title="Linear Interpolation"
            equationLatex="y = y_1 + \frac{x - x_1}{x_2 - x_1}(y_2 - y_1)"
            result={resultNode}
        >
            <SolverInput
                label="x₁ — First known x"
                value={x1}
                onChange={setX1}
                placeholderNode={<InlineMath math="x_1" />}
            />
            <SolverInput
                label="y₁ — Value at x₁"
                value={y1}
                onChange={setY1}
                placeholderNode={<InlineMath math="y_1" />}
            />
            <SolverInput
                label="x₂ — Second known x"
                value={x2}
                onChange={setX2}
                placeholderNode={<InlineMath math="x_2" />}
            />
            <SolverInput
                label="y₂ — Value at x₂"
                value={y2}
                onChange={setY2}
                placeholderNode={<InlineMath math="y_2" />}
            />
            <SolverInput
                label="x — Target x value"
                value={x}
                onChange={setX}
                placeholderNode={<InlineMath math="x" />}
            />
        </SolverWrapper>
    );
}
