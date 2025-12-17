import { Link } from "react-router-dom";
import "./start.css";

function Start() {
  return (
    <div className="home_container">
      <div className="home_leftside">
        <img src="./home_pic.png" alt="Prodapp illustration" />
      </div>

      <div className="home_rightside">
        <h1>Välkommen!</h1>
        <p>Logga in för att komma till din dashboard.</p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link className="btn btn-primary" to="/login">
            Logga in
          </Link>
          <Link className="btn btn-outline" to="/signup">
            Skapa konto
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Start;
