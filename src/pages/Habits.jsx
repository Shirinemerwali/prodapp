import { useEffect, useMemo, useState } from "react";
import "./habits.css";

function Habits() {
  const [showForm, setShowForm] = useState(false);

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterPriority, setFilterPriority] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("Låg");
  const [savingEdit, setSavingEdit] = useState(false);

  async function loadHabits() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/habits", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load habits");
      const data = await res.json();
      setHabits(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Kunde inte ladda vanor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHabits();
  }, []);

  const visibleHabits = useMemo(() => {
    let list = [...habits];

    if (filterPriority) {
      list = list.filter((h) => h.priority === filterPriority);
    }

    if (sortOption === "reps-asc") list.sort((a, b) => (a.reps ?? 0) - (b.reps ?? 0));
    if (sortOption === "reps-desc") list.sort((a, b) => (b.reps ?? 0) - (a.reps ?? 0));

    const prioRank = { "Låg": 1, "Mellan": 2, "Hög": 3 };
    if (sortOption === "prio-asc") list.sort((a, b) => (prioRank[a.priority] || 0) - (prioRank[b.priority] || 0));
    if (sortOption === "prio-desc") list.sort((a, b) => (prioRank[b.priority] || 0) - (prioRank[a.priority] || 0));

    return list;
  }, [habits, filterPriority, sortOption]);

  async function createHabit() {
    setError("");
    const t = title.trim();
    if (!t) {
      setError("Titel krävs.");
      return;
    }

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: t, priority: priority || "Låg" }),
      });
      if (!res.ok) throw new Error("Failed to create habit");
      const newHabit = await res.json();
      setHabits((prev) => [newHabit, ...prev]);
      setTitle("");
      setPriority("");
      setShowForm(false);
    } catch (e) {
      console.error(e);
      setError("Kunde inte spara vanan.");
    }
  }

  async function patchHabit(id, patch) {
    setError("");
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Failed to update habit");
      const updated = await res.json();
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    } catch (e) {
      console.error(e);
      setError("Kunde inte uppdatera vanan.");
    }
  }

  async function deleteHabit(id) {
    setError("");
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete habit");
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (e) {
      console.error(e);
      setError("Kunde inte ta bort vanan.");
    }
  }

  function startEdit(habit) {
    setError("");
    setEditingId(habit.id);
    setEditTitle(habit.title || "");
    setEditPriority(habit.priority || "Låg");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditPriority("Låg");
    setSavingEdit(false);
  }

  async function saveEdit(id) {
    setError("");
    const t = editTitle.trim();
    if (!t) {
      setError("Titel krävs.");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: t, priority: editPriority || "Låg" }),
      });
      if (!res.ok) throw new Error("Failed to update habit");
      const updated = await res.json();
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
      cancelEdit();
    } catch (e) {
      console.error(e);
      setError("Kunde inte spara ändringarna.");
      setSavingEdit(false);
    }
  }

    return (
    <div className="habits-wrapper habits">

      <div className="habits-container">

        <h1 className="habits-title">Mina Vanor</h1>

        <div className="filter-sort-bar">
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">Filtrera prioritet</option>
            <option value="Låg">Låg</option>
            <option value="Mellan">Mellan</option>
            <option value="Hög">Hög</option>
          </select>

          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Sortera</option>
            <option value="reps-asc">Repetitioner – stigande</option>
            <option value="reps-desc">Repetitioner – fallande</option>
            <option value="prio-asc">Prioritet – stigande</option>
            <option value="prio-desc">Prioritet – fallande</option>
          </select>
        </div>

        <button
          className="toggle-form-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Stäng formulär" : "Lägg till ny vana"}
        </button>

        {showForm && (
          <div className="habit-form">
            <h2>Lägg till vana</h2>

            <input
              type="text"
              placeholder="Titel (t.ex. Träna)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Reps starts at 0. You can increment on the card buttons. */}

            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">Prioritet</option>
              <option value="Låg">Låg</option>
              <option value="Mellan">Mellan</option>
              <option value="Hög">Hög</option>
            </select>

            <button className="submit-btn" onClick={createHabit}>Lägg till vana</button>
          </div>
        )}

        {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}

        {loading && <p style={{ marginTop: 12 }}>Laddar…</p>}

        <div className="habit-list">
          {!loading && visibleHabits.map((habit) => (
            <div className="habit-card" key={habit.id}>

              {editingId === habit.id ? (
                <>
                  <div className="habit-info">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Titel"
                      style={{ width: "100%" }}
                    />

                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      style={{ marginTop: 8, width: "100%" }}
                    >
                      <option value="Låg">Låg</option>
                      <option value="Mellan">Mellan</option>
                      <option value="Hög">Hög</option>
                    </select>
                  </div>

                  <div className="habit-buttons">
                    <button
                      className="submit-btn"
                      onClick={() => saveEdit(habit.id)}
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
                  <div className="habit-info">
                    <h3>{habit.title}</h3>
                    <p className="habit-detail">Repetitioner: {habit.reps ?? 0}</p>
                    <p className="habit-detail">Prioritet: {habit.priority || "Låg"}</p>
                  </div>

                  <div className="habit-buttons">
                    <button
                      className="minus-btn"
                      onClick={() => patchHabit(habit.id, { reps: Math.max(0, (habit.reps || 0) - 1) })}
                    >
                      –
                    </button>
                    <button
                      className="plus-btn"
                      onClick={() => patchHabit(habit.id, { reps: (habit.reps || 0) + 1 })}
                    >
                      +
                    </button>
                    <button className="reset-btn" onClick={() => patchHabit(habit.id, { reps: 0 })}>↺</button>
                    <button className="reset-btn" onClick={() => startEdit(habit)}>✏️</button>
                    <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>🗑</button>
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

export default Habits;