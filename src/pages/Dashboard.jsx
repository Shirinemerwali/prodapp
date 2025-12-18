import { useNavigate } from "react-router-dom";
import { getHabits, getTodos } from "../utils/storage";
import { useEffect, useState } from "react";
import "./dashboard.css";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [habits, setHabits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dummy-data tills backend är klart

  const events = [
    { id: 1, title: "Möte med gruppen", date: "2025-12-12" },
    { id: 2, title: "Tenta", date: "2025-12-15" },
    { id: 3, title: "Julmiddag", date: "2025-12-20" },
    { id: 4, title: "Nyårsfest", date: "2025-12-31" },
  ];

  async function loadData() {
    setError("");
    setLoading(true);
    try {
      const data = await getTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Kunde inte ladda ärenden.");
    }
    try {
      const data = await getHabits();
      setHabits(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Kunde inte ladda vanor.");
    }finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="dashboard">
      <header>
        <h1>Välkommen tillbaka, {user.name}</h1>
      </header>

      <div className="dashboard-sections">

        {/* ✅ Sektion 1 – Ärenden */}
        <section className="dash-section">
          <h2>Senaste ej utförda ärenden</h2>
          <ul>
            {todos.map(todo => (
              <li key={todo.id}>{todo.title} - {!todo.done ? "ej utförd" : "slutförd"}</li>
            ))}
          </ul>
          <button onClick={() => navigate("/todos")}>Visa alla ärenden</button>
        </section>

        {/* ✅ Sektion 2 – Rutiner */}
        <section className="dash-section">
          <h2>Rutiner med flest repetitioner</h2>
          <ul>
            {habits.map(habit => (
              <li key={habit.id}>
                {habit.title} – {habit.reps} repetitioner
              </li>
            ))}
          </ul>
          <button onClick={() => navigate("/habits")}>Visa alla rutiner</button>
        </section>

        {/* ✅ Sektion 3 – Händelser */}
        <section className="dash-section">
          <h2>Nästkommande händelser</h2>
          <ul>
            {events.map(event => (
              <li key={event.id}>
                {event.title} – {event.date}
              </li>
            ))}
          </ul>
          <button onClick={() => navigate("/events")}>Visa alla händelser</button>
        </section>

      </div>
    </main>
  );
}