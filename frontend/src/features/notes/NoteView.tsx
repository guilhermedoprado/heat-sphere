import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import { MarkdownPreview } from "../../components/markdown/MarkdownPreview";
import type { WikiNoteInfo } from "../../components/markdown/WikiLink";
import styles from "./NoteView.module.css";

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

/**
 * Displays a single note in read-only mode, matched by slug + category.
 *
 * Route pattern:  /modules/:slug/:category
 * Example:        /modules/introduction-to-convection/notes
 *
 * It fetches all notes and finds the one whose tags include
 * both the category (e.g. "equation-sheet") and the slug
 * (e.g. "introduction-to-convection").
 *
 * URL path uses "formulary" but the backend tag remains "equation-sheet".
 */

const CATEGORY_TAG_MAP: Record<string, string> = {
  formulary: "equation-sheet",
  notes: "study-notes",
  calculations: "calculation-sheet",
  "case-study": "case-study",
};

const SLUG_LABEL_MAP: Record<string, string> = {
  "introduction-to-convection": "Introduction to Convection",
  "external-flow": "External Flow",
  "internal-flow": "Internal Flow",
  "heat-exchangers": "Heat Exchangers",
  "free-convection": "Free Convection",
  boiling: "Boiling",
  condensation: "Condensation",
};

export default function NoteView() {
  const { slug, category } = useParams<{ slug: string; category: string }>();
  const navigate = useNavigate(); // for wiki-link navigation within notes
  const [matchedNotes, setMatchedNotes] = useState<Note[]>([]); // some topics have multiple notes (e.g. separate ones for "Formulary" and "Study Notes")
  const [allNotes, setAllNotes] = useState<Note[]>([]); 
  const [loading, setLoading] = useState(true); // loading state while fetching notes
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false; // to prevent state updates if component unmounts before fetch completes

    async function fetchNote() { // async function to fetch all notes and find the one matching the slug + category
      try {
        const { data } = await axios.get<Note[]>("/api/notes"); // await the API response with all notes
        const categoryTag = CATEGORY_TAG_MAP[category ?? ""] ?? category; // map URL category to backend tag (e.g. "formulary" -> "equation-sheet")

        const matches = data
          .filter(
            (n) =>
              n.tags.some((t) => t.toLowerCase() === categoryTag) &&
              n.tags.some((t) => t.toLowerCase() === slug)
          )
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        if (!cancelled) {
          setAllNotes(data);
          setMatchedNotes(matches);
          if (matches.length === 0) setError("Note not found for this topic.");
        }
      } catch {
        if (!cancelled) setError("Could not load note. Is the backend running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNote();
    return () => { cancelled = true; };
  }, [category, slug]);

  // Wiki-link helpers
  const wikiNotes: WikiNoteInfo[] = useMemo(
    () => allNotes.map((n) => ({ id: n.id, title: n.title, briefDefinition: n.briefDefinition ?? "" })),
    [allNotes]
  );

  const navigateToNote = useCallback(
    (noteId: string) => {
      const target = allNotes.find((n) => n.id === noteId);
      if (target) {
        // If the target note is tagged for a module view, navigate there
        const moduleSlug = target.tags.find((t) =>
          Object.keys(SLUG_LABEL_MAP).includes(t.toLowerCase())
        );
        const categoryTag = target.tags.find((t) =>
          Object.values(CATEGORY_TAG_MAP).includes(t.toLowerCase())
        );
        const categoryKey = categoryTag
          ? Object.entries(CATEGORY_TAG_MAP).find(([, v]) => v === categoryTag.toLowerCase())?.[0]
          : null;

        if (moduleSlug && categoryKey) {
          navigate(`/modules/${moduleSlug}/${categoryKey}`);
        } else {
          // Fall back to notes editor
          navigate("/notes");
        }
      }
    },
    [allNotes, navigate]
  );

  const topicLabel = SLUG_LABEL_MAP[slug ?? ""] ?? slug;
  const categoryLabel =
    category === "formulary"
      ? "Formulary"
      : category === "calculations"
        ? "Calculation Sheet"
        : category === "case-studies"
          ? "Case Study"
          : category === "notes"
            ? "Study Notes"
            : category;

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Loading…</p>
      </div>
    );
  }

  if (error || matchedNotes.length === 0) {
    return (
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link to={`/modules/${slug}`} className={styles.back}>← {topicLabel}</Link>
        </nav>
        <header className={styles.header}>
          <h1>{categoryLabel}: {topicLabel}</h1>
        </header>
        <p className={styles.error}>{error}</p>
        <p className={styles.hint}>
          Create a note in <Link to="/notes">/notes</Link> and add the tags{" "}
          <code>{CATEGORY_TAG_MAP[category ?? ""] ?? category}</code> and{" "}
          <code>{slug}</code> to link it here.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link to={`/modules/${slug}`} className={styles.back}>← {topicLabel}</Link>
      </nav>
      <header className={styles.header}>
        <h1>{categoryLabel}</h1>
        <p className={styles.meta}>
          {topicLabel}{matchedNotes[0].subject && matchedNotes[0].subject !== topicLabel ? ` · ${matchedNotes[0].subject}` : ""}
        </p>
        <p className={styles.date}>
          {matchedNotes.length} note{matchedNotes.length > 1 ? "s" : ""} · Last revised{" "}
          {new Date(
            Math.max(...matchedNotes.map((n) => new Date(n.updatedAt).getTime()))
          ).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric"
          })}
        </p>
      </header>

      {matchedNotes.length > 1 && (
        <div className={styles.toc}>
          <p className={styles.tocTitle}>Contents</p>
          <ol className={styles.tocList}>
            {matchedNotes.map((n, i) => (
              <li key={n.id} value={n.sortOrder ?? (i + 1)}>
                <a href={`#note-${i}`} className={styles.tocLink}>{n.title}</a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {matchedNotes.map((note, i) => (
        <article key={note.id} id={`note-${i}`} className={styles.content}>
          {matchedNotes.length > 1 && (
            <h1 className={styles.noteSection}>{note.title}</h1>
          )}
          <MarkdownPreview
            content={note.contentMarkdown}
            notes={wikiNotes}
            onNavigate={navigateToNote}
          />
        </article>
      ))}
    </div>
  );
}
