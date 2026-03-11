import React, { useMemo, useRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkWikiLink from "./remarkWikiLink";
import { WikiLink, type WikiNoteInfo } from "./WikiLink";
import { SolverRegistry } from "../solvers/SolverRegistry";
import remarkSolvers from "../../lib/remarkSolvers";
import { useSolverPalette } from "../../lib/useSolverPalette";
import { SolverPalette } from "../solvers/SolverPalette";

type Props = {
    value: string;
    onChange: (value: string) => void;
    notes?: WikiNoteInfo[];
    onNavigate?: (noteId: string) => void;
    previewMode?: "edit" | "preview";
};

export function MarkdownEditor({ value, onChange, notes = [], onNavigate, previewMode = "edit" }: Props) {
    const valueRef = useRef(value);
    useEffect(() => { valueRef.current = value; }, [value]);

    const onChangeRef = useRef(onChange);
    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

    const { palette, filtered, onTextareaChange, onKeyDown, insertSolver, textareaRef, close } = useSolverPalette(value, onChange);
        // Adiciona ref pro container externo
    const editorContainerRef = useRef<HTMLDivElement>(null);

    // Captura a textarea real do DOM após montar
    useEffect(() => {
        const ta = editorContainerRef.current?.querySelector("textarea");
        if (ta) textareaRef.current = ta as HTMLTextAreaElement;
    });

    const components = useMemo(() => ({

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

        "solver-embed": ({ id }: { id: string }) => {
            const solverKey = id.startsWith("solver:") ? id.slice("solver:".length) : id;
            const SolverComponent = SolverRegistry[solverKey];

            if (!SolverComponent) {
                return (
                    <div style={{ color: "#dc2626", padding: "1rem", border: "1px dashed #fca5a5" }}>
                        <strong>⚠ Solver Not Found:</strong> "{solverKey}"
                    </div>
                );
            }

            return (
                <div
                    className="interactive-solver-wrapper"
                    style={{ margin: "1.5rem 0" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <SolverComponent initialParams={{}} needsScaffolding={false} />
                </div>
            );
        },

        code: (props: any) => {
            const { inline, className, children } = props;
            const match = /language-solver:([\w-]+)/.exec(className || "");

            const extractText = (node: any): string => {
                if (typeof node === "string") return node;
                if (typeof node === "number") return String(node);
                if (Array.isArray(node)) return node.map(extractText).join("");
                if (node?.props?.children) return extractText(node.props.children);
                return "";
            };

            if (!inline && match) {
                const solverName = match[1];
                const rawContent = extractText(children).trim();

                let initialParams = null;
                if (rawContent) {
                    try { initialParams = JSON.parse(rawContent); }
                    catch { console.warn(`Invalid JSON in solver ${solverName}`); }
                }

                const SolverComponent = SolverRegistry[solverName];

                if (SolverComponent) {
                    const handleParamsChange = (newParams: any) => {
                        const newJsonString = JSON.stringify(newParams, null, 2);
                        const newBlock = `\`\`\`solver:${solverName}\n${newJsonString}\n\`\`\``;
                        const regex = new RegExp(`\`\`\`solver:${solverName}[\\s\\S]*?\`\`\``, "g");
                        const current = valueRef.current;
                        if (regex.test(current)) {
                            const newMarkdown = current.replace(regex, newBlock);
                            if (newMarkdown !== current) setTimeout(() => onChangeRef.current(newMarkdown), 0);
                        }
                    };

                    return (
                        <div
                            className="interactive-solver-wrapper"
                            style={{ margin: "1.5rem 0" }}
                            onClick={(e) => e.stopPropagation()}
                        >
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
        },

    }), [notes, onNavigate]);

    return (
        <>
            <SolverPalette
                palette={palette}
                filtered={filtered}
                onSelect={insertSolver}
                onClose={close}
            />
            <div
                ref={editorContainerRef}
                data-color-mode="light"
                style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
            >
                <MDEditor
                    value={value}
                    onChange={(val) => onChange(val || "")}
                    preview={previewMode}
                    hideToolbar={previewMode === "preview"}
                    height="100%"
                    visibleDragbar={false}
                    style={{ backgroundColor: "transparent", boxShadow: "none" }}
                    textareaProps={{
                        placeholder: "Type your notes here...",
                        onChange: onTextareaChange,
                        onKeyDown: onKeyDown,
                        // ref REMOVIDO daqui
                    }}
                    previewOptions={{
                        remarkPlugins: [remarkWikiLink, remarkMath, remarkSolvers],
                        rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]] as any,
                        components,
                    }}
                />
            </div>
        </>
    );
}