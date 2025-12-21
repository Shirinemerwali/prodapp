import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  async function handleLogout() {
    await onLogout?.(); 
  }

  return (
    <nav style={{ padding: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/todos">Todos</Link>
      <Link to="/habits">Habits</Link>
      <Link to="/events">Events</Link>

      <div style={{ marginLeft: "auto", display: "flex", gap: "1rem", alignItems: "center" }}>
        {user?.name && <span style={{ opacity: 0.8 }}>Hej, {user.name}</span>}
        <button type="button" onClick={handleLogout}>
          Logga ut
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

