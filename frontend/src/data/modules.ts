export const modules = [
    { slug: "introduction-to-convection", label: "Intro to Convection", module: 1 },
    { slug: "external-flow", label: "External Flow", module: 2 },
    { slug: "internal-flow", label: "Internal Flow", module: 3 },
    { slug: "free-convection", label: "Free Convection", module: 4 },
    { slug: "boiling", label: "Boiling", module: 5 },
    { slug: "condensation", label: "Condensation", module: 6 },
    { slug: "heat-exchangers", label: "Heat Exchangers", module: 7 },
] as const;

export type ModuleSlug = (typeof modules)[number]["slug"];
