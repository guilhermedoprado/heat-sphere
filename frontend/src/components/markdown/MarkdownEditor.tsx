import React, { useMemo } from "react";
import MDEditor from "@uiw/react-md-editor";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import remarkWikiLink from "./remarkWikiLink";
import { WikiLink, type WikiNoteInfo } from "./WikiLink";

type Props = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  notes?: WikiNoteInfo[];
  onNavigate?: (noteId: string) => void;
};

export function MarkdownEditor({ value, onChange, readOnly, notes = [], onNavigate }: Props) {
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
    <div data-color-mode="light" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        preview={readOnly ? "preview" : "live"}
        hideToolbar={!!readOnly}
        height="100%"
        visibleDragbar={false}
        previewOptions={{
          remarkPlugins: [remarkWikiLink, remarkMath],
          rehypePlugins: [rehypeKatex],
          components,
        }}
      />
    </div>
  );
}