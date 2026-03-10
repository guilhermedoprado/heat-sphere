// src/components/solvers/SolverPalette.tsx
import { useEffect, useRef } from "react";
import type { PaletteState } from "../../lib/useSolverPalette";
import styles from "./SolverPalette.module.css";

type Props = {
    palette: PaletteState;
    filtered: [string, string][];
    onSelect: (key: string) => void;
    onClose: () => void;
};

export function SolverPalette({ palette, filtered, onSelect, onClose }: Props) {
    const listRef = useRef<HTMLDivElement>(null);

    // Scroll para manter item selecionado visível
    useEffect(() => {
        const el = listRef.current?.querySelector(`[data-index="${palette.selectedIndex}"]`) as HTMLElement;
        el?.scrollIntoView({ block: "nearest" });
    }, [palette.selectedIndex]);

    // Fecha ao clicar fora
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!listRef.current?.contains(e.target as Node)) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    if (!palette.open || filtered.length === 0) return null;

    return (
        <div
            className={styles.palette}
            style={{ top: palette.top, left: palette.left }}
            ref={listRef}
        >
            <div className={styles.header}>⚙ Solvers</div>
            {filtered.map(([key, label], i) => (
                <div
                    key={key}
                    data-index={i}
                    className={`${styles.item} ${i === palette.selectedIndex ? styles.active : ""}`}
                    onMouseDown={(e) => { e.preventDefault(); onSelect(key); }}
                >
                    <span className={styles.key}>\{key}</span>
                    <span className={styles.label}>{label}</span>
                </div>
            ))}
        </div>
    );
}
