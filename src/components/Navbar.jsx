import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
      <Link to="/">Home</Link>
      <Link to="/todos">Todos</Link>
      <Link to="/habits">Habits</Link>
      <Link to="/events">Events</Link>
    </nav>
  );
}

export default Navbar;

