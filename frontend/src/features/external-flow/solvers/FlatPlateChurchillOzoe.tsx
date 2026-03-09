import { useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import styles from "./FlatPlateChurchillOzoe.module.css";

// Churchill-Ozoe (1973): Nu_x = 0.3387 Re_x^0.5 Pr^(1/3) / [1 + (0.0468/Pr)^(2/3)]^0.25
// Valid for Pe_x = Re_x * Pr >= 100

function computeNuX(reX: number, pr: number): number | null {
    const peX = reX * pr;
    if (peX < 100) return null;
    const denom = Math.pow(1 + Math.pow(0.0468 / pr, 2 / 3), 0.25);
    if (denom <= 0) return null;
    return (0.3387 * Math.sqrt(reX) * Math.pow(pr, 1 / 3)) / denom;
}

export function FlatPlateChurchillOzoe() {
    const [reX, setReX] = useState<string>("50000");
    const [pr, setPr] = useState<string>("0.71");
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    function calculate() {
        const re = parseFloat(reX);
        const p = parseFloat(pr);
        setError(null);
        setResult(null);

        if (isNaN(re) || isNaN(p)) {
            setError("Re_x and Pr must be valid numbers.");
            return;
        }
        if (re <= 0 || p <= 0) {
            setError("Re_x and Pr must be positive.");
            return;
        }
        const peX = re * p;
        if (peX < 100) {
            setError("Pe_x = Re_x × Pr must be ≥ 100.");
            return;
        }

        const nu = computeNuX(re, p);
        setResult(nu);
    }

    const numRe = parseFloat(reX);
    const numPr = parseFloat(pr);
    const peX = !isNaN(numRe) && !isNaN(numPr) ? numRe * numPr : 0;
    const peValid = peX >= 100;

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Churchill–Ozoe (1973) — Laminar Flat Plate</h3>
            <p className={styles.subtitle}>
                Local Nusselt number. Eq. 7.33 Incropera. Requires Pe_x = Re_x × Pr ≥ 100.
            </p>

            <div className={styles.equationBlock}>
                <BlockMath math="\mathrm{Nu}_x = \frac{0.3387 \,\mathrm{Re}_x^{1/2} \,\mathrm{Pr}^{1/3}}{\left[1 + \left(\dfrac{0.0468}{\mathrm{Pr}}\right)^{2/3}\right]^{1/4}}" />
            </div>

            <div className={styles.quadrantsRow}>
                <label className={styles.quadrantLabel}>
                    <InlineMath math="\mathrm{Re}_x" />
                    <input
                        type="number"
                        className={styles.quadrant}
                        value={reX}
                        onChange={(e) => setReX(e.target.value)}
                        placeholder="Re_x"
                        title="Reynolds number at x"
                    />
                </label>
                <label className={styles.quadrantLabel}>
                    <InlineMath math="\mathrm{Pr}" />
                    <input
                        type="number"
                        className={styles.quadrant}
                        value={pr}
                        onChange={(e) => setPr(e.target.value)}
                        placeholder="Pr"
                        title="Prandtl number"
                    />
                </label>
            </div>

            <div className={styles.peHint}>
                Pe_x = Re_x × Pr = {peX.toLocaleString(undefined, { maximumFractionDigits: 0 })} {peValid ? "✓" : "(need ≥ 100)"}
            </div>

            <div className={styles.actions}>
                <button className={styles.calcBtn} onClick={calculate}>
                    Calculate Nu_x
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {result !== null && (
                <div className={styles.result}>
                    <InlineMath math="\mathrm{Nu}_x = " />
                    <span className={styles.resultValue}>{result.toFixed(4)}</span>
                </div>
            )}
        </div>
    );
}
