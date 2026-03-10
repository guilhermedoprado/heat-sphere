import { useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { FormularyRegistry } from "./FormularyRegistry";
import styles from "./FormulariesPage.module.css";

const tableComponents = {
    table: ({ children }: any) => (
        <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
            <table style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                fontSize: "0.88rem",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(193,90,1,0.15), 0 0 0 1px #e0ccb4",
            }}>
                {children}
            </table>
        </div>
    ),
    thead: ({ children }: any) => (
        <thead style={{ background: "linear-gradient(90deg, #7c3a10 0%, #c15a01 100%)" }}>
            {children}
        </thead>
    ),
    th: ({ children }: any) => (
        <th style={{
            background: "transparent",
            color: "#fff",
            padding: "0.7rem 1.1rem",
            textAlign: "left",
            fontWeight: 700,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            borderBottom: "2px solid #9a4800",
            whiteSpace: "nowrap",
        }}>
            {children}
        </th>
    ),
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children, ...props }: any) => (
        <tr
            {...props}
            style={{ transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fde8ce")}
            onMouseLeave={e => (e.currentTarget.style.background = "")}
        >
            {children}
        </tr>
    ),
    td: ({ children }: any) => (
        <td style={{
            padding: "0.6rem 1.1rem",
            borderTop: "1px solid #e8d8c4",
            color: "#2c1a0a",
            verticalAlign: "top",
            lineHeight: 1.6,
        }}>
            {children}
        </td>
    ),
};

export function FormulariesPage() {
    const [searchParams] = useSearchParams();
    const module = searchParams.get("module") ?? "";
    const entry = FormularyRegistry[module];
    const printRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = useCallback(() => { window.print(); }, []);

    if (!entry) {
        return (
            <div className={styles.formularyNotFound}>
                <h2>Formulary not found</h2>
                <p>Module: <code>{module}</code></p>
            </div>
        );
    }

    return (
        <div className={styles.formularyPage}>
            <div className={styles.formularyToolbar}>
                <span className={styles.formularyTitleBar}>{entry.title}</span>
                <button className={styles.btnExportPDF} onClick={handleExportPDF}>
                    ⬇ Export as PDF
                </button>
            </div>

            <div className={styles.formularyContent} ref={printRef} data-color-mode="light">
                <MDEditor.Markdown
                    source={entry.content}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={tableComponents}
                />
            </div>
        </div>
    );
}
