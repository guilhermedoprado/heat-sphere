import { useEffect, useState } from "react";
import { SolverLabels } from "./SolverLabels";

export type SlashItem = { key: string; label: string };

export function useSlashCommand(
    value: string,
    cursorPos: number,
    onInsert: (key: string) => void
) {
    const [open, setOpen]       = useState(false);
    const [query, setQuery]     = useState("");
    const [triggerPos, setTriggerPos] = useState<number | null>(null);

    useEffect(() => {
        // Pega tudo desde o último \ até o cursor
        const textBeforeCursor = value.slice(0, cursorPos);
        const lastBackslash    = textBeforeCursor.lastIndexOf("\\");

        if (lastBackslash === -1) { setOpen(false); return; }

        const fragment = textBeforeCursor.slice(lastBackslash + 1);

        // Se tem espaço depois do \, fecha o menu
        if (fragment.includes(" ") || fragment.includes("\n")) {
            setOpen(false);
            return;
        }

        setQuery(fragment.toLowerCase());
        setTriggerPos(lastBackslash);
        setOpen(true);
    }, [value, cursorPos]);

    const filtered: SlashItem[] = Object.entries(SolverLabels)
        .filter(([key, label]) =>
            key.includes(query) || label.toLowerCase().includes(query)
        )
        .map(([key, label]) => ({ key, label }));

    function select(key: string) {
        setOpen(false);
        onInsert(key);
    }

    return { open, filtered, select, triggerPos };
}
