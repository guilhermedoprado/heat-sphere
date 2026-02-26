import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "../../lib/axios";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor";
import type { WikiNoteInfo } from "../../components/markdown/WikiLink";
import styles from "./Notes.module.css";
import { Link } from "react-router-dom";

type Note = {
  id: string;
  title: string;
  subject: string;
  contentMarkdown: string;
  briefDefinition: string;
  sortOrder: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [briefDefinition, setBriefDefinition] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [folders, setFolders] = useState<string[]>([]);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ noteId: string; x: number; y: number } | null>(null);
  const [renamingNoteId, setRenamingNoteId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [movingNoteId, setMovingNoteId] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchNotes() {
      try {
        const { data } = await axios.get<Note[]>("/api/notes");
        if (!cancelled) {
          setNotes(data);
          // Extract unique subjects as folders
          const uniqueSubjects = Array.from(new Set(data.map((n) => n.subject).filter(Boolean)));
          setFolders(uniqueSubjects);
          setOpenFolders(new Set(uniqueSubjects));
        }
      } catch (err) {
        if (!cancelled) setError("Could not load notes. Is the backend running?");
        console.error(err);
      }
    }

    fetchNotes();
    return () => { cancelled = true; };
  }, []);

  function selectNote(note: Note) {
    setSelected(note);
    setTitle(note.title);
    setSubject(note.subject);
    setContent(note.contentMarkdown);
    setBriefDefinition(note.briefDefinition ?? "");
    setSortOrder(note.sortOrder ?? 0);
    setTags(note.tags.join(", "));
  }

  function clearForm() {
    setSelected(null);
    setTitle("");
    setSubject("");
    setContent("");
    setBriefDefinition("");
    setSortOrder(0);
    setTags("");
  }

  function createInFolder(folderName: string) {
    clearForm();
    setSubject(folderName);
  }

  function addFolder() {
    const name = newFolderName.trim();
    if (name && !folders.includes(name)) {
      setFolders((prev) => [...prev, name]);
      setOpenFolders((prev) => new Set(prev).add(name));
    }
    setNewFolderName("");
    setShowNewFolder(false);
  }

  function toggleFolder(folder: string) {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folder)) next.delete(folder);
      else next.add(folder);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setError("");
    const body = {
      title,
      subject,
      contentMarkdown: content,
      briefDefinition,
      sortOrder,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (selected) {
        await axios.put(`/api/notes/${selected.id}`, body);
      } else {
        await axios.post("/api/notes", body);
      }
      const { data } = await axios.get<Note[]>("/api/notes");
      setNotes(data);
      const uniqueSubjects = Array.from(new Set(data.map((n) => n.subject).filter(Boolean)));
      setFolders((prev) => Array.from(new Set([...prev, ...uniqueSubjects])));
      if (!selected) clearForm();
    } catch (err) {
      setError("Failed to save note.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      await axios.delete(`/api/notes/${id}`);
      if (selected?.id === id) clearForm();
      const { data } = await axios.get<Note[]>("/api/notes");
      setNotes(data);
      const uniqueSubjects = Array.from(new Set(data.map((n) => n.subject).filter(Boolean)));
      setFolders((prev) => {
        const merged = new Set([...prev, ...uniqueSubjects]);
        // Remove folders that no longer have notes (unless user-created)
        return Array.from(merged);
      });
    } catch (err) {
      setError("Failed to delete note.");
      console.error(err);
    }
  }

  function handleContextMenu(e: React.MouseEvent, noteId: string) {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ noteId, x: e.clientX, y: e.clientY });
  }

  function closeContextMenu() {
    setContextMenu(null);
  }

  function startRename(noteId: string) {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    setRenamingNoteId(noteId);
    setRenameValue(note.title);
    setContextMenu(null);
  }

  async function confirmRename(noteId: string) {
    const note = notes.find((n) => n.id === noteId);
    if (!note || !renameValue.trim()) {
      setRenamingNoteId(null);
      return;
    }
    try {
      await axios.put(`/api/notes/${noteId}`, {
        title: renameValue.trim(),
        subject: note.subject,
        contentMarkdown: note.contentMarkdown,
        briefDefinition: note.briefDefinition,
        sortOrder: note.sortOrder,
        tags: note.tags,
      });
      const { data } = await axios.get<Note[]>("/api/notes");
      setNotes(data);
      if (selected?.id === noteId) setTitle(renameValue.trim());
    } catch (err) {
      setError("Failed to rename note.");
      console.error(err);
    } finally {
      setRenamingNoteId(null);
    }
  }

  function startMove(noteId: string) {
    setMovingNoteId(noteId);
    setContextMenu(null);
  }

  async function confirmMove(noteId: string, newFolder: string) {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    try {
      await axios.put(`/api/notes/${noteId}`, {
        title: note.title,
        subject: newFolder,
        contentMarkdown: note.contentMarkdown,
        briefDefinition: note.briefDefinition,
        sortOrder: note.sortOrder,
        tags: note.tags,
      });
      const { data } = await axios.get<Note[]>("/api/notes");
      setNotes(data);
      const uniqueSubjects = Array.from(new Set(data.map((n) => n.subject).filter(Boolean)));
      setFolders((prev) => Array.from(new Set([...prev, ...uniqueSubjects])));
      if (selected?.id === noteId) setSubject(newFolder);
    } catch (err) {
      setError("Failed to move note.");
      console.error(err);
    } finally {
      setMovingNoteId(null);
    }
  }

  function confirmDeleteFromMenu(noteId: string) {
    setContextMenu(null);
    remove(noteId);
  }

  // ── Drag & Drop ──
  function handleDragStart(e: React.DragEvent, noteId: string) {
    e.dataTransfer.setData("text/plain", noteId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, folder: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverFolder(folder);
  }

  function handleDragLeave() {
    setDragOverFolder(null);
  }

  function handleDrop(e: React.DragEvent, folder: string) {
    e.preventDefault();
    setDragOverFolder(null);
    const noteId = e.dataTransfer.getData("text/plain");
    if (!noteId) return;
    const note = notes.find((n) => n.id === noteId);
    if (!note || note.subject === folder) return;
    confirmMove(noteId, folder);
  }

  const grouped = new Map<string, Note[]>();
  const ungrouped: Note[] = [];
  for (const note of notes) {
    if (note.subject) {
      const list = grouped.get(note.subject) ?? [];
      list.push(note);
      grouped.set(note.subject, list);
    } else {
      ungrouped.push(note);
    }
  }

  const wikiNotes: WikiNoteInfo[] = useMemo(
    () => notes.map((n) => ({ id: n.id, title: n.title, briefDefinition: n.briefDefinition ?? "" })),
    [notes]
  );

  const navigateToNote = useCallback(
    (noteId: string) => {
      const note = notes.find((n) => n.id === noteId);
      if (note) selectNote(note);
    },
    [notes]
  );

  useEffect(() => {
    if (!contextMenu) return;
    const handler = () => closeContextMenu();
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [contextMenu]);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.backLink}>← Home</Link>
          <h2>Notes</h2>
          <button className={styles.newBtn} onClick={clearForm}>
            + New Note
          </button>
          <button className={styles.addFolderBtn} onClick={() => setShowNewFolder(true)}>
            + New Folder
          </button>
        </div>

        <div className={styles.folderActions}>
          {showNewFolder && (
            <div className={styles.newFolderRow}>
              <input
                className={styles.newFolderInput}
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFolder()}
                autoFocus
              />
              <button className={styles.newFolderConfirm} onClick={addFolder}>Add</button>
              <button className={styles.newFolderCancel} onClick={() => setShowNewFolder(false)}>×</button>
            </div>
          )}
        </div>

        <div className={styles.tree}>
          {folders.map((folder) => (
            <div key={folder} className={styles.folderGroup}>
              <button
                className={`${styles.folderHeader} ${dragOverFolder === folder ? styles.folderDropTarget : ""}`}
                onClick={() => toggleFolder(folder)}
                onDragOver={(e) => handleDragOver(e, folder)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, folder)}
              >
                <span className={styles.folderChevron}>{openFolders.has(folder) ? "▾" : "▸"}</span>
                <span className={styles.folderName}>{folder}</span>
                <span className={styles.folderCount}>{grouped.get(folder)?.length ?? 0}</span>
              </button>
              {openFolders.has(folder) && (
                <ul className={styles.folderNotes}>
                  {(grouped.get(folder) ?? []).map((n) => (
                    <li
                      key={n.id}
                      className={`${styles.item} ${selected?.id === n.id ? styles.active : ""}`}
                      onClick={() => selectNote(n)}
                      onContextMenu={(e) => handleContextMenu(e, n.id)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, n.id)}
                    >
                      {renamingNoteId === n.id ? (
                        <input
                          className={styles.renameInput}
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") confirmRename(n.id);
                            if (e.key === "Escape") setRenamingNoteId(null);
                          }}
                          onBlur={() => confirmRename(n.id)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      ) : (
                        <span className={styles.noteTitle}>{n.title}</span>
                      )}
                      {movingNoteId === n.id && (
                        <div className={styles.moveDropdown} onClick={(e) => e.stopPropagation()}>
                          <span className={styles.moveLabel}>Mover para:</span>
                          {folders.filter((f) => f !== n.subject).map((f) => (
                            <button
                              key={f}
                              className={styles.moveOption}
                              onClick={() => confirmMove(n.id, f)}
                            >
                              {f}
                            </button>
                          ))}
                          <button className={styles.moveCancelBtn} onClick={() => setMovingNoteId(null)}>Cancelar</button>
                        </div>
                      )}
                    </li>
                  ))}
                  <li className={styles.addInFolder} onClick={() => createInFolder(folder)}>
                    + Add note
                  </li>
                </ul>
              )}
            </div>
          ))}

          {ungrouped.length > 0 && (
            <div className={styles.folderGroup}>
              <div className={styles.folderHeader}>
                <span className={styles.folderName} style={{ opacity: 0.5 }}>Uncategorized</span>
              </div>
              <ul className={styles.folderNotes}>
                {ungrouped.map((n) => (
                  <li
                    key={n.id}
                    className={`${styles.item} ${selected?.id === n.id ? styles.active : ""}`}
                    onClick={() => selectNote(n)}
                    onContextMenu={(e) => handleContextMenu(e, n.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, n.id)}
                  >
                    {renamingNoteId === n.id ? (
                      <input
                        className={styles.renameInput}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmRename(n.id);
                          if (e.key === "Escape") setRenamingNoteId(null);
                        }}
                        onBlur={() => confirmRename(n.id)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    ) : (
                      <span className={styles.noteTitle}>{n.title}</span>
                    )}
                    {movingNoteId === n.id && (
                      <div className={styles.moveDropdown} onClick={(e) => e.stopPropagation()}>
                        <span className={styles.moveLabel}>Mover para:</span>
                        {folders.map((f) => (
                          <button
                            key={f}
                            className={styles.moveOption}
                            onClick={() => confirmMove(n.id, f)}
                          >
                            {f}
                          </button>
                        ))}
                        <button className={styles.moveCancelBtn} onClick={() => setMovingNoteId(null)}>Cancelar</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      <main className={styles.editor}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button className={styles.saveBtn} onClick={save} disabled={saving || !title || !subject}>
            {saving ? "Saving..." : selected ? "Update" : "Create"}
          </button>
          {selected && (
            <button className={styles.deleteBtn} onClick={() => remove(selected.id)}>
              Delete
            </button>
          )}
        </div>

        <div className={styles.fields}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Subject / Folder"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <input
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <input
            placeholder="Brief definition (shown on hover)"
            value={briefDefinition}
            onChange={(e) => setBriefDefinition(e.target.value)}
          />
          <input
            type="number"
            placeholder="Order (0, 1, 2...)"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            style={{ maxWidth: "120px" }}
          />
        </div>

        <div className={styles.mdEditor}>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            notes={wikiNotes}
            onNavigate={navigateToNote}
          />
        </div>
      </main>

      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.contextMenuItem} onClick={() => startRename(contextMenu.noteId)}>
            Rename
          </button>
          <button className={styles.contextMenuItem} onClick={() => startMove(contextMenu.noteId)}>
            Move to folder
          </button>
          <button className={`${styles.contextMenuItem} ${styles.contextMenuDanger}`} onClick={() => confirmDeleteFromMenu(contextMenu.noteId)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}