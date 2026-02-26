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

    const activeModule = searchParams.get("module") || "all";
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = useMemo(() => {
        return RESOURCES.filter(item => {

            if (type !== "all" && item.type !== type) return false;

            if (activeModule !== "all" && item.module !== activeModule) return false;

            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

            return true;
        });
    }, [type, activeModule, searchQuery]);

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
            <div className={styles.decorativeLogo}>HeatSphere</div>

            <div className={styles.contentContainer}>

                <header className={styles.hubHeader}>
                    <h1>{HUB_TITLES[type]}</h1>
                    <p>Browse, filter, and search {type === "all" ? "everything we have." : `all available ${TYPE_LABEL_PLURAL[type]}.`}</p>
                </header>

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

                    <main className={styles.grid}>
                        {filteredItems.length === 0 ? (
                            <div className={styles.emptyState}>No results found for your filters.</div>
                        ) : (
                            filteredItems.map(item => {

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
