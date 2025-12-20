import { useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../utils/storage";
import "./events.css";

function Events() {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  // create form
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  // edit
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------
  // Load events
  // ---------------------------------------------------
  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Kunde inte ladda händelser.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);
  // ---------------------------------------------------
  // Create event
  // ---------------------------------------------------
  async function addEvent() {
    setError("");

    if (!title.trim() || !start || !end) {
      setError("Titel, start och slut krävs.");
      return;
    }

    if (new Date(end) <= new Date(start)) {
      setError("Sluttid måste vara efter starttid.");
      return;
    }

    try {
      const newEvent = await createEvent({
        title: title.trim(),
        description: desc.trim(),
        start,
        end,
      });

      setEvents((prev) => [...prev, newEvent]);

      setTitle("");
      setDesc("");
      setStart("");
      setEnd("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Kunde inte spara händelsen.");
    }
  }
  // ---------------------------------------------------
  // Edit event
  // ---------------------------------------------------

  function startEdit(ev) {
    setError("");
    setEditingId(ev.id);
    setEditTitle(ev.title || "");
    setEditDesc(ev.description || "");
    setEditStart(ev.start || "");
    setEditEnd(ev.end || "");
  }
  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDesc("");
    setEditStart("");
    setEditEnd("");
    setSaving(false);
  }

  async function saveEdit(id) {
    setError("");

    if (!editTitle.trim() || !editStart || !editEnd) {
      setError("Titel, start och slut krävs.");
      return;
    }

    if (new Date(editEnd) <= new Date(editStart)) {
      setError("Sluttid måste vara efter starttid.");
      return;
    }

    setSaving(true);

    try {
      const updated = await updateEvent(id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        start: editStart,
        end: editEnd,
      });

      setEvents((prev) => prev.map((ev) => (ev.id === id ? updated : ev)));
      cancelEdit();
    } catch (err) {
      console.error(err);
      setError("Kunde inte spara ändringarna.");
      setSaving(false);
    }
  }
  // ---------------------------------------------------
  // Delete event
  // ---------------------------------------------------
  async function removeEvent(id) {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error(err);
      setError("Kunde inte ta bort händelsen.");
    }
  }

  const now = new Date();
  let filtered = [...events];
  // sort always by start time
  filtered.sort((a, b) => new Date(a.start) - new Date(b.start));
  if (filter === "upcoming") {
    filtered = filtered.filter((ev) => new Date(ev.start) >= now);
  }
  if (filter === "past") {
    filtered = filtered.filter((ev) => new Date(ev.end) < now);
  }
  return (
    <div className="events-wrapper">
      <div className="events-container">
        <h1 className="events-title">Mina Händelser</h1>
        {/* Filter */}
        <div className="filter-sort-bar">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Alla</option>
            <option value="upcoming">Kommande</option>
            <option value="past">Tidigare</option>
          </select>
        </div>
        {/* Toggle form */}
        <button
          className="toggle-form-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Stäng formulär" : "Lägg till ny händelse"}
        </button>
        {/* Create form */}
        {showForm && (
          <div className="event-form">
            <h2>Ny händelse</h2>
            <input
              type="text"
              placeholder="Titel på händelsen (t.ex. 'Möte med teamet')"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Beskrivning (valfritt)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <label>Start</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <label>Slut</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
            <button className="submit-btn" onClick={addEvent}>
              Spara händelse
            </button>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        {loading && <p>Laddar…</p>}
        {/* Event list */}
        <div className="event-list">
          {!loading &&
            filtered.map((ev) => {
              const isPast = new Date(ev.end) < new Date();
              return (
                <div
                  className="event-card"
                  key={ev.id}
                  style={{ opacity: isPast ? 0.55 : 1 }}
                >
                  {editingId === ev.id ? (
                    <>
                      <div className="event-form">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <textarea
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                        />
                        <label>Start</label>
                        <input
                          type="datetime-local"
                          value={editStart}
                          onChange={(e) => setEditStart(e.target.value)}
                        />
                        <label>Slut</label>
                        <input
                          type="datetime-local"
                          value={editEnd}
                          onChange={(e) => setEditEnd(e.target.value)}
                        />
                      </div>
                      <div className="event-buttons">
                        <button
                          className="submit-btn"
                          onClick={() => saveEdit(ev.id)}
                          disabled={saving}
                        >
                          {saving ? "Sparar…" : "Spara"}
                        </button>
                        <button className="reset-btn" onClick={cancelEdit}>
                          Avbryt
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="event-info">
                        <h3>{ev.title}</h3>
                        <p>{ev.description || "Ingen beskrivning"}</p>
                        <p>
                          <strong>Start:</strong>{" "}
                          {new Date(ev.start).toLocaleString()}
                        </p>
                        <p>
                          <strong>Slut:</strong>{" "}
                          {new Date(ev.end).toLocaleString()}
                        </p>
                      </div>
                      <div className="event-buttons">
                        <button
                          className="reset-btn"
                          onClick={() => startEdit(ev)}
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => removeEvent(ev.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
export default Events;
