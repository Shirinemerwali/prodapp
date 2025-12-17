import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../utils/storage";
import "./auth.css";

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const user = await Promise.resolve(signup({ name, email, password }));

      // ✅ update App state
      onLogin?.(user);

      // ✅ go to dashboard immediately
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Registreringen misslyckades.");
      console.error(err);
    }
  }

  return (
    <div className="auth_container">
      <div className="auth_card">
        <h1>Skapa konto</h1>

        <form onSubmit={handleSubmit} className="auth_form">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Namn"
            autoComplete="name"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Lösenord"
            autoComplete="new-password"
            minLength={4}
            required
          />

          {error && <p className="auth_error">{error}</p>}

          <button type="submit" className="auth_btn">Registrera</button>
        </form>

        <p className="auth_hint">
          Har du redan konto? <Link to="/login">Logga in</Link>
        </p>
        <p className="auth_hint">
          <Link to="/">Till startsidan</Link>
        </p>
      </div>
    </div>
  );
}
