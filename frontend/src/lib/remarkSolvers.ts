// src/lib/remarkSolvers.ts
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Text, Parent, Code } from "mdast";

const SOLVER_REGEX = /\\([\w-]+)/g;

const remarkSolvers: Plugin<[], Root> = () => (tree) => {
    visit(tree, "text", (node: Text, index, parent: Parent | null) => {
        if (!parent || index === undefined) return;

        const matches = [...node.value.matchAll(SOLVER_REGEX)];
        if (matches.length === 0) return;

        const newNodes: (Text | Code)[] = [];
        let lastIndex = 0;

        for (const match of matches) {
            const start = match.index!;
            const solverKey = match[1];

            if (start > lastIndex) {
                newNodes.push({ type: "text", value: node.value.slice(lastIndex, start) });
            }

            // Emite como nó "code" com lang="solver:nome"
            // O handler `code` no MarkdownEditor já sabe tratar isso
            newNodes.push({
                type: "code",
                lang: `solver:${solverKey}`,
                value: "",
            } as Code);

            lastIndex = start + match[0].length;
        }

        if (lastIndex < node.value.length) {
            newNodes.push({ type: "text", value: node.value.slice(lastIndex) });
        }

        parent.children.splice(index, 1, ...newNodes);
    });
};

export default remarkSolvers;
