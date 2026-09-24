import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownWideNarrow, CalendarDays, Check, CheckCheck, ChevronDown,
  Circle, Clock3, ListTodo, Plus, Search, Sparkles, Trash2, X,
} from "lucide-react";

const STORAGE_KEY = "otabara-todos-v2";
const filters = ["Toutes", "À faire", "Terminées"];
const priorities = ["Basse", "Normale", "Haute"];

function readTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(saved ?? localStorage.getItem("todos") ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((task) => task && typeof task.text === "string").map((task) => ({
          ...task,
          id: task.id ?? `${Date.now()}-${Math.random()}`,
          completed: Boolean(task.completed),
          priority: task.priority || "Normale",
          dueDate: task.dueDate || "",
        }))
      : [];
  } catch {
    return [];
  }
}

function dateLabel(value) {
  if (!value) return "";
  const due = new Date(`${value}T12:00:00`);
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const days = Math.round((startDue - startToday) / 86400000);
  if (days === 0) return "Aujourd’hui";
  if (days === 1) return "Demain";
  if (days === -1) return "En retard";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(due);
}

function TaskRow({ task, editingId, editText, setEditText, setEditingId, toggleTodo, saveEdit, deleteTodo }) {
  return (
    <article className={`task-row ${task.completed ? "is-complete" : ""}`}>
      <button className={`check-button ${task.completed ? "checked" : ""}`} onClick={() => toggleTodo(task.id)} aria-label={task.completed ? "Marquer comme à faire" : "Marquer comme terminée"}>
        {task.completed ? <Check size={15} strokeWidth={2.8} /> : <span />}
      </button>
      {editingId === task.id ? (
        <form className="edit-form" onSubmit={(event) => { event.preventDefault(); saveEdit(task.id); }}>
          <input autoFocus value={editText} onChange={(event) => setEditText(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setEditingId(null); }} aria-label="Modifier la tâche" />
          <button className="icon-button" aria-label="Enregistrer"><Check size={16} /></button>
          <button type="button" className="icon-button" onClick={() => setEditingId(null)} aria-label="Annuler"><X size={16} /></button>
        </form>
      ) : (
        <button className="task-copy" onDoubleClick={() => { setEditingId(task.id); setEditText(task.text); }} title="Double-cliquer pour modifier">
          <span className="task-title">{task.text}</span>
          <span className="task-meta">
            {task.dueDate && <span className={`due-chip ${!task.completed && dateLabel(task.dueDate) === "En retard" ? "overdue" : ""}`}><CalendarDays size={12} />{dateLabel(task.dueDate)}</span>}
            {!task.completed && task.priority && task.priority !== "Normale" && <span className={`priority-chip ${task.priority.toLowerCase()}`}>{task.priority}</span>}
          </span>
        </button>
      )}
      {editingId !== task.id && <div className="task-actions">
        <button className="icon-button edit-action" aria-label={`Modifier ${task.text}`} onClick={() => { setEditingId(task.id); setEditText(task.text); }}><span>Modifier</span></button>
        <button className="icon-button delete-action" aria-label={`Supprimer ${task.text}`} onClick={() => deleteTodo(task.id)}><Trash2 size={16} /></button>
      </div>}
    </article>
  );
}

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [ready, setReady] = useState(false);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Toutes");
  const [priority, setPriority] = useState("Normale");
  const [dueDate, setDueDate] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => { setTodos(readTodos()); setReady(true); }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, ready]);

  const openTodos = useMemo(() => todos.filter((task) => !task.completed), [todos]);
  const completedTodos = useMemo(() => todos.filter((task) => task.completed), [todos]);
  const shownOpen = useMemo(() => openTodos.filter((task) => task.text.toLowerCase().includes(query.toLowerCase())), [openTodos, query]);
  const shownCompleted = useMemo(() => completedTodos.filter((task) => task.text.toLowerCase().includes(query.toLowerCase())), [completedTodos, query]);
  const progress = todos.length ? Math.round(completedTodos.length / todos.length * 100) : 0;

  function addTodo(event) {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    setTodos((current) => [{ id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, text: clean, completed: false, priority, dueDate, createdAt: new Date().toISOString() }, ...current]);
    setText(""); setDueDate(""); setPriority("Normale"); setShowComposer(false);
  }
  function toggleTodo(id) { setTodos((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed, completedAt: task.completed ? null : new Date().toISOString() } : task)); }
  function deleteTodo(id) { setTodos((current) => current.filter((task) => task.id !== id)); }
  function saveEdit(id) {
    const clean = editText.trim();
    if (clean) setTodos((current) => current.map((task) => task.id === id ? { ...task, text: clean } : task));
    setEditingId(null); setEditText("");
  }
  return (
    <>
      <Head>
        <title>Clair — ta journée, en mieux</title>
        <meta name="description" content="Une liste de tâches simple, sereine et toujours à portée de main." />
        <meta name="theme-color" content="#f7f7f3" />
      </Head>
      <main className="app-shell">
        <aside className="sidebar">
          <a className="brand" href="#accueil" aria-label="Clair, accueil"><span className="brand-mark"><CheckCheck size={19} /></span><span>clair<span className="brand-dot">.</span></span></a>
          <div className="sidebar-label">ESPACE DE TRAVAIL</div>
          <button className={`nav-item ${filter === "Toutes" ? "active" : ""}`} onClick={() => setFilter("Toutes")}><ListTodo size={17} /><span>Ma journée</span><span className="nav-count">{openTodos.length}</span></button>
          <button className={`nav-item ${filter === "À faire" ? "active" : ""}`} onClick={() => setFilter("À faire")}><Circle size={17} /><span>À faire</span><span className="nav-count">{openTodos.length}</span></button>
          <button className={`nav-item ${filter === "Terminées" ? "active" : ""}`} onClick={() => setFilter("Terminées")}><Check size={17} /><span>Terminées</span><span className="nav-count">{completedTodos.length}</span></button>
          <div className="sidebar-bottom"><div className="sidebar-tip"><Sparkles size={16} /><p><strong>Un pas à la fois.</strong><br />Les grandes choses commencent par une petite tâche.</p></div><div className="storage-note"><span className="storage-dot" />Données enregistrées sur cet appareil</div></div>
        </aside>

        <section className="workspace" id="accueil">
          <header className="topbar"><div className="breadcrumb">Mon espace <span>/</span> <strong>Ma journée</strong></div><div className="today-label"><Clock3 size={14} />{new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</div></header>
          <div className="content">
            <div className="page-heading"><div><div className="eyebrow">VOTRE ESPACE, VOTRE RYTHME</div><h1>Ma journée<span className="heading-period">.</span></h1><p>Un peu de clarté pour avancer sereinement.</p></div><div className="day-badge"><span>{new Intl.DateTimeFormat("fr-FR", { day: "2-digit" }).format(new Date())}</span><small>{new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(new Date()).replace(".", "").toUpperCase()}</small></div></div>

            <section className="progress-card" aria-label="Progression du jour"><div className="progress-top"><div><span className="progress-title">Votre progression</span><span className="progress-subtitle">{completedTodos.length} sur {todos.length} tâche{todos.length === 1 ? "" : "s"} terminée{completedTodos.length === 1 ? "" : "s"}</span></div><span className="progress-percent">{progress}<small>%</small></span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div></section>

            <div className="list-heading"><div><h2>À faire <span>{openTodos.length}</span></h2><p>Choisissez une chose, puis commencez.</p></div><button className="add-button" onClick={() => setShowComposer((value) => !value)}>{showComposer ? <X size={17} /> : <Plus size={17} />}<span>{showComposer ? "Fermer" : "Nouvelle tâche"}</span></button></div>

            {showComposer && <form className="composer" onSubmit={addTodo}><label className="sr-only" htmlFor="new-task">Votre prochaine tâche</label><input id="new-task" autoFocus placeholder="Qu’aimeriez-vous accomplir ?" value={text} onChange={(event) => setText(event.target.value)} maxLength={160} /><div className="composer-options"><label className="select-wrap"><ArrowDownWideNarrow size={14} /><select value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Priorité">{priorities.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label><label className="date-wrap"><CalendarDays size={14} /><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} aria-label="Échéance" /></label><button className="submit-button" disabled={!text.trim()}>Ajouter <span>↗</span></button></div></form>}

            <div className="list-toolbar"><div className="filter-tabs" role="tablist" aria-label="Filtrer les tâches">{filters.map((item) => <button role="tab" aria-selected={filter === item} className={filter === item ? "selected" : ""} key={item} onClick={() => setFilter(item)}>{item === "Toutes" ? "Tout" : item}</button>)}</div><label className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher" aria-label="Rechercher une tâche" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Effacer la recherche"><X size={14} /></button>}</label></div>

            {filter !== "Terminées" && <div className="task-list">{shownOpen.length ? shownOpen.map((task) => <TaskRow task={task} key={task.id} editingId={editingId} editText={editText} setEditText={setEditText} setEditingId={setEditingId} toggleTodo={toggleTodo} saveEdit={saveEdit} deleteTodo={deleteTodo} />) : <div className="empty-state"><span className="empty-icon">{query ? <Search size={19} /> : <CheckCheck size={19} />}</span><strong>{query ? "Aucun résultat" : openTodos.length ? "Rien ne correspond" : "Tout est à jour."}</strong><p>{query ? "Essayez un autre mot-clé." : openTodos.length ? "Modifiez votre recherche pour voir les tâches." : "Prenez un instant pour savourer votre avancée."}</p>{!query && <button onClick={() => setShowComposer(true)}><Plus size={15} />Ajouter une tâche</button>}</div>}</div>}

            {filter !== "À faire" && completedTodos.length > 0 && <section className="completed-section"><button className="completed-heading" onClick={() => setShowCompleted((value) => !value)} aria-expanded={showCompleted}><span className="completed-chevron"><ChevronDown size={15} /></span><span>Terminées</span><span className="completed-count">{completedTodos.length}</span></button>{showCompleted && <div className="task-list completed-list">{shownCompleted.map((task) => <TaskRow task={task} key={task.id} editingId={editingId} editText={editText} setEditText={setEditText} setEditingId={setEditingId} toggleTodo={toggleTodo} saveEdit={saveEdit} deleteTodo={deleteTodo} />)}</div>}</section>}

            {todos.length > 0 && <footer className="list-footer"><span>Chaque petite avancée compte.</span>{completedTodos.length > 0 && <button onClick={() => setTodos((current) => current.filter((task) => !task.completed))}>Effacer les tâches terminées <Trash2 size={13} /></button>}</footer>}
          </div>
          <footer className="page-footer"><span>Fait avec intention.</span><span>Clair <span className="brand-dot">✳</span></span></footer>
        </section>
      </main>
    </>
  );
}
