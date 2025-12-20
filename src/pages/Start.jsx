import { Link } from "react-router-dom";
import "./start.css";

function Start() {
  return (
    <div className="home_container">
      <div className="home_leftside">
        <img src="./home_pic.png" alt="Prodapp illustration" />
      </div>

      <div className="home_rightside">
      <h1>
  Välkommen till <span className="highlight">Prodapp</span>
</h1>
<p className="subtitle">
  Planera din vardag utan stress.
  Samla uppgifter, rutiner och events i en och samma app.
</p>
<p className="trust">
  Gratis att använda • Enkelt att komma igång!
</p>

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
