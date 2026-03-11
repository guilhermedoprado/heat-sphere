import { Link, useParams } from "react-router-dom";
import { Suspense, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { RESOURCE_BY_SLUG, MODULES, type ResourceType } from "../../data/resources.ts";
import { RESOURCE_COMPONENTS } from "../../data/resourceComponents.ts";
import { FormularyRegistry } from "../../features/formularies/FormularyRegistry.ts";
import styles from "./ResourcePage.module.css";

const TYPE_LABEL: Record<ResourceType, string> = {
    solver:      "Solver",
    calculation: "Calculation",
    formulary:   "Formulary",
};

const TYPE_PLURAL: Record<ResourceType, string> = {
    solver:      "solvers",
    calculation: "calculations",
    formulary:   "formularies",
};

const TYPE_PLURAL_UPPER: Record<ResourceType, string> = {
    solver:      "Solvers",
    calculation: "Calculations",
    formulary:   "Formularies",
};

export default function ResourcePage({ type }: { type: ResourceType }) {
    const { resourceSlug } = useParams<{ resourceSlug: string }>();
    const formularyRef = useRef<HTMLDivElement>(null);

    const item      = RESOURCE_BY_SLUG[`${type}:${resourceSlug}`];
    const Content   = item ? RESOURCE_COMPONENTS[`${type}:${resourceSlug}`] : undefined;
    const formulary = type === "formulary" ? FormularyRegistry[resourceSlug ?? ""] : undefined;

    const moduleLabel = item
        ? (MODULES.find(m => m.slug === item.module)?.label ?? item.module)
        : "";

    const backTo = item
        ? `/${TYPE_PLURAL[type]}?module=${item.module}`
        : `/${TYPE_PLURAL[type]}`;

    // ── Export PDF: nova janela com só o conteúdo MD ──
    const handleExportPDF = () => {
        const node = formularyRef.current;
        if (!node) return;

        // Captura o CSS do KaTeX já carregado na página
        const katexCSS = Array.from(document.styleSheets)
            .filter(s => { try { return !!s.href?.includes("katex"); } catch { return false; } })
            .map(s => { try { return Array.from(s.cssRules).map(r => r.cssText).join("\n"); } catch { return ""; } })
            .join("\n");

        const win = window.open("", "_blank", "width=900,height=700");
        if (!win) {
            alert("Pop-up bloqueado. Permita pop-ups para este site.");
            return;
        }

        win.document.write(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8" />
                <title>${formulary?.title ?? "Formulário"}</title>
                <style>
                    ${katexCSS}

                    *, *::before, *::after { box-sizing: border-box; }

                    body {
                        font-family: 'Inter', 'Segoe UI', sans-serif;
                        font-size: 0.95rem;
                        line-height: 1.75;
                        color: #1e293b;
                        margin: 2rem 2.5rem;
                        background: white;
                    }

                    h1 {
                        font-size: 1.5rem;
                        border-bottom: 3px solid #3b82f6;
                        padding-bottom: 0.4rem;
                        color: #0f172a;
                        margin-bottom: 1.5rem;
                    }
                    h2 {
                        font-size: 1.1rem;
                        color: #1d4ed8;
                        border-left: 4px solid #3b82f6;
                        padding-left: 0.7rem;
                        margin-top: 2rem;
                    }
                    h3 { font-size: 1rem; color: #334155; margin-top: 1.2rem; }

                    .katex-display {
                        background: #f0f7ff;
                        border-left: 4px solid #3b82f6;
                        border-radius: 0 8px 8px 0;
                        padding: 0.7rem 1.25rem;
                        margin: 1rem 0;
                        overflow-x: auto;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 1.2rem 0;
                        font-size: 0.88rem;
                    }
                    thead th {
                        background: #1e40af;
                        color: white;
                        padding: 0.6rem 1rem;
                        text-align: left;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    tbody tr:nth-child(even) { background: #f8fafc; }
                    tbody td { padding: 0.5rem 1rem; border-top: 1px solid #e2e8f0; }

                    blockquote {
                        background: #fefce8;
                        border-left: 4px solid #eab308;
                        border-radius: 0 8px 8px 0;
                        padding: 0.6rem 1rem;
                        margin: 1rem 0;
                        color: #713f12;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    blockquote p { margin: 0; }

                    hr { border: none; border-top: 1.5px solid #e2e8f0; margin: 2rem 0; }

                    p { margin: 0.5rem 0; }

                    @media print {
                        body { margin: 1.5cm 2cm; }
                        .katex-display, table, blockquote { page-break-inside: avoid; }
                        h2, h3 { page-break-after: avoid; }
                    }
                </style>
            </head>
            <body>${node.innerHTML}</body>
            </html>
        `);

        win.document.close();
        win.onload = () => setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
    };

    if (!item && !formulary) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container}>
                    <p className={styles.muted}>Resource not found.</p>
                    <Link to={backTo} className={styles.backLink}>← Back</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                <nav className={styles.breadcrumb} aria-label="breadcrumb">
                    <Link to="/modules"                   className={styles.crumb}>Modules</Link>
                    <span className={styles.sep}>/</span>
                    <Link to={`/modules/${item?.module}`} className={styles.crumb}>{moduleLabel}</Link>
                    <span className={styles.sep}>/</span>
                    <Link to={backTo}                     className={styles.crumb}>{TYPE_PLURAL_UPPER[type]}</Link>
                    <span className={styles.sep}>/</span>
                    <span className={styles.current}>{item?.title ?? formulary?.title}</span>
                </nav>

                <header className={styles.header}>
                    <Link to={backTo} className={styles.backLink}>← Back to {TYPE_PLURAL_UPPER[type]}</Link>

                    <div className={styles.titleRow}>
                        <h1 className={styles.title}>{item?.title ?? formulary?.title}</h1>
                        <div className={styles.badges}>
                            <span className={styles.badge}>{moduleLabel}</span>
                            <span className={styles.badgeAccent}>{TYPE_LABEL[type]}</span>
                            {item?.difficulty && <span className={styles.badgeMuted}>{item.difficulty}</span>}
                            {item?.minutes    && <span className={styles.badgeMuted}>⏱ {item.minutes} min</span>}
                        </div>
                    </div>

                    {item?.summary && <p className={styles.subtitle}>{item.summary}</p>}

                    {item?.tags?.length ? (
                        <div className={styles.tags}>
                            {item.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                        </div>
                    ) : null}
                </header>

                <section className={styles.bodyCard}>
                    {type === "formulary" && formulary ? (
                        <>
                            <div className={styles.formularyToolbar}>
                                <button className={styles.btnExportPdf} onClick={handleExportPDF}>
                                    ⬇ Export as PDF
                                </button>
                            </div>

                            {/* ref aqui — captura só o MD para o PDF */}
                            <div
                                className={styles.formularyContent}
                                data-color-mode="dark"
                                ref={formularyRef}
                            >
                                <MDEditor.Markdown
                                    source={formulary.content}
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false, output: "html" }]]}
                                />
                            </div>
                        </>
                    ) : (
                        <Suspense fallback={<div className={styles.muted}>Loading...</div>}>
                            {Content
                                ? <Content />
                                : <p className={styles.muted}>Content coming soon.</p>
                            }
                        </Suspense>
                    )}
                </section>

            </div>
        </div>
    );
}
