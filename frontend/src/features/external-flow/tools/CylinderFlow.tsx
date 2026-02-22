import { useState } from "react";
import axios from "axios";
import styles from "./CylinderFlow.module.css";

type ResponseDto = {
    id: string;
    name: string;
    diameter: number;
    velocity: number;
    fluidTemperatureK: number;
    surfaceTemperatureK: number;
    filmTemperature: number;
    kinematicViscosity: number;
    prandtl: number;
    thermalConductivity: number;
    reynolds: number;
    nusselt: number;
    heatTransferCoefficient: number;
    heatFlux: number;
};

export function CylinderFlowCalculator() {
    const [name, setName] = useState("Cilindro");
    const [diameter, setDiameter] = useState(0.05);         
    const [velocity, setVelocity] = useState(10);           
    const [fluidTemp, setFluidTemp] = useState(300);        
    const [surfaceTemp, setSurfaceTemp] = useState(350);    

    const [res, setRes] = useState<ResponseDto | null>(null);

    async function run() {
        const { data } = await axios.post<ResponseDto>("/api/cylinder-flow/calculate", {
            name: name,
            diameter: diameter,
            velocity: velocity,
            fluidTemperature: fluidTemp,       
            surfaceTemperature: surfaceTemp
        });
        setRes(data);
    }

    return (
        <div className={styles.container}>
            <div className={styles.container}>
                <h1 className={styles.title}>Cylinder Flow Solver</h1>
                <p className={styles.description}>
                    Calculate heat transfer coefficients for cross-flow over a circular cylinder using Churchill-Bernstein correlation.
                </p>
            </div>

            <div className={styles.inputsContainer}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Identifier</label>
                    <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Diameter - D (m)</label>
                    <input type="number" className={styles.input} value={diameter} onChange={(e) => setDiameter(+e.target.value)} placeholder="m" />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Velocity - V (m/s)</label>
                    <input type="number" className={styles.input} value={velocity} onChange={(e) => setVelocity(+e.target.value)} placeholder="m/s" />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Fluid Temperature - T∞ (K)</label>
                    <input type="number" className={styles.input} value={fluidTemp} onChange={(e) => setFluidTemp(+e.target.value)} placeholder="K" />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Surface Temperature - Ts (K)</label>
                    <input type="number" className={styles.input} value={surfaceTemp} onChange={(e) => setSurfaceTemp(+e.target.value)} placeholder="K" />
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.primaryButton} onClick={run}>Calculate</button>
                {res && <button className={styles.secondaryButton} onClick={() => setRes(null)}>Clear Results</button>}
            </div>

            {res && (
                <div className={styles.resultsContainer}>
                    <div className={styles.resultCard}>
                        <span className={styles.resultLabel}>Heat Transfer Coeff. (h)</span>
                        <div className={styles.resultValue}>
                            <span className={styles.highlight}>{res.heatTransferCoefficient.toFixed(2)}</span>
                            <span className={styles.resultUnit}>W/(m²·K)</span>
                        </div>
                    </div>

                    <div className={styles.resultCard}>
                        <span className={styles.resultLabel}>Heat Flux (q")</span>
                        <div className={styles.resultValue}>
                            {res.heatFlux.toFixed(2)}
                            <span className={styles.resultUnit}>W/m²</span>
                        </div>
                    </div>

                    <div className={styles.resultCard}>
                        <span className={styles.resultLabel}>Nusselt Number (Nu)</span>
                        <div className={styles.resultValue}>{res.nusselt.toFixed(2)}</div>
                    </div>

                    <div className={styles.resultCard}>
                        <span className={styles.resultLabel}>Reynolds Number (Re)</span>
                        <div className={styles.resultValue}>{res.reynolds.toExponential(2)}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
