import { useState } from "react";
import { AxiosError } from "axios"; // Usando axios puro, você pode configurar baseUrl se quiser
import { api } from "../../../lib/axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from "recharts";
import styles from "./ShellTubeRating.module.css";

// snake_case para compatibilidade com Go service
type ResponseDto = {
  dt1: number;
  dt2: number;
  lmtd: number;
  p: number;
  r: number;
  f: number;
  lmtd_corr: number;
};

export function ShellTubeRating() {

  const [thInC, setThInC] = useState(150);
  const [thOutC, setThOutC] = useState(85);
  const [tcInC, setTcInC] = useState(30);
  const [tcOutC, setTcOutC] = useState(60);

  const [res, setRes] = useState<ResponseDto | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function run() {
    try {
      setErrorMsg(null); // Limpa erro anterior
      // Aponta para a porta 8000 do microsserviço Python e usa snake_case no body
      const { data } = await api.post<ResponseDto>("/api/heat-exchangers/shell-tube/rate", {
        th_in_c: thInC,
        th_out_c: thOutC,
        tc_in_c: tcInC,
        tc_out_c: tcOutC
      });
      setRes(data);
    } catch (err) {
      const axiosError = err as AxiosError<{message: string}>;
      setErrorMsg(axiosError.response?.data?.message || "Failed to calculate. Please check your inputs.");
      setRes(null);
    }
  }

  const chartData = [
    { pos: 0, hot: thInC, cold: tcOutC },
    { pos: 1, hot: thOutC, cold: tcInC },
  ];

  return (
      <div className={styles.container}>

        <section className={styles.intro}>
          <h2>Case Study: Oil Cooler Performance</h2>
          <p>
            Evaluate the performance of a 1-2 shell-and-tube heat exchanger used to cool
            turbine oil (Hot Fluid) using cooling water (Cold Fluid).
          </p>
        </section>

        <div className={styles.workspace}>
          <div className={styles.controlPanel}>
            <h3>Operating Conditions</h3>
            <div className={styles.inputs}>
              <div className={styles.fluidBlock}>
                <span className={styles.fluidLabel} style={{color: '#ef4444'}}>Hot Fluid (Shell)</span>
                <label>Inlet Temp (°C)
                  <input type="number" value={thInC} onChange={e => setThInC(Number(e.target.value))} />
                </label>
                <label>Outlet Temp (°C)
                  <input type="number" value={thOutC} onChange={e => setThOutC(Number(e.target.value))} />
                </label>
              </div>

              <div className={styles.fluidBlock}>
                <span className={styles.fluidLabel} style={{color: '#3b82f6'}}>Cold Fluid (Tube)</span>
                <label>Inlet Temp (°C)
                  <input type="number" value={tcInC} onChange={e => setTcInC(Number(e.target.value))} />
                </label>
                <label>Outlet Temp (°C)
                  <input type="number" value={tcOutC} onChange={e => setTcOutC(Number(e.target.value))} />
                </label>
              </div>
            </div>

            <button className={styles.runBtn} onClick={run}>Run Analysis</button>

            {errorMsg && (
                <div style={{color: 'red', marginTop: '10px', fontSize: '14px', fontWeight: 'bold'}}>
                  Error: {errorMsg}
                </div>
            )}
          </div>

          <div className={styles.analysisPanel}>
            {res ? (
                <>
                  <div className={styles.kpis}>
                    <div className={styles.kpiCard}>
                      <span className={styles.kpiLabel}>LMTD Corrected</span><br></br>
                      <span className={styles.kpiValue}>{res.lmtd_corr.toFixed(1)} °C</span>
                    </div>
                    <div className={`${styles.kpiCard} ${res.f < 0.8 ? styles.warning : styles.success}`}>
                      <span className={styles.kpiLabel}>Correction Factor (F)</span><br></br>
                      <span className={styles.kpiValue}>{res.f.toFixed(3)}</span><br></br>
                      <span className={styles.kpiStatus}>
                    {res.f < 0.8 ? '⚠️ Low Efficiency' : '✅ Acceptable'}
                  </span>
                    </div>
                  </div>

                  <div className={styles.chartWrapper}>
                    <h4>Temperature Profile</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis type="number" dataKey="pos" hide domain={[0, 1]} />
                        <YAxis unit="°C" stroke="#9ca3af" fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="hot" name="Hot Fluid" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} />
                        <Line type="monotone" dataKey="cold" name="Cold Fluid" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className={styles.details}>
                    <small>Parameters: P = {res.p.toFixed(3)} | R = {res.r.toFixed(3)}</small>
                  </div>
                </>
            ) : (
                <div className={styles.placeholder}>
                  Click "Run Analysis" to see thermal profiles and rating results.
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
