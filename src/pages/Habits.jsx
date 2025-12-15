import { useState } from "react";
import "./habits.css";

function Habits() {
  const [showForm, setShowForm] = useState(false);

  // Dummy-renderad lista – ni byter till riktig state sen
  const dummyHabits = [
    { title: "Dricka vatten", reps: 12, priority: "Låg" },
    { title: "Träna", reps: 8, priority: "Hög" },
    { title: "Meditera", reps: 5, priority: "Mellan" },
    { title: "Läsa bok", reps: 3, priority: "Låg" },
  ];

  return (
    <div className="habits-wrapper">

      <div className="habits-container">

        <h1 className="habits-title">Mina Vanor</h1>

        <div className="filter-sort-bar">
          <select>
            <option value="">Filtrera prioritet</option>
            <option value="Låg">Låg</option>
            <option value="Mellan">Mellan</option>
            <option value="Hög">Hög</option>
          </select>

          <select>
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

            <input type="text" placeholder="Titel (t.ex. Träna)" />

            <input type="number" placeholder="Repetitioner (0-...)" />

            <select>
              <option value="">Prioritet</option>
              <option value="Låg">Låg</option>
              <option value="Mellan">Mellan</option>
              <option value="Hög">Hög</option>
            </select>

            <button className="submit-btn">Lägg till vana</button>
          </div>
        )}

        <div className="habit-list">
          {dummyHabits.map((habit, i) => (
            <div className="habit-card" key={i}>

              <div className="habit-info">
                <h3>{habit.title}</h3>
                <p className="habit-detail">Repetitioner: {habit.reps}</p>
                <p className="habit-detail">Prioritet: {habit.priority}</p>
              </div>

              <div className="habit-buttons">
                <button className="minus-btn">–</button>
                <button className="plus-btn">+</button>
                <button className="reset-btn">↺</button>
                <button className="delete-btn">🗑</button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Habits;