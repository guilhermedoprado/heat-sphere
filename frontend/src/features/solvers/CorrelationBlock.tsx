// src/features/solvers/CylinderFlow/CorrelationBlock.tsx
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import styles from "./CylinderFlow.module.css";

export function CorrelationBlock() {
    return (
        <div className={styles.correlationBlock}>
            <span className={styles.correlationTitle}>Churchill–Bernstein Correlation</span>
            <BlockMath math={String.raw`
                \overline{Nu}_D = 0.3 +
                \frac{0.62 \, Re_D^{1/2} \, Pr^{1/3}}
                     {\left[1 + \left(\dfrac{0.4}{Pr}\right)^{2/3}\right]^{1/4}}
                \left[1 + \left(\frac{Re_D}{282{,}000}\right)^{5/8}\right]^{4/5}
            `} />
            <span className={styles.correlationValidity}>
                Valid for <InlineMath math="Re_D \cdot Pr \geq 0.2" />, all <InlineMath math="Pr" />
            </span>
        </div>
    );
}
