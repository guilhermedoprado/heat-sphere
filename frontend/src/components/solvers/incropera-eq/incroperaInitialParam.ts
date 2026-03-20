/** Lê parâmetro persistido do bloco solver (JSON) para useState. */
export function ip(p: Record<string, unknown>, key: string, def: number): string | number {
    const v = p[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") return v;
    return def;
}
