import React, { useMemo } from "react";
import MDEditor from "@uiw/react-md-editor";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import remarkWikiLink from "./remarkWikiLink";
import { WikiLink, type WikiNoteInfo } from "./WikiLink";
import { SolverRegistry } from "../solvers/SolverRegistry"; // <-- IMPORTANDO O REGISTRY

type Props = {
  value: string;
  onChange: (value: string) => void;
  notes?: WikiNoteInfo[];
  onNavigate?: (noteId: string) => void;
  previewMode?: "edit" | "preview";
};

export function MarkdownEditor({ value, onChange, notes = [], onNavigate , previewMode = "edit" }: Props) {
  const components = useMemo(() => ({

    // 1. Interceptador de WikiLinks
    span: (props: React.HTMLAttributes<HTMLSpanElement> & { "data-wiki-target"?: string; children?: React.ReactNode }) => {
      const target = props["data-wiki-target"];
      if (props.className === "wiki-link" && target) {
        return (
            <WikiLink target={target} notes={notes} onNavigate={onNavigate ?? (() => {})}>
              {props.children}
            </WikiLink>
        );
      }
      return <span {...props} />;
    },

      // 2. INTERCEPTADOR DE SOLVERS (Com Regex Dinâmica)
      code: (props: any) => {
          const { inline, className, children } = props;
          const match = /language-solver:([\w-]+)/.exec(className || "");

          const extractText = (node: any): string => {
              if (typeof node === "string") return node;
              if (typeof node === "number") return String(node);
              if (Array.isArray(node)) return node.map(extractText).join("");
              if (node && node.props && node.props.children) {
                  return extractText(node.props.children);
              }
              return "";
          };

          if (!inline && match) {
              const solverName = match[1];
              const rawContent = extractText(children).trim();

              let initialParams = null;

              if (rawContent) {
                  try {
                      initialParams = JSON.parse(rawContent);
                  } catch (e) {
                      console.warn(`Invalid JSON in solver ${solverName}`);
                  }
              }

              const SolverComponent = SolverRegistry[solverName];

              if (SolverComponent) {
                  const handleParamsChange = (newParams: any) => {
                      const newJsonString = JSON.stringify(newParams, null, 2);
                      const newBlock = `\`\`\`solver:${solverName}\n${newJsonString}\n\`\`\``;

                      // A MÁGICA: REGEX!
                      // Procura ```solver:nome, pega qualquer coisa que tiver no meio ([\s\S]*?) até fechar com ```
                      // O \b garante que é o nome exato.
                      const regex = new RegExp(`\`\`\`solver:${solverName}[\\s\\S]*?\`\`\``, 'g');

                      // Se a regex encontrar o bloco no texto gigante:
                      if (regex.test(value)) {
                          // Substitui o bloco inteiro (com ou sem conteúdo) pelo nosso JSON formatado
                          const newMarkdown = value.replace(regex, newBlock);
                          if (newMarkdown !== value) {
                              setTimeout(() => onChange(newMarkdown), 0);
                          }
                      }
                  };

                  return (
                      <div className="interactive-solver-wrapper" style={{ margin: "1.5rem 0" }} onClick={(e) => e.stopPropagation()}>
                          <SolverComponent
                              initialParams={initialParams || {}}
                              onParamsChange={handleParamsChange}
                              needsScaffolding={initialParams === null}
                          />
                      </div>
                  );
              }

              return (
                  <div style={{ color: "#dc2626", padding: "1rem", border: "1px dashed #fca5a5" }}>
                      <strong>⚠ Solver Not Found:</strong> "{solverName}"
                  </div>
              );
          }

          return <code className={className} {...props}>{children}</code>;
      }


  }), [notes, onNavigate, value]); // <--- CRÍTICO: 'value' adicionado aqui para evitar stale closure!


    return (
        <div
            data-color-mode="light"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, backgroundColor: 'transparent' }}
        >
            <MDEditor
                value={value}
                onChange={(val) => onChange(val || "")}
                preview={previewMode}
                hideToolbar={previewMode === "preview"}
                height="100%"
                visibleDragbar={false}
                /* ESTAS PROPS EXTRAS MATAM O PRETO: */
                style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                textareaProps={{
                    placeholder: "Type your notes here...",
                }}
                /* ---------------------------------- */
                previewOptions={{
                    remarkPlugins: [remarkWikiLink, remarkMath],
                    rehypePlugins: [rehypeKatex],
                    components, // <--- Nossos interceptadores são passados aqui
                }}
            />
        </div>
    );

}
