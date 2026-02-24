// src/data/resources.ts


// ── Módulos ───────────────────────────────────────────────────────────────────
export const MODULES = [
    { slug: "introduction-to-convection", label: "Intro to Convection", order: 1 },
    { slug: "external-flow",              label: "External Flow",        order: 2 },
    { slug: "internal-flow",              label: "Internal Flow",        order: 3 },
    { slug: "free-convection",            label: "Free Convection",      order: 4 },
    { slug: "boiling",                    label: "Boiling",              order: 5 },
    { slug: "condensation",               label: "Condensation",         order: 6 },
    { slug: "heat-exchangers",            label: "Heat Exchangers",      order: 7 },
] as const;

export type ModuleSlug = (typeof MODULES)[number]["slug"];

// ── Tipos de recurso ──────────────────────────────────────────────────────────
export const RESOURCE_TYPES = [
    "solver", "calculation", "case-study", "formulary",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

// ── Tipo unificado (ResourceItem foi removido — era duplicata) ────────────────
export type Resource = {
    type:       ResourceType;
    slug:       string;
    title:      string;
    module:     ModuleSlug;
    summary?:   string;
    tags?:      readonly string[];
    difficulty?: "intro" | "core" | "advanced";
    minutes?:   number;
    featured?:  boolean;
    // ⬇ NÃO fica aqui — componentes vão num map separado (incompatível com as const)
};

// ── Helper: caminho canônico derivado (não precisamos guardar "path") ─────────
const TYPE_ROUTE: Record<ResourceType, string> = {
    solver:       "solvers",
    calculation:  "calculations",
    "case-study": "case-studies",
    formulary:    "formularies",
};

export function resourcePath(r: Pick<Resource, "type" | "slug">): string {
    return `/${TYPE_ROUTE[r.type]}/${r.slug}`;
}

// ── Dados ─────────────────────────────────────────────────────────────────────
export const RESOURCES: readonly Resource[] = [

    // External Flow
    {
        type:       "calculation",
        slug:       "cylinder-cross-flow-1",
        title:      "Cylinder Cross-Flow (Churchill–Bernstein)",
        module:     "external-flow",
        summary:    "Full worked calculation for convective heat transfer over a circular cylinder using the Churchill–Bernstein correlation.",
        tags:       ["Churchill–Bernstein", "Re", "Nu", "h", "q\""],
        difficulty: "core",
        minutes:    10,
        featured:   true,
    },
    {
        type:   "formulary",
        slug:   "external-flow-formulary",
        title:  "External Flow Formulary",
        module: "external-flow",
    },
    {
        type:       "solver",
        slug:       "external-flow-cylinder-nu",
        title:      "Nu for Cylinder in Cross-Flow",
        module:     "external-flow",
        tags:       ["Churchill–Bernstein", "Nu", "Re"],
        difficulty: "core",
        featured:   true,
    },

] as const;

// ── Indexes para lookup rápido ────────────────────────────────────────────────
export const RESOURCE_BY_SLUG = Object.fromEntries(
    RESOURCES.map(r => [`${r.type}:${r.slug}`, r])
) as Record<string, Resource>;
