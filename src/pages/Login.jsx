import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/storage";
import "./auth.css";

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const user = await Promise.resolve(login(identifier, password));
      onLogin?.(user);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Inloggningen misslyckades.");
    }
  }

  return (
    <div className="auth_container">
      <div className="auth_card">
        <h1>Logga in</h1>

        {error && <div className="auth_error">{error}</div>}

        <form className="auth_form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Lösenord"
            autoComplete="current-password"
            required
          />

          <button type="submit" className="auth_btn">
            Logga in
          </button>
        </form>

        <p className="auth_hint">
          Har du inget konto? <Link to="/signup">Skapa konto</Link>
        </p>

        <p className="auth_hint">
          <Link to="/">Till startsidan</Link>
        </p>
      </div>
    </div>
  );
}
