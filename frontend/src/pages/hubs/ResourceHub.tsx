// src/pages/hubs/ResourceHub.tsx
import { useState, useMemo } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { RESOURCES, MODULES, type ResourceType } from "../../data/resources";
import styles from "./ResourceHub.module.css";

const HUB_TITLES: Record<string, string> = {
    "all": "All Resources",
    "formulary": "Formularies & Equations",
    "solver": "Solvers & Tools",
    "calculation": "Step-by-step Calculations",
    "case-study": "Engineering Case Studies",
};

// Modifiquei para aceitar "all" (como string vazia para não quebrar) ou use direto no JSX
const TYPE_LABEL_PLURAL: Record<string, string> = {
    "all": "resources",
    "formulary": "formularies",
    "solver": "solvers",
    "calculation": "calculations",
    "case-study": "case studies",
};

const TABS = [
    { label: "All", path: "/all" },
    { label: "Formularies", path: "/formularies" },
    { label: "Solvers", path: "/solvers" },
    { label: "Calculations", path: "/calculations" },
    { label: "Case Studies", path: "/case-studies" },
];

export default function ResourceHub({ type }: { type: ResourceType | "all" }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    // Filtros atuais (lidos da URL)
    const activeModule = searchParams.get("module") || "all";
    const [searchQuery, setSearchQuery] = useState("");

    // Lógica de filtragem
    const filteredItems = useMemo(() => {
        return RESOURCES.filter(item => {
            // 1. Filtra pelo tipo (se não for "all")
            if (type !== "all" && item.type !== type) return false;

            // 2. Filtra por Módulo (se selecionado)
            if (activeModule !== "all" && item.module !== activeModule) return false;

            // 3. Filtra pela busca de texto
            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

            return true;
        });
    }, [type, activeModule, searchQuery]);

    // Atualiza a URL quando clica num filtro de módulo
    const handleModuleFilter = (modSlug: string) => {
        if (modSlug === "all") {
            searchParams.delete("module");
        } else {
            searchParams.set("module", modSlug);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Elemento Decorativo Visual "HeatSphere" no fundo */}
            <div className={styles.decorativeLogo}>HeatSphere</div>

            <div className={styles.contentContainer}>

                <header className={styles.hubHeader}>
                    <h1>{HUB_TITLES[type]}</h1>
                    <p>Browse, filter, and search {type === "all" ? "everything we have." : `all available ${TYPE_LABEL_PLURAL[type]}.`}</p>
                </header>

                {/* 🔥 Type Tabs 🔥 */}
                <div className={styles.typeTabs}>
                    {TABS.map(tab => {
                        const targetUrl = activeModule === "all"
                            ? tab.path
                            : `${tab.path}?module=${activeModule}`;
                        const isActive = location.pathname.includes(tab.path);

                        return (
                            <Link key={tab.path} to={targetUrl} className={isActive ? styles.activeTab : styles.tab}>
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>

                <div className={styles.layout}>
                    {/* ── Sidebar de Filtros ── */}
                    <aside className={styles.sidebar}>
                        <div className={styles.searchBox}>
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <h3>Filter by Module</h3>
                            <button
                                className={activeModule === "all" ? styles.activeFilter : styles.filterBtn}
                                onClick={() => handleModuleFilter("all")}
                            >
                                All Modules
                            </button>
                            {MODULES.map(mod => (
                                <button
                                    key={mod.slug}
                                    className={activeModule === mod.slug ? styles.activeFilter : styles.filterBtn}
                                    onClick={() => handleModuleFilter(mod.slug)}
                                >
                                    {mod.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* ── Grid de Resultados ── */}
                    <main className={styles.grid}>
                        {filteredItems.length === 0 ? (
                            <div className={styles.emptyState}>No results found for your filters.</div>
                        ) : (
                            filteredItems.map(item => {
                                // CORREÇÃO: Descobre a URL base correta mesmo se a aba atual for "All"
                                const typePlural = item.type === "case-study" ? "case-studies" :
                                    item.type === "formulary" ? "formularies" :
                                        `${item.type}s`;

                                return (
                                    <Link key={item.slug} to={`/${typePlural}/${item.slug}`} className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.cardModule}>
                                                {MODULES.find(m => m.slug === item.module)?.label}
                                            </span>

                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                {/* Se estiver na aba ALL, mostra qual é o tipo do card */}
                                                {type === "all" && (
                                                    <span className={styles.badgeType}>{item.type.replace("-", " ")}</span>
                                                )}
                                                {item.difficulty && (
                                                    <span className={styles.badge}>{item.difficulty}</span>
                                                )}
                                            </div>
                                        </div>
                                        <h3 className={styles.cardTitle}>{item.title}</h3>
                                        {item.minutes && (
                                            <div className={styles.cardTime}>
                                                <span>⏱</span> {item.minutes} min read
                                            </div>
                                        )}
                                    </Link>
                                );
                            })
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
