import { useState } from "react";
import "./events.css";

function Events() {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // ---------------------------------------------------
  // Load events
  // ---------------------------------------------------
  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/events", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
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
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          description: desc.trim(),
          start,
          end,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const newEvent = await res.json();
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
    setEditingId(ev.id);
    setEditTitle(ev.title);
    setEditDesc(ev.description || "");
    setEditStart(ev.start);
    setEditEnd(ev.end);
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
      const res = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDesc.trim(),
          start: editStart,
          end: editEnd,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
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
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
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

        <div className="filter-sort-bar">
          <select>
            <option value="">Alla</option>
            <option value="upcoming">Kommande</option>
            <option value="past">Tidigare</option>
          </select>
        </div>

        <button
          className="toggle-form-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Stäng formulär" : "Lägg till ny händelse"}
        </button>

        {showForm && (
          <div className="event-form">
            <h2>Ny händelse</h2>

            <input
              type="text"
              placeholder="Titel"
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

            <button className="submit-btn">Spara händelse</button>
          </div>
        )}

        <div className="event-list">
          <p>Inga händelser att visa ännu…</p>
        </div>
      </div>
    </div>
  );
}

export default Events;
