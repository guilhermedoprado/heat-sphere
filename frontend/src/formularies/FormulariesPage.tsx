// src/formularies/FormulariesPage.tsx
import { useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { FormularyRegistry } from "./FormularyRegistry";
import styles from "./FormulariesPage.module.css";

export function FormulariesPage() {
  const [searchParams] = useSearchParams();
  const module = searchParams.get("module") ?? "";
  const entry = FormularyRegistry[module];
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  if (!entry) {
    return (
      <div className={styles.formularyNotFound}>
        <h2>Formulário não encontrado</h2>
        <p>Módulo: <code>{module}</code></p>
      </div>
    );
  }

  return (
    <div className={styles.formularyPage}>
      {/* Barra de ação — some no print */}
      <div className={styles.formularyToolbar}>
        <span className={styles.formularyTitleBar}>{entry.title}</span>
        <button className={styles.btnExportPDF} onClick={handleExportPDF}>
          ⬇ Export as PDF
        </button>
      </div>

      {/* Conteúdo renderizado */}
      <div className={styles.formularyContent} ref={printRef} data-color-mode="light">
        <MDEditor.Markdown
          source={entry.content}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        />
      </div>
    </div>
  );
}
