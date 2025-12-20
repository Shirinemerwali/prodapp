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

  const emailIsValid = (value) => {
    // Lightweight validation: relies on browser validation too
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  };

  const passwordIsValid = (value) => {
    const v = String(value || "");
    // At least 8 chars, contains at least one Unicode letter and one Unicode number
    return (
      v.length >= 8 &&
      /\p{L}/u.test(v) &&
      /\p{N}/u.test(v)
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!emailIsValid(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!passwordIsValid(password)) {
      setError("Password must be at least 8 characters and include both letters and numbers");
      return;
    }

    try {
      const user = await Promise.resolve(signup({ name, email, password }));

      // ✅ update App state
      onLogin?.(user);

      // ✅ go to dashboard immediately
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = String(err?.message || "");
      if (msg.toLowerCase().includes("email already") || msg.toLowerCase().includes("exists")) {
        setError("Email is already in use");
      } else {
        setError("Registreringen misslyckades.");
      }
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
            type="email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Lösenord"
            autoComplete="new-password"
            minLength={8}
            pattern="^(?=.*\\p{L})(?=.*\\p{N}).{8,}$"
            title="Password must be at least 8 characters and include both letters and numbers"
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
