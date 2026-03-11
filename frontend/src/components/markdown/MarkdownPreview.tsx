// src/components/MarkdownPreview.tsx
import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkWikiLink from "./remarkWikiLink";
import { WikiLink, type WikiNoteInfo } from "./WikiLink";

type Props = {
  content: string;
  notes?: WikiNoteInfo[];
  onNavigate?: (noteId: string) => void;
};

export function MarkdownPreview({ content, notes = [], onNavigate }: Props) {
  const components = useMemo(() => ({
    span: (props: React.HTMLAttributes<HTMLSpanElement> & { "data-wiki-target"?: string; children?: React.ReactNode }) => {
      const target = props["data-wiki-target"];
      if (props.className === "wiki-link" && target) {
        return (
          <WikiLink
            target={target}
            notes={notes}
            onNavigate={onNavigate ?? (() => {})}
          >
            {props.children}
          </WikiLink>
        );
      }
      return <span {...props} />;
    },
  }), [notes, onNavigate]);

  return (
    <div className="markdown-preview">
      <ReactMarkdown
        remarkPlugins={[remarkWikiLink, remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false, output: "html" }]]}
        components={components as React.ComponentProps<typeof ReactMarkdown>["components"]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
