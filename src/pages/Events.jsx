import { useState } from "react";
import "./events.css";


function Events() {
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <div className="events-wrapper events">
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
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />

            <label>Slut</label>
            <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />

            <button className="submit-btn">
              Spara händelse
            </button>
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