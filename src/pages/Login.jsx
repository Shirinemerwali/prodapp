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
      // login is sync in our storage.js, but awaiting is fine too
      const user = await Promise.resolve(login(identifier, password));

      // ✅ update App state
      onLogin?.(user);

      // ✅ go to dashboard immediately
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Inloggningen misslyckades.");
      console.error(err);
    }
  }

  return (
    <div className="auth_container">
      <div className="auth_card">
        <h1>Logga in</h1>

        <form onSubmit={handleSubmit}>
          <input
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

          {error && <p className="auth_error">{error}</p>}

          <button type="submit" className="auth_btn">Logga in</button>
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
