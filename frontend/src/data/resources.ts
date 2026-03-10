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
        title:  "Module 1 - Formulary",
        module: "introduction-to-convection",
        summary:    "Boundary layer equations, dimensionless parameters, and heat transfer analogies.",
        tags:       ["convection", "boundary layer", "Nusselt", "Reynolds"],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "external-flow",
        title:  "Module 2 - Formulary",
        module: "external-flow",
        summary:    "Heat transfer correlations for external flow over flat plates, cylinders, spheres, and tube banks.",
        tags:       ["Churchill–Bernstein", "Re", "Nu", "h", "q\""],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "internal-flow",
        title:  "Module 3 - Formulary",
        module: "internal-flow",
        summary:    "Heat transfer correlations for internal pipe flow, including hydrodynamic and thermal entry lengths, fully developed conditions, and constant wall temperature and constant heat flux boundary conditions.",
        tags:       ["Dittus–Boelter", "Sieder–Tate", "Reynolds number", "Prandtl number"],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "free-convection-formulary",
        title:  "Module 4 - Formulary",
        module: "free-convection",
        summary:    "Heat transfer correlations for free convection over vertical plates, horizontal plates, inclined surfaces, and enclosed spaces.",
        tags:       ["Grashof number", "Rayleigh number", "Nusselt number", "Reynolds number", "Prandtl number"],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "boiling-formulary",
        title:  "Module 5 - Formulary",
        module: "boiling",
        summary:    "Heat transfer correlations for boiling, including the boiling curve, nucleate boiling, critical heat flux, and film boiling regimes.",
        tags:       ["Churchill–Bernstein", "Re", "Nu", "h", "q\""],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "condensation-formulary",
        title:  "Module 6 - Formulary",
        module: "condensation",
        summary:    "Heat transfer correlations for condensation, including film condensation, dropwise condensation, and condensation on tube banks.",
        tags:       ["Nusselt", "Reynolds", "Prandtl", "Grashof", "Rayleigh"],
        difficulty: "core",
    },
    {
        type:   "formulary",
        slug:   "heat-exchangers-formulary",
        title:  "Module 7 - Formulary",
        module: "heat-exchangers",
        summary:    "Heat transfer correlations for heat exchangers, including shell-and-tube, plate, and concentric tube configurations.",
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
        featured:   true,
    },
    {
        type:       "solver",
        slug:       "flat-plate-churchill-ozoe-1",
        title:      "Nu_x for Flat Plate (Churchill–Ozoe)",
        module:     "external-flow",
        summary:    "Local Nusselt from Re_x and Pr. Pe_x ≥ 100. Eq. 7.33 Incropera.",
        tags:       ["Churchill–Ozoe", "Nu_x", "Re_x", "Pr", "Pe_x"],
        difficulty: "core",
        featured:   true,
    },
    {
        type:       "solver",
        slug:       "shell-tube-rating-1",
        title:      "Shell and Tube Rating",
        module:     "heat-exchangers",
        summary:    "Rating of a shell and tube heat exchanger.",
        tags:       ["LMTD", "ε-NTU", "Reynolds number", "Prandtl number"],
        difficulty: "core",
        featured:   true,
    },

] as const;

// ── Indexes para lookup rápido ────────────────────────────────────────────────
export const RESOURCE_BY_SLUG = Object.fromEntries(
    RESOURCES.map(r => [`${r.type}:${r.slug}`, r])
) as Record<string, Resource>;
