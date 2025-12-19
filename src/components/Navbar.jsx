import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout?.();
    navigate("/", { replace: true });
  }

  return (
    <nav className="app-navbar">
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/todos">Tasks</Link>
        <Link to="/habits">Habits</Link>
        <Link to="/events">Events</Link>
      </div>

      <div className="nav-user">
        {user?.name && <span>Hi, {user.name} 💛</span>}
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}

export default Navbar;
