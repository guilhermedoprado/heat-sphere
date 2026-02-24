// src/pages/resources/ResourcePage.tsx
import { Link, useParams } from "react-router-dom";
import { Suspense } from "react";
import { RESOURCE_BY_SLUG, MODULES, type ResourceType } from "../../data/resources.ts";
import { RESOURCE_COMPONENTS } from "../../data/resourceComponents.ts";
import styles from "./ResourcePage.module.css";

const TYPE_LABEL: Record<ResourceType, string> = {
    solver:       "Solver",
    calculation:  "Calculation",
    "case-study": "Case Study",
    formulary:    "Formulary",
};

const TYPE_PLURAL: Record<ResourceType, string> = {
    solver:       "solvers",
    calculation:  "calculations",
    "case-study": "case-studies",
    formulary:    "formularies",
};

const TYPE_PLURAL_UPPER: Record<ResourceType, string> = {
    solver:       "Solvers",
    calculation:  "Calculations",
    "case-study": "Case Studies",
    formulary:    "Formularies",
};

export default function ResourcePage({ type }: { type: ResourceType }) {
    const { resourceSlug } = useParams<{ resourceSlug: string }>();

    const item    = RESOURCE_BY_SLUG[`${type}:${resourceSlug}`];
    const Content = item ? RESOURCE_COMPONENTS[`${type}:${resourceSlug}`] : undefined;

    const moduleLabel = item
        ? (MODULES.find(m => m.slug === item.module)?.label ?? item.module)
        : "";

    // Hub filtrado — volta mantendo contexto do módulo
    const backTo = item
        ? `/${TYPE_PLURAL[type]}?module=${item.module}`
        : `/${TYPE_PLURAL[type]}`;

    if (!item) {
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

                {/* Breadcrumb */}
                <nav className={styles.breadcrumb} aria-label="breadcrumb">
                    <Link to="/modules"              className={styles.crumb}>Modules</Link>
                    <span className={styles.sep}>/</span>
                    <Link to={`/modules/${item.module}`} className={styles.crumb}>{moduleLabel}</Link>
                    <span className={styles.sep}>/</span>
                    <Link to={backTo}                className={styles.crumb}>{TYPE_PLURAL_UPPER[type]}</Link>
                    <span className={styles.sep}>/</span>
                    <span className={styles.current}>{item.title}</span>
                </nav>

                {/* Header */}
                <header className={styles.header}>
                    <Link to={backTo} className={styles.backLink}>← Back to {TYPE_PLURAL_UPPER[type]}</Link>

                    <div className={styles.titleRow}>
                        <h1 className={styles.title}>{item.title}</h1>
                        <div className={styles.badges}>
                            <span className={styles.badge}>{moduleLabel}</span>
                            <span className={styles.badgeAccent}>{TYPE_LABEL[type]}</span>
                            {item.difficulty && <span className={styles.badgeMuted}>{item.difficulty}</span>}
                            {item.minutes   && <span className={styles.badgeMuted}>⏱ {item.minutes} min</span>}
                        </div>
                    </div>

                    {item.summary && <p className={styles.subtitle}>{item.summary}</p>}

                    {item.tags?.length ? (
                        <div className={styles.tags}>
                            {item.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                        </div>
                    ) : null}
                </header>

                {/* Conteúdo */}
                <section className={styles.bodyCard}>
                    <Suspense fallback={<div className={styles.muted}>Loading...</div>}>
                    {Content
                        ? <Content />
                        : <p className={styles.muted}>Content coming soon.</p>
                    }
                    </Suspense>
                </section>
            </div>
        </div>
    );
}
