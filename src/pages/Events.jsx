import { useState } from "react";

function Events() {
  const [showForm, setShowForm] = useState(false);

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

            <input type="text" placeholder="Titel" />

            <textarea placeholder="Beskrivning (valfritt)" />

            <label>Start</label>
            <input type="datetime-local" />

            <label>Slut</label>
            <input type="datetime-local" />

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