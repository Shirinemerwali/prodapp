import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(process.cwd(), "data", "users.db");

async function readUsers() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
}

app.get("/api/users", async (_req, res) => {
  const users = await readUsers();
  res.json(users.map(u => ({ ...u, password: undefined }))); // hide passwords in response
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  const users = await readUsers();
  const e = String(email).trim().toLowerCase();

  if (users.some(u => String(u.email || "").toLowerCase() === e)) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const newUser = { id: Date.now(), name, email: e, password };
  users.push(newUser);
  await writeUsers(users);

  const safeUser = { ...newUser };
  delete safeUser.password;

  res.status(201).json(safeUser);
});

app.post("/api/login", async (req, res) => {
  const { identifier, password } = req.body || {};
  const users = await readUsers();
  const id = String(identifier || "").trim().toLowerCase();

  const user = users.find(u => {
    const email = String(u.email || "").toLowerCase();
    const username = String(u.username || "").toLowerCase();
    return (email === id || username === id) && u.password === password;
  });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const safeUser = { ...user };
  delete safeUser.password;

  res.json(safeUser);
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
