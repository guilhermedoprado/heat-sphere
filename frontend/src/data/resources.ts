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
    "solver", "calculation", "formulary",
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
    formulary:    "formularies",
};

export function resourcePath(r: Pick<Resource, "type" | "slug">): string {
    return `/${TYPE_ROUTE[r.type]}/${r.slug}`;
}

// ── Dados ─────────────────────────────────────────────────────────────────────
export const RESOURCES: readonly Resource[] = [

    // Formularies

    {
        type:   "formulary",
        slug:   "introduction-to-convection",
        title:  "Cap 6 - Introduction to Convection",
        module: "introduction-to-convection",
        summary:    "Equações de camada limite, parâmetros adimensionais e analogias.",
        tags:       ["convecção", "camada limite", "Nusselt", "Reynolds"],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "external-flow",
        title:  "Cap 7 - External Flow",
        module: "external-flow",
        summary:    "Correlações para transferência de calor em escoamento externo sobre placas planas, cilindros, esferas e bancos de tubos.",
        tags:       ["Churchill–Bernstein", "Re", "Nu", "h", "q\""],
        difficulty: "core",
    },
    
    {
        type:   "formulary",
        slug:   "internal-flow",
        title:  "Cap 8 - Internal Flow",
        module: "internal-flow",
        summary:    "Correlações para transferência de calor em escoamento interno em tubos, incluindo comprimento de entrada hidráulico e térmico, escoamento completamente desenvolvido e condições de contorno de temperatura constante e fluxo de calor constante.",
        tags:       ["Dittus–Boelter", "Sieder–Tate", "Reynolds number", "Prandtl number"],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "free-convection-formulary",
        title:  "Cap 9 - Free Convection",
        module: "free-convection",
        summary:    "Correlações para transferência de calor em escoamento livre sobre placas verticais, placas horizontais, placas inclinadas e espaços fechados.",
        tags:       ["Grashof number", "Rayleigh number", "Nusselt number", "Reynolds number", "Prandtl number"],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "boiling-formulary",
        title:  "Cap 10 - Boiling",
        module: "boiling",
        summary:    "Correlações para transferência de calor em ebulição em tubos, incluindo curva de ebulição, ebulição nucleada, fluxo de calor crítico e ebulição em filmagem.",
        tags:       ["Churchill–Bernstein", "Re", "Nu", "h", "q\""],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "condensation-formulary",
        title:  "Cap 11 - Condensation",
        module: "condensation",
        summary:    "Correlações para transferência de calor em condensação em tubos, incluindo condensação em filmagem, condensação em gotas e condensação em bancos de tubos.",
        tags:       ["Nusselt", "Reynolds", "Prandtl", "Grashof", "Rayleigh "],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "heat-exchangers-formulary",
        title:  "Cap 12 - Heat Exchangers",
        module: "heat-exchangers",
        summary:    "Correlações para transferência de calor em trocadores de calor, incluindo trocadores de calor de carcaça e tubo, trocadores de calor de placas e trocadores de calor de tubos concêntricos.",
        tags:       ["LMTD", "ε-NTU", "Reynolds number", "Prandtl number"],
        difficulty: "core",
    },

    // Solvers
    {
        type:       "solver",
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
        type:       "solver",
        slug:       "external-flow-cylinder-nu",
        title:      "Nu for Cylinder in Cross-Flow",
        module:     "external-flow",
        tags:       ["Churchill–Bernstein", "Nu", "Re"],
        difficulty: "core",
        featured:   true,
    },
    {
        type:       "solver",
        slug:       "external-flow-flat-plate-nu",
        title:      "Nu_x for Flat Plate (Churchill–Ozoe)",
        module:     "external-flow",
        summary:    "Local Nusselt from Re_x and Pr. Pe_x ≥ 100. Eq. 7.33 Incropera.",
        tags:       ["Churchill–Ozoe", "Nu_x", "Re_x", "Pr", "Pe_x"],
        difficulty: "core",
        minutes:    3,
        featured:   true,
    },

] as const;

// ── Indexes para lookup rápido ────────────────────────────────────────────────
export const RESOURCE_BY_SLUG = Object.fromEntries(
    RESOURCES.map(r => [`${r.type}:${r.slug}`, r])
) as Record<string, Resource>;
