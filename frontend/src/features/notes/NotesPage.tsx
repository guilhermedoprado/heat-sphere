// src/pages/NotesPage.tsx
import React, { useState } from "react";
import MarkdownEditor from "../components/markdown/MarkdownEditor";
import MarkdownPreview from "../components//markdown/MarkdownPreview";

export function NotesPage() {
  const [content, setContent] = useState<string>("Escreva aqui...");

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        <h2>Editor</h2>
        <MarkdownEditor value={content} onChange={setContent} />
      </div>
      <div style={{ flex: 1 }}>
        <h2>Pré-visualização</h2>
        <MarkdownPreview content={content} />
      </div>
    </div>
  );
}
