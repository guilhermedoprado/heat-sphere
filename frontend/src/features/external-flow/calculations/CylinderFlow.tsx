import { useState } from "react";
import { AxiosError } from "axios";
import { api } from "../../../lib/axios";
import styles from "./CylinderFlow.module.css";

// snake_case para compatibilidade com Go service
type ResponseDto = {
    id: string;
    name: string;
    diameter: number;
    velocity: number;
    fluid_temperature: number;
    surface_temperature: number;
    film_temperature: number;
    kinematic_viscosity: number;
    prandtl: number;
    thermal_conductivity: number;
    reynolds: number;
    nusselt: number;
    heat_transfer_coefficient: number;
    heat_flux: number;
};

export function CylinderFlow() {
    const [name, setName] = useState("Cylinder");
    const [diameter, setDiameter] = useState(0.05);
    const [velocity, setVelocity] = useState(10);
    const [fluidTemp, setFluidTemp] = useState(300);
    const [surfaceTemp, setSurfaceTemp] = useState(350);

    const [res, setRes] = useState<ResponseDto | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function run() {
        try {
            setErrorMsg(null);
            const { data } = await api.post<ResponseDto>("/api/external-flow/cylinder/calculate", {
                name: name,
                diameter: diameter,
                velocity: velocity,
                fluid_temperature: fluidTemp,
                surface_temperature: surfaceTemp
            });
            setRes(data);
        } catch (err) {
            const axiosError = err as AxiosError<{message: string}>;
            setErrorMsg(axiosError.response?.data?.message || "Temperature out of range or calculation failed.");
            setRes(null);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.container}>
                <h1 className={styles.title}>Cylinder Flow Solver</h1>
                <p className={styles.description}>
                    Calculate heat transfer coefficients for cross-flow over a circular cylinder.
                </p>
            </div>

            <div className={styles.inputsContainer}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Identifier</label>
                    <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Diameter - D (m)</label>
                    <input type="number" className={styles.input} value={diameter} onChange={(e) => setDiameter(+e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Velocity - V (m/s)</label>
                    <input type="number" className={styles.input} value={velocity} onChange={(e) => setVelocity(+e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Fluid Temperature - T∞ (K)</label>
                    <input type="number" className={styles.input} value={fluidTemp} onChange={(e) => setFluidTemp(+e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Surface Temperature - Ts (K)</label>
                    <input type="number" className={styles.input} value={surfaceTemp} onChange={(e) => setSurfaceTemp(+e.target.value)} />
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.primaryButton} onClick={run}>Calculate</button>
                {res && <button className={styles.secondaryButton} onClick={() => setRes(null)}>Clear</button>}
            </div>

            {errorMsg && (
                <div style={{color: 'red', marginTop: '10px', fontSize: '14px', textAlign: 'center'}}>
                    {errorMsg}
                </div>
            )}

            {res && (
                <div className={styles.resultsContainer}>
                    <div className={styles.resultCard}>
                        <span className={styles.resultLabel}>Heat Transfer Coeff. (h)</span>
                        <div className={styles.resultValue}>
                            <span className={styles.highlight}>{res.heat_transfer_coefficient.toFixed(2)}</span>
                            <span className={styles.resultUnit}>W/(m²·K)</span>
                        </div>
                    </div>

                    <div className={styles.resultCard}>
                        <span className={styles.resultLabel}>Heat Flux (q")</span>
                        <div className={styles.resultValue}>
                            {res.heat_flux.toFixed(2)}
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
