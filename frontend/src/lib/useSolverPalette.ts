import { useState, useRef, useCallback } from "react";
import type { KeyboardEvent } from "react";
import { SolverLabels } from "../components/solvers/SolverLabels";

export interface PaletteState {
    open: boolean;
    query: string;
    top: number;
    left: number;
    selectedIndex: number;
}

const INITIAL: PaletteState = { open: false, query: "", top: 0, left: 0, selectedIndex: 0 };

export function useSolverPalette(value: string, onChange: (v: string) => void) {
    const [palette, setPalette] = useState<PaletteState>(INITIAL);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const triggerPosRef = useRef<number>(-1);
    const cursorPosRef = useRef<number>(-1); // <-- NOVO: salva cursor na digitação

    const filtered = Object.entries(SolverLabels).filter(([key, label]) => {
        const q = palette.query.toLowerCase();
        return key.includes(q) || label.toLowerCase().includes(q);
    });

    function getCaretPosition(textarea: HTMLTextAreaElement, pos: number) {
        const div = document.createElement("div");
        const style = getComputedStyle(textarea);
        ["fontFamily","fontSize","fontWeight","lineHeight","padding",
         "border","boxSizing","whiteSpace","wordWrap","width"].forEach(
            (p) => ((div.style as any)[p] = (style as any)[p])
        );
        div.style.position = "absolute";
        div.style.visibility = "hidden";
        div.style.top = "0";
        div.style.left = "0";
        div.style.whiteSpace = "pre-wrap";
        div.textContent = textarea.value.slice(0, pos);

        const span = document.createElement("span");
        span.textContent = "|";
        div.appendChild(span);
        document.body.appendChild(div);

        const rect = textarea.getBoundingClientRect();
        const spanRect = span.getBoundingClientRect();
        const divRect = div.getBoundingClientRect();
        document.body.removeChild(div);

        return {
            top: rect.top + (spanRect.top - divRect.top) + window.scrollY + 24,
            left: rect.left + (spanRect.left - divRect.left) + window.scrollX,
        };
    }

    const onTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const ta = e.target;
        const cursor = ta.selectionStart ?? 0;
        cursorPosRef.current = cursor; // <-- SALVA cursor atual

        const textBefore = ta.value.slice(0, cursor);
        const lastSlash = textBefore.lastIndexOf("\\");

        if (lastSlash !== -1) {
            const afterSlash = textBefore.slice(lastSlash + 1);
            if (!afterSlash.includes(" ") && !afterSlash.includes("\n")) {
                triggerPosRef.current = lastSlash;
                const pos = getCaretPosition(ta, lastSlash);
                setPalette({ open: true, query: afterSlash, selectedIndex: 0, ...pos });
                return;
            }
        }
        setPalette(INITIAL);
    }, []);

    const onKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Atualiza cursor no keydown também
        cursorPosRef.current = (e.target as HTMLTextAreaElement).selectionStart ?? cursorPosRef.current;

        if (!palette.open) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setPalette(p => ({ ...p, selectedIndex: Math.min(p.selectedIndex + 1, filtered.length - 1) }));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setPalette(p => ({ ...p, selectedIndex: Math.max(p.selectedIndex - 1, 0) }));
        } else if (e.key === "Enter" || e.key === "Tab") {
            if (filtered[palette.selectedIndex]) {
                e.preventDefault();
                insertSolver(filtered[palette.selectedIndex][0]);
            }
        } else if (e.key === "Escape") {
            setPalette(INITIAL);
        }
    }, [palette, filtered]);

    function insertSolver(key: string) {
        const triggerPos = triggerPosRef.current;
        const cursor = cursorPosRef.current; // <-- USA valor salvo, não selectionStart
        const token = `\\${key}`;
        const newValue = value.slice(0, triggerPos) + token + value.slice(cursor);

        onChange(newValue);
        setPalette(INITIAL);

        // Restaura foco e posiciona cursor após o token inserido
        setTimeout(() => {
            const ta = textareaRef.current;
            if (!ta) return;
            ta.focus();
            const newCursor = triggerPos + token.length;
            ta.setSelectionRange(newCursor, newCursor);
        }, 0);
    }

    const close = useCallback(() => setPalette(INITIAL), []);

    return { palette, filtered, onTextareaChange, onKeyDown, insertSolver, textareaRef, close };
}
