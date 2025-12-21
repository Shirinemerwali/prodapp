import { useEffect, useMemo, useState } from "react";
import "./todos.css";
import { TODO_CATEGORIES, getTodos, createTodo as createTodoApi, updateTodo as updateTodoApi, deleteTodo as deleteTodoApi } from "../utils/storage";


function formatDate(yyyyMmDd) {
  if (!yyyyMmDd) return "—";
  return yyyyMmDd;
}

function Todos() {
  const [showForm, setShowForm] = useState(false);

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterStatus, setFilterStatus] = useState(""); 
  const [selectedCategories, setSelectedCategories] = useState(new Set(TODO_CATEGORIES));
  const [sortOption, setSortOption] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState("");
  const [category, setCategory] = useState(TODO_CATEGORIES[0]);
  const [deadline, setDeadline] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editEstimate, setEditEstimate] = useState("");
  const [editCategory, setEditCategory] = useState(TODO_CATEGORIES[0]);
  const [editDeadline, setEditDeadline] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  async function loadTodos() {
    setError("");
    setLoading(true);
    try {
      const data = await getTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Kunde inte ladda ärenden.");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    let list = [...todos];

    if (filterStatus === "done") list = list.filter((t) => Boolean(t.done));
    if (filterStatus === "open") list = list.filter((t) => !t.done);

    list = list.filter((t) => selectedCategories.has(t.category));

    if (sortOption === "deadline-asc") {
      list.sort((a, b) => String(a.deadline || "").localeCompare(String(b.deadline || "")));
    }
    if (sortOption === "deadline-desc") {
      list.sort((a, b) => String(b.deadline || "").localeCompare(String(a.deadline || "")));
    }

    if (sortOption === "estimate-asc") {
      list.sort((a, b) => Number(a.estimate ?? 0) - Number(b.estimate ?? 0));
    }
    if (sortOption === "estimate-desc") {
      list.sort((a, b) => Number(b.estimate ?? 0) - Number(a.estimate ?? 0));
    }

    if (sortOption === "status-asc") {
      list.sort((a, b) => Number(Boolean(a.done)) - Number(Boolean(b.done)));
    }
    if (sortOption === "status-desc") {
      list.sort((a, b) => Number(Boolean(b.done)) - Number(Boolean(a.done)));
    }

    if (sortOption === "created-asc") {
      list.sort((a, b) => Number(a.createdAt || 0) - Number(b.createdAt || 0));
    }

    if (sortOption === "created-desc") {
      list.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    }

    return list;
  }, [todos, filterStatus, sortOption, selectedCategories]);

  function toggleCategory(cat) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      if (next.size === 0) return prev;
      return next;
    });
  }

  function selectAllCategories() {
    setSelectedCategories(new Set(TODO_CATEGORIES));
  }

  async function createTodo() {
    setError("");

    const t = title.trim();
    if (!t) return setError("Titel krävs.");
    if (!category) return setError("Välj en kategori.");
    if (!deadline) return setError("Välj en deadline.");

    const est = estimate === "" ? 0 : Number(estimate);
    if (!Number.isFinite(est) || est < 0) {
      return setError("Tidsestimat måste vara ett nummer (0 eller mer).");
    }

    try {
      const newTodo = await createTodoApi({
        title: t,
        description: description.trim(),
        done: false,
        estimate: est,
        category,
        deadline,
      });

      setTodos((prev) => [newTodo, ...prev]);
      setTitle("");
      setDescription("");
      setEstimate("");
      setCategory(TODO_CATEGORIES[0]);
      setDeadline("");
      setShowForm(false);
    } catch (e) {
      console.error(e);
      setError("Kunde inte skapa ärendet.");
    }
  }


  async function patchTodo(id, patch) {
    setError("");
    try {
      const updated = await updateTodoApi(id, patch);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      console.error(e);
      setError("Kunde inte uppdatera ärendet.");
    }
  }


  async function deleteTodo(id) {
    setError("");
    try {
      await deleteTodoApi(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error(e);
      setError("Kunde inte ta bort ärendet.");
    }
  }


  function startEdit(todo) {
    setError("");
    setEditingId(todo.id);
    setEditTitle(todo.title || "");
    setEditDescription(todo.description || "");
    setEditEstimate(String(todo.estimate ?? ""));
    setEditCategory(todo.category || TODO_CATEGORIES[0]);
    setEditDeadline(todo.deadline || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditEstimate("");
    setEditCategory(TODO_CATEGORIES[0]);
    setEditDeadline("");
    setSavingEdit(false);
  }

  async function saveEdit(id) {
    setError("");
    const t = editTitle.trim();
    if (!t) return setError("Titel krävs.");
    if (!editCategory) return setError("Välj en kategori.");
    if (!editDeadline) return setError("Välj en deadline.");

    const est = editEstimate === "" ? 0 : Number(editEstimate);
    if (!Number.isFinite(est) || est < 0) {
      return setError("Tidsestimat måste vara ett nummer (0 eller mer).");
    }

    setSavingEdit(true);
    try {
      const updated = await updateTodoApi(id, {
        title: t,
        description: editDescription.trim(),
        estimate: est,
        category: editCategory,
        deadline: editDeadline,
      });

      setTodos((prev) => prev.map((x) => (x.id === id ? updated : x)));
      setEditingId(null);
      setSavingEdit(false);
    } catch (e) {
      console.error(e);
      setError("Kunde inte spara ändringar.");
      setSavingEdit(false);
    }
  }


  return (
    <div className="todos-wrapper">
      <div className="todos-container">
        <h1 className="todos-title">Mina Ärenden</h1>

        <div className="filter-sort-bar">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Filtrera status</option>
            <option value="open">Ej utförd</option>
            <option value="done">Slutförd</option>
          </select>

          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Sortera</option>
            <option value="deadline-asc">Deadline – stigande</option>
            <option value="deadline-desc">Deadline – fallande</option>
            <option value="estimate-asc">Tidsestimat – stigande</option>
            <option value="estimate-desc">Tidsestimat – fallande</option>
            <option value="status-asc">Status – Ej utförd först</option>
            <option value="status-desc">Status – Slutförd först</option>
            <option value="created-desc">Skapad – senaste</option>
            <option value="created-asc">Skapad – tidigaste</option>
          </select>
        </div>

        <div className="category-filter">
          <h3>Kategorier</h3>
          <div className="category-grid">
            {TODO_CATEGORIES.map((cat) => (
              <label key={cat} className="category-item">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="reset-btn" type="button" onClick={selectAllCategories}>
              Välj alla
            </button>
          </div>
        </div>

        <button className="toggle-form-btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Stäng formulär" : "Lägg till nytt ärende"}
        </button>

        {showForm && (
          <div className="todo-form">
            <h2>Lägg till ärende</h2>

            <input
              type="text"
              placeholder="Titel (t.ex. Städa köket)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Beskrivning (valfritt)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="form-row">
              <input
                type="number"
                min="0"
                placeholder="Tidsestimat (t.ex. 30)"
                value={estimate}
                onChange={(e) => setEstimate(e.target.value)}
              />

              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {TODO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

            <button className="submit-btn" onClick={createTodo}>
              Lägg till
            </button>
          </div>
        )}

        {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}
        {loading && <p style={{ marginTop: 12 }}>Laddar…</p>}

        <div className="todo-list">
          {!loading && visibleTodos.map((todo) => (
            <div className={`todo-card ${todo.done ? "done" : ""}`} key={todo.id}>
              {editingId === todo.id ? (
                <>
                  <div className="todo-info todo-form" >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Titel"
                    />

                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Beskrivning"
                    />

                    <div className="form-row">
                      <input
                        type="number"
                        min="0"
                        value={editEstimate}
                        onChange={(e) => setEditEstimate(e.target.value)}
                        placeholder="Tidsestimat"
                      />

                      <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                        {TODO_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
                  </div>

                  <div className="todo-buttons">
                    <button
                      className="submit-btn"
                      onClick={() => saveEdit(todo.id)}
                      disabled={savingEdit || !editTitle.trim()}
                    >
                      {savingEdit ? "Sparar…" : "Spara"}
                    </button>

                    <button className="reset-btn" onClick={cancelEdit} disabled={savingEdit}>
                      Avbryt
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="todo-info">
                    <div className="todo-headline">
                      <h3 className={`todo-title ${todo.done ? "done" : ""}`}>{todo.title}</h3>
                    </div>

                    {todo.description ? <p className="todo-detail">{todo.description}</p> : null}

                    <div className="todo-meta">
                      <span className="pill">📌 {todo.category || "—"}</span>
                      <span className="pill">⏱ {Number(todo.estimate ?? 0)} min</span>
                      <span className="pill">📅 {formatDate(todo.deadline)}</span>
                      <span className="pill">{todo.done ? "✅ Slutförd" : "🕒 Ej utförd"}</span>
                    </div>
                  </div>

                  <div className="todo-buttons">
                    <button
                      className={todo.done ? "undone-btn" : "done-btn"}
                      onClick={() => patchTodo(todo.id, { done: !todo.done })}
                    >
                      {todo.done ? "↩️" : "✅"}
                    </button>

                    <button className="reset-btn" onClick={() => startEdit(todo)}>✏️</button>
                    <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>🗑</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Todos;