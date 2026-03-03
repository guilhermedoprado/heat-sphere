import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

type SolverWrapperProps = {
    title: string;
    equationLatex?: string; // Equação principal para mostrar em cima
    children: React.ReactNode; // Os inputs
    result: React.ReactNode; // A caixa de resultado
};

export function SolverWrapper({ title, equationLatex, children, result }: SolverWrapperProps) {
    return (
        <div style={{
            background: "#FDF9F4",
            border: "1px solid #c15a01",
            borderRadius: "8px",
            padding: "1rem",
            margin: "1rem 0",
            fontFamily: "'Inter', sans-serif"
        }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#c15a01", fontSize: "1.2rem", fontWeight: 800 }}>
                {title}
            </h3>

            {/* Renderiza a equação principal bonita acima dos inputs se houver */}
            {equationLatex && (
                <div style={{ marginBottom: "1.5rem", background: "#fff", padding: "0.5rem", borderRadius: "6px" }}>
                    <BlockMath math={equationLatex} />
                </div>
            )}

            {/* Grid de Inputs */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {children}
            </div>

            {/* Caixa de Resultado Padrão */}
            <div style={{
                background: "white",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "2px dashed #c15a01",
                fontWeight: "bold",
                fontSize: "1.2rem",
                color: "#c15a01",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
            }}>
                {result}
            </div>
        </div>
    );
}

// Subcomponente para padronizar os Labels dos Inputs
export function SolverInput({ label, value, onChange, placeholderNode }: any) {
    return (
        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.85rem", fontWeight: 800, color: "#5c4b37" }}>
            <div style={{ marginBottom: "0.2rem" }}>{placeholderNode || label}</div>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    padding: "0.4rem",
                    borderRadius: "4px",
                    border: "1px solid #e6d8c0",
                    background: "white",
                    color: "#c15a01",
                    fontFamily: "'Inter', sans-serif",
                    width: "120px"
                }}
            />
        </label>
    );
}
