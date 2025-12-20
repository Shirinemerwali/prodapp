import { useNavigate } from "react-router-dom";
import { getHabits, getTodos, getEvents } from "../utils/storage";
import { useEffect, useState } from "react";
import "./dashboard.css";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [habits, setHabits] = useState([]);
  const [events, setEvents] = useState([]);

  let [quote, setQuote] = useState(null);

  async function fetchQuote() {
    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.error("Failed to fetch quote:", err);
    }
  }

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      if (!user?.id) {
        setTodos([]);
        setHabits([]);
        return;
      }

      try {
        let [t, h, e] = await Promise.all([
          getTodos(user.id, controller.signal),
          getHabits(user.id, controller.signal),
          getEvents(user.id, controller.signal),
        ]);

        e = e.sort((a, b) => new Date(a.start) - new Date(b.start));
        e.length = 3;

        t = t.filter((t) => !t.done);
        t.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
        t.length = 3;

        h = h.sort((a, b) => (b.reps ?? 0) - (a.reps ?? 0));
        h.length = 3;

        setEvents(e || []);
        setTodos(t || []);
        setHabits(h || []);
      } catch (err) {
        if (err?.name === "AbortError") return; // ✅ ignore abort
        console.error(err);
      }
    })();

    return () => controller.abort(); // ✅ cancels in-flight fetches on logout
  }, [user?.id]);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Välkommen tillbaka, {user.name}</h1>
        <h3>
          {quote ? `"${quote.quote}" – ${quote.author}` : "Laddar citat..."}
        </h3>
      </header>

      <div className="dashboard-sections">
        {/* ✅ Sektion 1 – Ärenden */}
        <section className="dash-section">
          <h2>Senaste ej utförda ärenden</h2>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.title} - {!todo.done ? "ej utförd" : "slutförd"}
              </li>
            ))}
          </ul>
          <button onClick={() => navigate("/todos")}>Visa alla ärenden</button>
        </section>

        {/* ✅ Sektion 2 – Rutiner */}
        <section className="dash-section">
          <h2>Rutiner med flest repetitioner</h2>
          <ul>
            {habits.map((habit) => (
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
            {events.map((event) => (
              <li key={event.id}>
                {event.title} – {new Date(event.start).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <button onClick={() => navigate("/events")}>
            Visa alla händelser
          </button>
        </section>
      </div>
    </main>
  );
}
