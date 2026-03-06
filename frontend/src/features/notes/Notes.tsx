import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  DragEvent as ReactDragEvent,
  ChangeEvent,
} from "react";
import { api } from "../../lib/axios";
import { useAuth } from "../../lib/auth";
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

  const POMODORO_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [stats, setStats] = useState<ProductivityStats | null>(null);

  const [contextMenu, setContextMenu] = useState<{ noteId: string; x: number; y: number } | null>(null);
  const [renamingNoteId, setRenamingNoteId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  const [folderContextMenu, setFolderContextMenu] = useState<{ path: string; x: number; y: number } | null>(null);
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [renameFolderValue, setRenameFolderValue] = useState("");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        } catch (err) {
          console.error("Failed to save session", err);
        }
      },
      [selectedTask, fetchStats]
  );

  useEffect(() => {
    // setInterval no frontend: use ReturnType<typeof setInterval> [web:336].
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false);
      setTimeLeft(POMODORO_TIME);
      saveWorkSession(POMODORO_TIME);

      new Audio("https://assets.mixkit.co/active/bell.wav").play().catch(() => {});
      alert(`25 minutes completed for: ${selectedTask}!`);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft, selectedTask, POMODORO_TIME, saveWorkSession]);

  const toggleTimer = () => setIsTimerRunning((prev) => !prev);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(POMODORO_TIME);
  };

  const saveProgress = () => {
    const timeSpent = POMODORO_TIME - timeLeft;
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

  function handleDragStart(e: ReactDragEvent, noteId: string) {
    e.dataTransfer.setData("text/plain", noteId);
    e.dataTransfer.effectAllowed = "move";

    setTimeout(() => {
      const target = e.target as HTMLElement;
      if (target && target.style) target.style.opacity = "0.5";
    }, 0);
  }

  function handleDragEnd(e: ReactDragEvent) {
    const target = e.target as HTMLElement;
    if (target && target.style) target.style.opacity = "1";
    setDragOverFolder(null);
  }

  function handleDragOver(e: ReactDragEvent, folderPath: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
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

  function handleDrop(e: ReactDragEvent, folderPath: string) {
    e.preventDefault();
    setDragOverFolder(null);
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
              onClick={() => toggleFolder(node.path)}
              onContextMenu={(e) => handleFolderContextMenu(e, node.path)}
              onDragOver={(e) => handleDragOver(e, node.path)}
              onDragLeave={() => setDragOverFolder(null)}
              onDrop={(e) => handleDrop(e, node.path)}
          >
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
                  <div className={styles.inputWrapper}>
                <span className={styles.folderContextLabel}>
                  {showNewFolder.parentPath ? `${showNewFolder.parentPath}/` : "/"}
                </span>
                    <input
                        className={styles.newFolderInput}
                        placeholder="Folder name..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addFolder()}
                        autoFocus
                    />
                  </div>
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

            <div className={`${styles.pomodoroTime} ${isTimerRunning ? styles.timeRunning : ""}`}>
              {Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}
              :{(timeLeft % 60).toString().padStart(2, "0")}
            </div>

            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                  className={styles.startSessionBtn}
                  disabled={!selectedTask}
                  onClick={toggleTimer}
                  style={{ flex: 1, backgroundColor: isTimerRunning ? "#dc2626" : "" }}
              >
                {isTimerRunning ? "Pause" : "Start"}
              </button>
            </div>

            {timeLeft < POMODORO_TIME && !isTimerRunning && (
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.2rem" }}>
                  <button
                      className={styles.startSessionBtn}
                      style={{ flex: 2, backgroundColor: "#059669", fontSize: "0.8rem", padding: "0.4rem" }}
                      onClick={saveProgress}
                      title="Save the time you spent so far"
                  >
                    Save Progress
                  </button>
                  <button
                      className={styles.startSessionBtn}
                      style={{ flex: 1, backgroundColor: "#a39581", fontSize: "0.8rem", padding: "0.4rem" }}
                      onClick={resetTimer}
                  >
                    Cancel
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

            <span className={styles.moveLabel} style={{ flex: 1 }}>
            {subject ? subject : "Uncategorized"}
          </span>

            {error && <span style={{ color: "red", fontSize: "0.8rem" }}>{error}</span>}

            <button className={styles.saveBtn} onClick={save} disabled={saving || !title}>
              {saving ? "Saving..." : selected ? "Update" : "Create"}
            </button>

            {selected && (
                <button className={styles.deleteBtn} onClick={() => remove(selected.id)}>
                  Delete
                </button>
            )}
          </header>

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
        </main>

        <aside className={styles.rightPanel}>
          <header className={styles.panelHeader}>
            <span className={styles.moveLabel}>Reference Material (PDF)</span>
            {pdfUrl && (
                <button className={styles.clearPdfBtn} onClick={clearPdf}>
                  Close PDF
                </button>
            )}
          </header>

          <div className={styles.pdfContainer}>
            {pdfUrl ? (
                <object data={pdfUrl} type="application/pdf" width="100%" height="100%" className={styles.pdfViewer}>
                  <p>
                    Your browser does not support PDFs. <a href={pdfUrl}>Download the PDF</a>.
                  </p>
                </object>
            ) : (
                <div className={styles.pdfPlaceholder}>
                  <p>No document loaded</p>

                  <input
                      type="file"
                      accept="application/pdf"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handlePdfUpload}
                  />

                  <button className={styles.pdfUploadBtn} onClick={() => fileInputRef.current?.click()}>
                    Upload PDF for Split View
                  </button>
                </div>
            )}
          </div>
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
      </div>
  );
}
