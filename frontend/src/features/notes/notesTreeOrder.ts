/** Utilitários para ordenação da árvore (Tabela 7.9 / sidebar Notes). */

export function parentFolderPath(path: string): string {
    const i = path.lastIndexOf("/");
    return i === -1 ? "" : path.slice(0, i);
}

export function isDirectChildOf(parentPath: string, childPath: string): boolean {
    if (!childPath) return false;
    if (parentPath === "") return !childPath.includes("/");
    const prefix = `${parentPath}/`;
    if (!childPath.startsWith(prefix)) return false;
    return !childPath.slice(prefix.length).includes("/");
}

/** Caminhos de pastas que são filhos diretos de `parentPath`. */
export function collectImmediateChildPaths(
    parentPath: string,
    foldersList: string[],
    subjects: string[]
): string[] {
    const set = new Set<string>();
    for (const p of foldersList) {
        if (isDirectChildOf(parentPath, p)) set.add(p);
    }
    for (const s of subjects) {
        if (s && isDirectChildOf(parentPath, s)) set.add(s);
    }
    return Array.from(set);
}

export function getFolderMarkerSortOrder(
    allNotes: { title: string; subject: string; sortOrder?: number }[],
    folderPath: string
): number {
    const m = allNotes.find((n) => n.title === ".sys_folder_marker" && n.subject === folderPath);
    return m?.sortOrder ?? 1_000_000;
}

export type FolderNodeMutable = {
    name: string;
    path: string;
    subFolders: Record<string, FolderNodeMutable>;
    notes: { sortOrder?: number; title: string }[];
};

/** Ordena notas em cada pasta e subpastas por sortOrder + título; pastas por marcador + nome. */
export function applyOrderingToTree(
    root: Record<string, FolderNodeMutable>,
    allNotes: { title: string; subject: string; sortOrder?: number }[]
): void {
    const walk = (node: FolderNodeMutable) => {
        node.notes.sort(
            (a, b) =>
                (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title)
        );
        const sortedSubs = Object.values(node.subFolders).sort((a, b) => {
            const oa = getFolderMarkerSortOrder(allNotes, a.path);
            const ob = getFolderMarkerSortOrder(allNotes, b.path);
            if (oa !== ob) return oa - ob;
            return a.name.localeCompare(b.name);
        });
        const next: Record<string, FolderNodeMutable> = {};
        for (const s of sortedSubs) next[s.name] = s;
        node.subFolders = next;
        sortedSubs.forEach(walk);
    };

    const top = Object.values(root).sort((a, b) => {
        const oa = getFolderMarkerSortOrder(allNotes, a.path);
        const ob = getFolderMarkerSortOrder(allNotes, b.path);
        if (oa !== ob) return oa - ob;
        return a.name.localeCompare(b.name);
    });

    for (const k of Object.keys(root)) delete root[k];
    for (const t of top) {
        root[t.name] = t;
        walk(t);
    }
}
