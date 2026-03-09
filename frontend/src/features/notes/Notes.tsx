import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  DragEvent as ReactDragEvent,
  ChangeEvent,
} from "react";
import { api } from "../../lib/axios";
import { useAuth } from "../../lib/auth";
import { useFocusTimer } from "../../hooks/useFocusTimer";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor";
import type { WikiNoteInfo } from "../../components/markdown/WikiLink";
import { PdfSlot } from "./PdfSlot";
import styles from "./Notes.module.css";
import { Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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

type FolderNode = {
  name: string;
  path: string;
  subFolders: Record<string, FolderNode>;
  notes: Note[];
};

type ProductivityStats = {
  tasks: { taskName: string; totalSeconds: number }[];
  totalOverall: number;
};

export default function Notes() {
  const { user, logout } = useAuth();
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
  const [showNewFolder, setShowNewFolder] = useState<{
    visible: boolean;
    parentPath: string | null;
  }>({ visible: false, parentPath: null });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditingMd, setIsEditingMd] = useState(false);

  // Tipar como HTMLDivElement evita o erro de ref no <div> [web:335].
  const editorAreaRef = useRef<HTMLDivElement | null>(null);

  const [tasks, setTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem("deepWorkTasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [newTaskName, setNewTaskName] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);


  const [stats, setStats] = useState<ProductivityStats | null>(null);

  const [contextMenu, setContextMenu] = useState<{ noteId: string; x: number; y: number } | null>(null);
  const [renamingNoteId, setRenamingNoteId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const draggedFolderRef = useRef<string | null>(null);

  const [folderContextMenu, setFolderContextMenu] = useState<{ path: string; x: number; y: number } | null>(null);
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [renameFolderValue, setRenameFolderValue] = useState("");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [middleBarMode, setMiddleBarMode] = useState<"editor" | "pdf">("editor");
  const [pdfUrlMiddle, setPdfUrlMiddle] = useState<string | null>(null);
  const fileInputRefMiddle = useRef<HTMLInputElement>(null);

  const noteExportRef = useRef<HTMLDivElement>(null);

  const handleExportNotePDF = () => {
    const node = noteExportRef.current;
    if (!node || !content) return;
  
    const katexCSS = Array.from(document.styleSheets)
      .filter(s => { try { return !!s.href?.includes("katex"); } catch { return false; } })
      .map(s => { try { return Array.from(s.cssRules).map(r => r.cssText).join("\n"); } catch { return ""; } })
      .join("\n");
  
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) { alert("Permita pop-ups para este site."); return; }
  
    win.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>${title || "Nota"}</title>
        <style>
          ${katexCSS}
          *, *::before, *::after { box-sizing: border-box; }
          body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            font-size: 0.95rem;
            line-height: 1.75;
            color: #1e293b;
            margin: 2rem 2.5rem;
            background: white;
          }
          h1 { font-size: 1.5rem; border-bottom: 3px solid #c15a01; padding-bottom: 0.4rem; color: #0f172a; }
          h2 { font-size: 1.15rem; color: #7c3a10; border-left: 4px solid #c15a01; padding-left: 0.7rem; margin-top: 2rem; }
          h3 { font-size: 1rem; color: #334155; margin-top: 1.2rem; }
          p  { color: #3d2b1a; margin: 0.5rem 0; }
          .katex-display {
            background: rgba(193,90,1,0.06);
            border-left: 4px solid #c15a01;
            border-radius: 0 8px 8px 0;
            padding: 0.75rem 1.25rem;
            margin: 1rem 0;
            overflow-x: auto;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Solver blocks aparecem como nota de rodapé */
          pre {
            background: #f5ede0;
            border: 1px dashed #c15a01;
            border-radius: 6px;
            padding: 0.75rem 1rem;
            font-size: 0.82rem;
            color: #9a4800;
            overflow-x: auto;
          }
          pre::before {
            content: "⚙ Solver (use o app para ver os resultados)";
            display: block;
            font-size: 0.75rem;
            color: #c15a01;
            margin-bottom: 0.3rem;
            font-style: italic;
          }
          code { background: #f0e4d0; color: #9a4800; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.88em; }
          table { width: 100%; border-collapse: collapse; margin: 1.2rem 0; }
          thead th { background: #7c3a10; color: white; padding: 0.6rem 1rem; text-align: left; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          tbody tr:nth-child(even) { background: #f5ede0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          tbody td { padding: 0.5rem 1rem; border-top: 1px solid #e0ccb4; }
          blockquote { background: rgba(193,90,1,0.07); border-left: 4px solid #c15a01; border-radius: 0 8px 8px 0; padding: 0.65rem 1rem; margin: 1rem 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          hr { border: none; border-top: 1.5px solid #e0ccb4; margin: 2rem 0; }
          @media print {
            body { margin: 1.5cm 2cm; }
            .katex-display, pre, table, blockquote { page-break-inside: avoid; }
            h2, h3 { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>${title || "Nota"}</h1>
        ${subject ? `<p style="color:#9a9a9a;font-size:0.85rem;margin:0 0 2rem">📁 ${subject}</p>` : ""}
        ${node.innerHTML}
      </body>
      </html>
    `);
  
    win.document.close();
    win.onload = () => setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
  }; 

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editorAreaRef.current && !editorAreaRef.current.contains(event.target as Node)) {
        setIsEditingMd(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchNotes() {
      try {
        const { data } = await api.get<Note[]>("/api/notes");
        if (!cancelled) {
          setNotes(data);
          const uniqueSubjects = Array.from(new Set(data.map((n) => n.subject).filter(Boolean)));
          setFolders(uniqueSubjects);
          setOpenFolders(new Set(uniqueSubjects));
        }
      } catch (err) {
        if (!cancelled) setError("Could not load notes.");
        console.error(err);
      }
    }

    fetchNotes();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get<ProductivityStats>("/api/productivity/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const saveWorkSession = useCallback(
      async (durationSecs: number) => {
        if (!selectedTask || durationSecs <= 0) return;
        try {
          await api.post("/api/productivity/session", {
            taskName: selectedTask,
            durationSeconds: durationSecs,
          });
          fetchStats();
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Foco concluído", {
              body: `${selectedTask} — ${Math.floor(durationSecs / 60)} min`,
            });
          }
        } catch (err) {
          console.error("Failed to save session", err);
        }
      },
      [selectedTask, fetchStats]
  );

  const timer = useFocusTimer({ onWorkComplete: saveWorkSession });
  const {
    timeLeft,
    isRunning: isTimerRunning,
    phase: timerPhase,
    config: timerConfig,
    toggle: toggleTimer,
    reset: resetTimer,
    setWorkMinutes,
    setBreakMinutes,
    setAutoAdvance,
    switchToWork,
    switchToBreak,
    workSecs,
    MIN_WORK,
    MAX_WORK,
    MIN_BREAK,
    MAX_BREAK,
  } = timer;

  const saveProgress = () => {
    const timeSpent = workSecs - timeLeft;
    saveWorkSession(timeSpent);
    resetTimer();
  };

  const formatStatsTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  function selectNote(note: Note) {
    setSelected(note);
    setTitle(note.title);
    setSubject(note.subject);
    setContent(note.contentMarkdown);
    setBriefDefinition(note.briefDefinition ?? "");
    setSortOrder(note.sortOrder ?? 0);
    setTags(note.tags.join(", "));
    setIsEditingMd(!note.contentMarkdown);
  }

  function clearForm() {
    setSelected(null);
    setTitle("");
    setSubject("");
    setContent("");
    setBriefDefinition("");
    setSortOrder(0);
    setTags("");
    setIsEditingMd(true);
  }

  function createInFolder(folderPath: string) {
    clearForm();
    setSubject(folderPath);
  }

  async function addFolder() {
    const name = newFolderName.trim();
    if (!name) return;

    const fullPath = showNewFolder.parentPath ? `${showNewFolder.parentPath}/${name}` : name;

    if (!folders.includes(fullPath)) {
      setFolders((prev) => [...prev, fullPath]);
      setOpenFolders((prev) => new Set(prev).add(fullPath));
      if (showNewFolder.parentPath) {
        setOpenFolders((prev) => new Set(prev).add(showNewFolder.parentPath!));
      }
    }

    setNewFolderName("");
    setShowNewFolder({ visible: false, parentPath: null });

    try {
      await api.post("/api/notes", {
        title: ".sys_folder_marker",
        subject: fullPath,
        contentMarkdown: " ",
        briefDefinition: "System marker to persist empty folder",
        sortOrder: 0,
        tags: ["system_marker"],
      });

      const { data } = await api.get<Note[]>("/api/notes");
      setNotes(data);
    } catch (err) {
      console.error("Failed to persist folder", err);
    }
  }

  function addTask() {
    const name = newTaskName.trim();
    if (name && !tasks.includes(name)) {
      setTasks((prev) => {
        const newTasks = [...prev, name];
        localStorage.setItem("deepWorkTasks", JSON.stringify(newTasks));
        return newTasks;
      });
      setSelectedTask(name);
    }
    setNewTaskName("");
    setShowNewTask(false);
  }

  function toggleFolder(folderPath: string) {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) next.delete(folderPath);
      else next.add(folderPath);
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
        await api.put(`/api/notes/${selected.id}`, body);
      } else {
        await api.post("/api/notes", body);
      }

      const { data } = await api.get<Note[]>("/api/notes");
      setNotes(data);

      const uniqueSubjects = Array.from(new Set(data.map((n) => n.subject).filter(Boolean)));
      setFolders((prev) => Array.from(new Set([...prev, ...uniqueSubjects])));

      if (!selected) clearForm();
    } catch (err) {
      setError("Failed to save note.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      await api.delete(`/api/notes/${id}`);
      if (selected?.id === id) clearForm();

      const { data } = await api.get<Note[]>("/api/notes");
      setNotes(data);

      const uniqueSubjects = Array.from(new Set(data.map((n) => n.subject).filter(Boolean)));
      setFolders((prev) => Array.from(new Set([...prev, ...uniqueSubjects])));
    } catch (err) {
      setError("Failed to delete note.");
    }
  }

  function handleContextMenu(e: ReactMouseEvent, noteId: string) {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ noteId, x: e.clientX, y: e.clientY });
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
      await api.put(`/api/notes/${noteId}`, { ...note, title: renameValue.trim() });
      const { data } = await api.get<Note[]>("/api/notes");
      setNotes(data);
      if (selected?.id === noteId) setTitle(renameValue.trim());
    } finally {
      setRenamingNoteId(null);
    }
  }

  function handleFolderContextMenu(e: ReactMouseEvent, folderPath: string) {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu(null);
    setFolderContextMenu({ path: folderPath, x: e.clientX, y: e.clientY });
  }

  async function deleteFolder(folderPath: string) {
    if (!window.confirm(`Delete folder "${folderPath}" and ALL its notes?`)) return;

    try {
      await api.delete(`/api/notes/folder?folderPath=${encodeURIComponent(folderPath)}`);
      if (selected?.subject?.startsWith(folderPath)) clearForm();

      const { data } = await api.get<Note[]>("/api/notes");
      setNotes(data);

      const uniqueSubjects = Array.from(new Set(data.map((n) => n.subject).filter(Boolean)));
      setFolders(uniqueSubjects);
    } catch (err) {
      setError("Failed to delete folder.");
    } finally {
      setFolderContextMenu(null);
    }
  }

  function startFolderRename(folderPath: string) {
    setRenamingFolder(folderPath);
    const parts = folderPath.split("/");
    setRenameFolderValue(parts[parts.length - 1]);
    setFolderContextMenu(null);
  }

  async function confirmFolderRename(oldPath: string) {
    if (!renameFolderValue.trim()) {
      setRenamingFolder(null);
      return;
    }

    const parts = oldPath.split("/");
    parts[parts.length - 1] = renameFolderValue.trim();
    const newPath = parts.join("/");

    if (newPath === oldPath) {
      setRenamingFolder(null);
      return;
    }

    try {
      await api.put(
          `/api/notes/folder/rename?oldPath=${encodeURIComponent(oldPath)}&newPath=${encodeURIComponent(newPath)}`
      );

      if (selected?.subject?.startsWith(oldPath)) {
        setSubject(newPath + selected.subject.substring(oldPath.length));
      }

      const { data } = await api.get<Note[]>("/api/notes");
      setNotes(data);

      const uniqueSubjects = Array.from(new Set(data.map((n) => n.subject).filter(Boolean)));
      setFolders(uniqueSubjects);
    } catch (err) {
      setError("Failed to rename folder.");
    } finally {
      setRenamingFolder(null);
    }
  }

  const FOLDER_DRAG_TYPE = "application/x-folder-path";

  function handleDragStart(e: ReactDragEvent, noteId: string) {
    e.dataTransfer.setData("text/plain", noteId);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      const target = e.target as HTMLElement;
      if (target?.style) target.style.opacity = "0.5";
    }, 0);
  }

  function handleFolderDragStart(e: ReactDragEvent, folderPath: string) {
    draggedFolderRef.current = folderPath;
    e.dataTransfer.setData(FOLDER_DRAG_TYPE, folderPath);
    e.dataTransfer.setData("text/plain", ""); // evita conflito com note
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
    setTimeout(() => {
      const target = e.target as HTMLElement;
      if (target?.style) target.style.opacity = "0.5";
    }, 0);
  }

  function handleDragEnd(e: ReactDragEvent) {
    const target = e.target as HTMLElement;
    if (target?.style) target.style.opacity = "1";
    draggedFolderRef.current = null;
    setDragOverFolder(null);
  }

  function handleDragOver(e: ReactDragEvent, folderPath: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const draggedFolder = draggedFolderRef.current;
    if (draggedFolder && (folderPath === draggedFolder || folderPath.startsWith(draggedFolder + "/"))) {
      setDragOverFolder(null);
      return;
    }
    if (dragOverFolder !== folderPath) setDragOverFolder(folderPath);
  }

  async function confirmMove(noteId: string, newFolderPath: string) {
    const noteIndex = notes.findIndex((n) => n.id === noteId);
    if (noteIndex === -1) return;

    const note = notes[noteIndex];
    if (note.subject === newFolderPath) return;

    const oldSubject = note.subject;

    setNotes((prev) => {
      const newNotes = [...prev];
      newNotes[noteIndex] = { ...newNotes[noteIndex], subject: newFolderPath };
      return newNotes;
    });

    if (selected?.id === noteId) setSubject(newFolderPath);

    try {
      await api.put(`/api/notes/${noteId}`, { ...note, subject: newFolderPath });
      setFolders((prev) => (prev.includes(newFolderPath) ? prev : [...prev, newFolderPath]));
      setOpenFolders((prev) => new Set(prev).add(newFolderPath));
    } catch (err) {
      setNotes((prev) => {
        const rollback = [...prev];
        const idx = rollback.findIndex((n) => n.id === noteId);
        if (idx > -1) rollback[idx] = { ...rollback[idx], subject: oldSubject };
        return rollback;
      });
      setError("Failed to move note.");
    }
  }

  async function confirmFolderMove(oldPath: string, newPath: string) {
    if (oldPath === newPath) return;
    if (newPath.startsWith(oldPath + "/")) return; // não mover para dentro de si
    try {
      await api.put(
          `/api/notes/folder/rename?oldPath=${encodeURIComponent(oldPath)}&newPath=${encodeURIComponent(newPath)}`
      );
      const { data } = await api.get<Note[]>("/api/notes");
      setNotes(data);
      setFolders(Array.from(new Set(data.map((n) => n.subject).filter(Boolean))));
      if (selected?.subject?.startsWith(oldPath)) {
        setSubject(newPath + selected.subject.substring(oldPath.length));
      }
    } catch {
      setError("Failed to move folder.");
    }
  }

  function handleDrop(e: ReactDragEvent, folderPath: string) {
    e.preventDefault();
    setDragOverFolder(null);
    const folderPathDragged = e.dataTransfer.getData(FOLDER_DRAG_TYPE);
    if (folderPathDragged) {
      const leaf = folderPathDragged.split("/").pop() ?? folderPathDragged;
      const newPath = folderPath ? `${folderPath}/${leaf}` : leaf;
      confirmFolderMove(folderPathDragged, newPath);
      return;
    }
    const noteId = e.dataTransfer.getData("text/plain");
    if (noteId) confirmMove(noteId, folderPath);
  }

  function handlePdfUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
    } else if (file) {
      alert("Please upload a valid PDF file.");
    }
    e.target.value = "";
  }

  function clearPdf() {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
  }

  function handlePdfUploadMiddle(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      setPdfUrlMiddle(fileUrl);
    } else if (file) {
      alert("Please upload a valid PDF file.");
    }
    e.target.value = "";
  }

  function clearPdfMiddle() {
    if (pdfUrlMiddle) URL.revokeObjectURL(pdfUrlMiddle);
    setPdfUrlMiddle(null);
  }

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      if (pdfUrlMiddle) URL.revokeObjectURL(pdfUrlMiddle);
    };
  }, [pdfUrl, pdfUrlMiddle]);

  // FIX: tipagem explícita + deps obrigatórias do useMemo (corrige TS2554/TS2339).
  const { tree, ungrouped } = useMemo<{ tree: Record<string, FolderNode>; ungrouped: Note[] }>(() => {
    const root: Record<string, FolderNode> = {};
    const ungroupedList: Note[] = [];

    const allPaths = new Set([...folders, ...notes.map((n) => n.subject).filter(Boolean)]);

    for (const path of allPaths) {
      const parts = path.split("/");
      let currentLevel: Record<string, FolderNode> = root;
      let currentPath = "";

      for (const part of parts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        if (!currentLevel[part]) {
          currentLevel[part] = { name: part, path: currentPath, subFolders: {}, notes: [] };
        }
        currentLevel = currentLevel[part].subFolders;
      }
    }

    for (const note of notes) {
      if (note.title === ".sys_folder_marker") continue;

      if (!note.subject) {
        ungroupedList.push(note);
        continue;
      }

      const parts = note.subject.split("/");
      let currentLevel: Record<string, FolderNode> = root;
      let targetNode: FolderNode | undefined;

      for (const part of parts) {
        const node = currentLevel[part];
        if (!node) {
          targetNode = undefined;
          break;
        }
        targetNode = node;
        currentLevel = node.subFolders;
      }

      if (targetNode) targetNode.notes.push(note);
    }

    return { tree: root, ungrouped: ungroupedList };
  }, [notes, folders]);

  const renderFolderNode = (node: FolderNode, level = 0) => {
    const isOpen = openFolders.has(node.path);
    const isDragOver = dragOverFolder === node.path;
    const paddingLeft = `${1 + level * 1.2}rem`;

    return (
        <div key={node.path}>
          <div
              className={`${styles.folderHeader} ${isDragOver ? styles.dragOver : ""}`}
              style={{
                paddingLeft,
                backgroundColor: isDragOver ? "rgba(193, 90, 1, 0.15)" : "",
                border: isDragOver ? "1px dashed #c15a01" : "none",
              }}
              draggable
              onDragStart={(e) => handleFolderDragStart(e, node.path)}
              onDragEnd={handleDragEnd}
              onClick={() => toggleFolder(node.path)}
              onContextMenu={(e) => handleFolderContextMenu(e, node.path)}
              onDragOver={(e) => handleDragOver(e, node.path)}
              onDragLeave={() => setDragOverFolder(null)}
              onDrop={(e) => handleDrop(e, node.path)}
          >
            <span
                className={styles.folderDragHandle}
                title="Arrastar pasta"
                onClick={(e) => e.stopPropagation()}
            >
              ⋮⋮
            </span>
            <span className={styles.folderToggleIcon}>{isOpen ? "▾" : "▸"}</span>

            {renamingFolder === node.path ? (
                <input
                    className={styles.renameInput}
                    value={renameFolderValue}
                    onChange={(e) => setRenameFolderValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmFolderRename(node.path);
                      if (e.key === "Escape") setRenamingFolder(null);
                    }}
                    onBlur={() => confirmFolderRename(node.path)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                />
            ) : (
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{node.name}</span>
            )}

            <button
                className={styles.addSubFolderIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNewFolder({ visible: true, parentPath: node.path });
                  setShowNewTask(false);
                }}
                title="Add subfolder"
            >
              +
            </button>
          </div>

          {isOpen && (
              <ul className={styles.folderNotes}>
                {Object.values(node.subFolders).map((subNode) => renderFolderNode(subNode, level + 1))}

                {node.notes.map((n) => (
                    <li
                        key={n.id}
                        className={`${styles.item} ${selected?.id === n.id ? styles.active : ""}`}
                        style={{ paddingLeft: `${2.2 + level * 1.2}rem` }}
                        onClick={() => selectNote(n)}
                        onContextMenu={(e) => handleContextMenu(e, n.id)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, n.id)}
                        onDragEnd={handleDragEnd}
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
                          <span>{n.title}</span>
                      )}
                    </li>
                ))}

                <li
                    className={styles.addInFolder}
                    style={{ paddingLeft: `${2.2 + level * 1.2}rem` }}
                    onClick={() => createInFolder(node.path)}
                >
                  + Add Note
                </li>
              </ul>
          )}
        </div>
    );
  };

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
    if (!contextMenu && !folderContextMenu) return;

    const handler = () => {
      setContextMenu(null);
      setFolderContextMenu(null);
    };

    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [contextMenu, folderContextMenu]);

  const isUngroupedDragOver = dragOverFolder === "Ungrouped";

  return (
      <div className={styles.notesWorkspace}>
        <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.hidden : ""}`}>
          <div className={styles.sidebarHeader}>
            <Link to="/" className={styles.backLink}>
              ← Back to Home
            </Link>
            <h2>My Notes</h2>

            {user && (
              <div className={styles.userRow}>
                {user.pictureUrl && (
                  <img src={user.pictureUrl} alt={user.name} className={styles.userAvatar} />
                )}
                <span className={styles.userName}>{user.name}</span>
                <button className={styles.logoutBtn} onClick={logout} title="Sign out">
                  ↪
                </button>
              </div>
            )}

            <button className={styles.newBtn} onClick={clearForm}>
              + New Note
            </button>

            <div className={styles.btnRow}>
              <button
                  className={styles.addFolderBtn}
                  onClick={() => {
                    setShowNewFolder({ visible: true, parentPath: null });
                    setShowNewTask(false);
                  }}
              >
                + New Folder
              </button>
              <button
                  className={styles.addTaskBtn}
                  onClick={() => {
                    setShowNewTask(true);
                    setShowNewFolder({ visible: false, parentPath: null });
                  }}
              >
                + New Task
              </button>
            </div>
          </div>

          <div className={styles.folderActions}>
            {showNewFolder.visible && (
                <div className={styles.newFolderRow}>
                  <input
                      className={styles.newFolderInput}
                      placeholder="Folder name..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addFolder()}
                      autoFocus
                  />
                  <button className={styles.newFolderConfirm} onClick={addFolder}>
                    Add
                  </button>
                  <button
                      className={styles.newFolderCancel}
                      onClick={() => setShowNewFolder({ visible: false, parentPath: null })}
                  >
                    ×
                  </button>
                </div>
            )}

            {showNewTask && (
                <div className={styles.newFolderRow}>
                  <input
                      className={styles.newFolderInput}
                      placeholder="What to do?..."
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask()}
                      autoFocus
                  />
                  <button className={styles.newFolderConfirm} onClick={addTask}>
                    Add
                  </button>
                  <button className={styles.newFolderCancel} onClick={() => setShowNewTask(false)}>
                    ×
                  </button>
                </div>
            )}
          </div>

          <div className={styles.tree}>
            {Object.values(tree).map((node) => renderFolderNode(node, 0))}

            {ungrouped.length > 0 && (
                <div>
                  <div
                      className={`${styles.folderHeader} ${isUngroupedDragOver ? styles.dragOver : ""}`}
                      style={{
                        paddingLeft: "1rem",
                        backgroundColor: isUngroupedDragOver ? "rgba(193, 90, 1, 0.15)" : "",
                        border: isUngroupedDragOver ? "1px dashed #c15a01" : "none",
                      }}
                      onClick={() => toggleFolder("Ungrouped")}
                      onDragOver={(e) => handleDragOver(e, "Ungrouped")}
                      onDragLeave={() => setDragOverFolder(null)}
                      onDrop={(e) => handleDrop(e, "Ungrouped")}
                  >
                    <span className={styles.folderToggleIcon}>{openFolders.has("Ungrouped") ? "▾" : "▸"}</span>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>Ungrouped</span>
                  </div>

                  {openFolders.has("Ungrouped") && (
                      <ul className={styles.folderNotes}>
                        {ungrouped.map((n: Note) => (
                            <li
                                key={n.id}
                                className={`${styles.item} ${selected?.id === n.id ? styles.active : ""}`}
                                style={{ paddingLeft: `2.2rem` }}
                                onClick={() => selectNote(n)}
                                onContextMenu={(e) => handleContextMenu(e, n.id)}
                                draggable
                                onDragStart={(e) => handleDragStart(e, n.id)}
                                onDragEnd={handleDragEnd}
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
                                  <span>{n.title}</span>
                              )}
                            </li>
                        ))}
                      </ul>
                  )}
                </div>
            )}
          </div>

          <div className={styles.pomodoroWidget}>
            <span className={styles.moveLabel}>Deep Work Tracker</span>

            <div className={styles.timerConfig}>
              <div className={styles.timerConfigRow}>
                <label className={styles.timerConfigLabel}>Focus (min)</label>
                <input
                    type="number"
                    min={MIN_WORK}
                    max={MAX_WORK}
                    value={timerConfig.workMinutes}
                    onChange={(e) => setWorkMinutes(Number(e.target.value) || MIN_WORK)}
                    disabled={isTimerRunning}
                    className={styles.timerConfigInput}
                />
              </div>
              <div className={styles.timerConfigRow}>
                <label className={styles.timerConfigLabel}>Pause (min)</label>
                <input
                    type="number"
                    min={MIN_BREAK}
                    max={MAX_BREAK}
                    value={timerConfig.breakMinutes}
                    onChange={(e) => setBreakMinutes(Number(e.target.value) || MIN_BREAK)}
                    disabled={isTimerRunning}
                    className={styles.timerConfigInput}
                />
              </div>
              <label className={styles.timerConfigCheck}>
                <input
                    type="checkbox"
                    checked={timerConfig.autoAdvance}
                    onChange={(e) => setAutoAdvance(e.target.checked)}
                    disabled={isTimerRunning}
                />
                <span>Auto advance focus ↔ pause</span>
              </label>
            </div>

            <select
                className={styles.taskSelect}
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                disabled={isTimerRunning}
            >
              <option value="" disabled>
                {tasks.length === 0 ? "Create a task first ☝️" : "Select Task..."}
              </option>
              {tasks.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
              ))}
            </select>

            <div
                className={`${styles.pomodoroTime} ${isTimerRunning ? styles.timeRunning : ""} ${timerPhase === "break" ? styles.timeBreak : ""}`}
            >
              {Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}
              :{(timeLeft % 60).toString().padStart(2, "0")}
            </div>

            {!isTimerRunning && (
                <div className={styles.phaseSwitcher}>
                  <button
                      type="button"
                      className={`${styles.phaseBtn} ${timerPhase === "work" ? styles.phaseBtnActive : ""}`}
                      onClick={switchToWork}
                  >
                    Foco
                  </button>
                  <button
                      type="button"
                      className={`${styles.phaseBtn} ${timerPhase === "break" ? styles.phaseBtnActive : ""}`}
                      onClick={switchToBreak}
                  >
                    Pausa
                  </button>
                </div>
            )}

            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                  className={styles.startSessionBtn}
                  disabled={timerPhase === "work" && !selectedTask}
                  onClick={toggleTimer}
                  style={{ flex: 1, backgroundColor: isTimerRunning ? "#dc2626" : "" }}
              >
                {isTimerRunning ? "Pausar" : "Iniciar"}
              </button>
            </div>

            {timerPhase === "work" && timeLeft < workSecs && !isTimerRunning && (
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.2rem" }}>
                  <button
                      className={styles.startSessionBtn}
                      style={{ flex: 2, backgroundColor: "#059669", fontSize: "0.8rem", padding: "0.4rem" }}
                      onClick={saveProgress}
                      title="Salvar o tempo já estudado"
                  >
                    Salvar progresso
                  </button>
                  <button
                      className={styles.startSessionBtn}
                      style={{ flex: 1, backgroundColor: "#a39581", fontSize: "0.8rem", padding: "0.4rem" }}
                      onClick={resetTimer}
                  >
                    Cancelar
                  </button>
                </div>
            )}

            {stats && stats.totalOverall > 0 && (
                <div className={styles.statsContainer}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <span className={styles.moveLabel}>Dashboard</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#c15a01" }}>
                  Total: {formatStatsTime(stats.totalOverall)}
                </span>
                  </div>

                  <ul className={styles.statsList}>
                    {stats.tasks.map((stat) => (
                        <li key={stat.taskName} className={styles.statItem}>
                    <span className={styles.statTask} title={stat.taskName}>
                      {stat.taskName}
                    </span>
                          <span className={styles.statCount}>{formatStatsTime(stat.totalSeconds)}</span>
                        </li>
                    ))}
                  </ul>
                </div>
            )}
          </div>
        </aside>

        <main className={styles.centerPanel}>
          <header className={styles.panelHeader}>
            <button className={styles.toggleSidebarBtn} onClick={() => setIsSidebarOpen((p) => !p)}>
              {isSidebarOpen ? "◀" : "▶"}
            </button>

            <button
              className={styles.modeToggleBtn}
              onClick={() => setMiddleBarMode((m) => (m === "editor" ? "pdf" : "editor"))}
              title={middleBarMode === "editor" ? "Switch to PDF view (compare two PDFs)" : "Switch to Note editor"}
            >
              {middleBarMode === "editor" ? "📄 PDF" : "📝 Editor"}
            </button>

            <span className={styles.moveLabel} style={{ flex: 1 }}>
              {middleBarMode === "editor" ? (subject ? subject : "Uncategorized") : "Exercise / Your PDF"}
            </span>

            {error && <span style={{ color: "red", fontSize: "0.8rem" }}>{error}</span>}

            {middleBarMode === "editor" && (
              <>
                <button className={styles.saveBtn} onClick={save} disabled={saving || !title}>
                  {saving ? "Saving..." : selected ? "Update" : "Create"}
                </button>
                {selected && (
                  <button className={styles.deleteBtn} onClick={() => remove(selected.id)}>
                    Delete
                  </button>
                )}
              </>
            )}
            {middleBarMode === "pdf" && pdfUrlMiddle && (
              <button className={styles.clearPdfBtn} onClick={clearPdfMiddle}>
                Close PDF
              </button>
            )}
          </header>

          {middleBarMode === "editor" ? (
            <div
              ref={editorAreaRef}
              className={styles.editorContainer}
              onClick={() => setIsEditingMd(true)}
              style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
            >
              <div className={styles.editorToolbar}>
                <input
                  className={styles.titleInput}
                  placeholder="Untitled Note..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className={`${styles.editor} ${styles.editorScroll}`} style={{ cursor: isEditingMd ? "text" : "pointer" }}>
                <div className={styles.mdEditor}>
                  <MarkdownEditor
                    value={content}
                    onChange={setContent}
                    notes={wikiNotes}
                    onNavigate={navigateToNote}
                    previewMode={isEditingMd || !content ? "edit" : "preview"}
                  />
                </div>
              </div>
            </div>
          ) : (
            <PdfSlot
              pdfUrl={pdfUrlMiddle}
              onUpload={handlePdfUploadMiddle}
              onClear={clearPdfMiddle}
              slotLabel="Exercise"
              fileInputRef={fileInputRefMiddle}
            />
          )}
          {middleBarMode === "editor" && (
            <>
              {content && (
                <button
                  className={styles.exportPdfIconBtn}
                  onClick={handleExportNotePDF}
                  title="Export as PDF"
                >
                  Export as PDF ⬇
                </button>
              )}
            </>
          )}
        </main>

        <aside className={styles.rightPanel}>
          <header className={styles.panelHeader}>
            <span className={styles.moveLabel}>Solution / Reference PDF</span>
            {pdfUrl && (
              <button className={styles.clearPdfBtn} onClick={clearPdf}>
                Close PDF
              </button>
            )}
          </header>
          <PdfSlot
            pdfUrl={pdfUrl}
            onUpload={handlePdfUpload}
            onClear={clearPdf}
            slotLabel="Reference PDF"
            fileInputRef={fileInputRef}
          />
        </aside>

        {contextMenu && (
            <div
                className={styles.contextMenu}
                style={{ top: contextMenu.y, left: contextMenu.x }}
                onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.contextMenuItem} onClick={() => startRename(contextMenu.noteId)}>
                Rename
              </button>
              <button
                  className={`${styles.contextMenuItem} ${styles.contextMenuDanger}`}
                  onClick={() => {
                    setContextMenu(null);
                    remove(contextMenu.noteId);
                  }}
              >
                Delete
              </button>
            </div>
        )}

        {folderContextMenu && (
            <div
                className={styles.contextMenu}
                style={{ top: folderContextMenu.y, left: folderContextMenu.x }}
                onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.contextMenuItem} onClick={() => startFolderRename(folderContextMenu.path)}>
                Rename Folder
              </button>
              <button
                  className={`${styles.contextMenuItem} ${styles.contextMenuDanger}`}
                  onClick={() => deleteFolder(folderContextMenu.path)}
              >
                Delete Folder & Notes
              </button>
            </div>
        )}
        {/* Render oculto para exportação PDF */}
        <div
          ref={noteExportRef}
          data-color-mode="light"
          style={{
            position: "absolute",
            left: "-9999px",
            visibility: "hidden",
            width: "800px",
            padding: "2rem",
            background: "white",
            fontSize: "0.95rem",
            lineHeight: "1.75",
            color: "#1e293b",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
          }}
        >
          <h1 style={{ color: "#0f172a", marginBottom: "0.5rem" }}>{title}</h1>
          {subject && <p style={{ color: "#9a9a9a", fontSize: "0.85rem", marginBottom: "2rem" }}>{subject}</p>}

          <MDEditor.Markdown
            source={content}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </div>
      </div>
  );
}
