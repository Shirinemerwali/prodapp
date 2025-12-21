import { Link } from "react-router-dom";
import "../pages/Dashboard.css";

function Navbar({ user, onLogout }) {
  async function handleLogout() {
    await onLogout?.();
  }

  return (
    <nav className="app-navbar">
      <div className="nav-links">
        <Link to="/dashboard">Startsida</Link>
        <Link to="/todos">Ärenden</Link>
        <Link to="/events">Händelser</Link>
        <Link to="/habits">Rutiner</Link>
      </div>

      <div className="nav-user">
        {user?.name && <span style={{ opacity: 0.8 }}>Hej, {user.name}</span>}
        <button type="button" onClick={handleLogout}>
          Logga ut
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
