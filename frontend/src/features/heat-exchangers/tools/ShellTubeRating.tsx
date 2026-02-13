import { useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, ReferenceLine
} from "recharts";
import styles from "./ShellTubeRating.module.css";

type ResponseDto = {
  deltaT1: number;
  deltaT2: number;
  lmtdCounterflow: number;
  p: number;
  r: number;
  f: number;
  lmtdCorrected: number;
};

export function ShellTubeRating() {
  // Valores default para um cenário realista (ex: Resfriamento de óleo)
  const [thInC, setThInC] = useState(150);
  const [thOutC, setThOutC] = useState(85);
  const [tcInC, setTcInC] = useState(30);
  const [tcOutC, setTcOutC] = useState(60);
  const [res, setRes] = useState<ResponseDto | null>(null);

  async function run() {
    try {
      const { data } = await axios.post<ResponseDto>("/api/heat-exchangers/shell-tube/1-2/rating", {
        thInC, thOutC, tcInC, tcOutC
      });
      setRes(data);
    } catch (err) {
      console.error(err);
    }
  }

  const chartData = [
    { pos: 0, hot: thInC, cold: tcOutC }, // Counter-current visual
    { pos: 1, hot: thOutC, cold: tcInC },
  ];

  return (
    <div className={styles.container}>
      {/* 1. Contexto do Problema */}
      <section className={styles.intro}>
        <h2>Case Study: Oil Cooler Performance</h2>
        <p>
          Evaluate the performance of a 1-2 shell-and-tube heat exchanger used to cool
          turbine oil (Hot Fluid) using cooling water (Cold Fluid). 
          The goal is to determine the correction factor <strong>F</strong> and the corrected LMTD.
        </p>
        <div className={styles.problemData}>
          <strong>Design Constraint:</strong> Correction Factor F must be &gt; 0.80 for efficient operation.
        </div>
      </section>

      <div className={styles.workspace}>
        {/* 2. Painel de Controle (Inputs) */}
        <div className={styles.controlPanel}>
          <h3>Operating Conditions</h3>
          <div className={styles.inputs}>
            <div className={styles.fluidBlock}>
              <span className={styles.fluidLabel} style={{color: '#ef4444'}}>Hot Fluid (Shell)</span>
              <label>
                Inlet Temp (°C)
                <input type="number" value={thInC} onChange={e => setThInC(Number(e.target.value))} />
              </label>
              <label>
                Outlet Temp (°C)
                <input type="number" value={thOutC} onChange={e => setThOutC(Number(e.target.value))} />
              </label>
            </div>

            <div className={styles.fluidBlock}>
              <span className={styles.fluidLabel} style={{color: '#3b82f6'}}>Cold Fluid (Tube)</span>
              <label>
                Inlet Temp (°C)
                <input type="number" value={tcInC} onChange={e => setTcInC(Number(e.target.value))} />
              </label>
              <label>
                Outlet Temp (°C)
                <input type="number" value={tcOutC} onChange={e => setTcOutC(Number(e.target.value))} />
              </label>
            </div>
          </div>
          
          <button className={styles.runBtn} onClick={run}>
            Run Analysis
          </button>
        </div>

        {/* 3. Visualização e Resultados */}
        <div className={styles.analysisPanel}>
          {res ? (
            <>
              <div className={styles.kpis}>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>LMTD Corrected</span><br></br>
                  <span className={styles.kpiValue}>{res.lmtdCorrected.toFixed(1)} °C</span>
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
                <h4>Temperature Profile (Counter-Current Equivalent)</h4>
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
