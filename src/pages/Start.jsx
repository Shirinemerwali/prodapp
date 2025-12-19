import { Link } from "react-router-dom";
import "./start.css";

function Start() {
  return (
    <div className="home_container">
      <div className="home_leftside">
        <img src="./home_pic.png" alt="Prodapp illustration" />
      </div>

      <div className="home_rightside">
        <h1>Välkommen till <span className="highlight">Prodapp</span></h1>
        <p>Allt du behöver för att hålla koll på vardagen. Logga in eller registrera dig för att fortsätta.</p>
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
