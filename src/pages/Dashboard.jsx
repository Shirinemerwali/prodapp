import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  // Dummy-data tills backend är klart
  const todos = [
    { id: 1, title: "Köp mjölk", done: false },
    { id: 2, title: "Skicka mail till läraren", done: false },
    { id: 3, title: "Städa rummet", done: false },
    { id: 4, title: "Plugga React", done: true },
  ];

  const habits = [
    { id: 1, name: "Dricka vatten", repetitions: 12 },
    { id: 2, name: "Träna", repetitions: 8 },
    { id: 3, name: "Meditera", repetitions: 5 },
    { id: 4, name: "Läsa bok", repetitions: 3 },
  ];

  const events = [
    { id: 1, title: "Möte med gruppen", date: "2025-12-12" },
    { id: 2, title: "Tenta", date: "2025-12-15" },
    { id: 3, title: "Julmiddag", date: "2025-12-20" },
    { id: 4, title: "Nyårsfest", date: "2025-12-31" },
  ];

  return (
    <main className="dashboard">
      <header>
        <h1>Välkommen tillbaka, user.name</h1>
      </header>

      <div className="dashboard-sections">

        {/* ✅ Sektion 1 – Ärenden */}
        <section className="dash-section">
          <h2>Senaste ej utförda ärenden</h2>
          <ul>
            {todos.map(todo => (
              <li key={todo.id}>{todo.title}</li>
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
                {habit.name} – {habit.repetitions} repetitioner
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