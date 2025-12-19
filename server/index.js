import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";
import session from "express-session";

const app = express();
app.use(express.json());

/**
 * If you use a Vite proxy (recommended), you can remove cors() entirely.
 * If you DO NOT use a proxy, keep the cors() below (credentials true).
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    name: "sid",
    secret: "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

const USERS_DB_PATH = path.join(process.cwd(), "data", "users.db");
const HABITS_DB_PATH = path.join(process.cwd(), "data", "habits.db");
const TODOS_DB_PATH = path.join(process.cwd(), "data", "todos.db");
const EVENTS_DB_PATH = path.join(process.cwd(), "data", "events.db");

async function readJsonArray(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJsonArray(filePath, arr) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(arr, null, 2), "utf-8");
}

function safeUser(user) {
  const u = { ...user };
  delete u.password;
  return u;
}

function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

// ---- AUTH ----

app.get("/api/me", async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const users = await readJsonArray(USERS_DB_PATH);
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  res.json(safeUser(user));
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  const users = await readJsonArray(USERS_DB_PATH);
  const e = String(email).trim().toLowerCase();

  if (users.some((u) => String(u.email || "").toLowerCase() === e)) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const newUser = { id: Date.now(), name, email: e, password };
  users.push(newUser);
  await writeJsonArray(USERS_DB_PATH, users);

  req.session.userId = newUser.id; // ✅ session set here
  res.status(201).json(safeUser(newUser));
});

app.post("/api/login", async (req, res) => {
  const { identifier, password } = req.body || {};
  const users = await readJsonArray(USERS_DB_PATH);

  const id = String(identifier || "").trim().toLowerCase();
  const user = users.find((u) => {
    const email = String(u.email || "").toLowerCase();
    const username = String(u.username || "").toLowerCase();
    return (email === id || username === id) && u.password === password;
  });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  req.session.userId = user.id; // ✅ session set here
  res.json(safeUser(user));
});

// ---- HABITS (scoped to session user) ----

app.get("/api/habits", requireAuth, async (req, res) => {
  const habits = await readJsonArray(HABITS_DB_PATH);
  const userHabits = habits.filter((h) => h.userId === req.session.userId);
  res.json(userHabits);
});

app.post("/api/habits", requireAuth, async (req, res) => {
  const { title, priority } = req.body || {};
  if (!title) return res.status(400).json({ error: "Missing title" });

  const habits = await readJsonArray(HABITS_DB_PATH);

  const newHabit = {
    id: Date.now(),
    userId: req.session.userId,
    title: String(title).trim(),
    priority: priority || "Låg",
    reps: 0,
  };

  habits.push(newHabit);
  await writeJsonArray(HABITS_DB_PATH, habits);

  res.status(201).json(newHabit);
});

app.patch("/api/habits/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const updates = req.body || {};

  const habits = await readJsonArray(HABITS_DB_PATH);
  const idx = habits.findIndex((h) => h.id === id && h.userId === req.session.userId);
  if (idx === -1) return res.status(404).json({ error: "Habit not found" });

  habits[idx] = {
    ...habits[idx],
    ...updates,
    id: habits[idx].id,
    userId: habits[idx].userId,
  };

  await writeJsonArray(HABITS_DB_PATH, habits);
  res.json(habits[idx]);
});

app.delete("/api/habits/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  const habits = await readJsonArray(HABITS_DB_PATH);
  const before = habits.length;
  const next = habits.filter((h) => !(h.id === id && h.userId === req.session.userId));

  if (next.length === before) return res.status(404).json({ error: "Habit not found" });

  await writeJsonArray(HABITS_DB_PATH, next);
  res.json({ ok: true });
});

/* -----------------------------
   TODOS
----------------------------- */

app.get("/api/todos", requireAuth, async (req, res) => {
  const todos = await readJsonArray(TODOS_DB_PATH);
  const userTodos = todos.filter((t) => t.userId === req.session.userId);
  res.json(userTodos);
});

app.post("/api/todos", requireAuth, async (req, res) => {
  const { title, description, done, estimate, category, deadline } = req.body || {};
  if (!title || !category || !deadline) {
    return res.status(400).json({
      error: "Title, category and deadline are required",
    });
  }

  const todos = await readJsonArray(TODOS_DB_PATH);

  const newTodo = {
    id: Date.now(),
    userId: req.session.userId,
    title: String(title).trim(),
    description: description || "No description",
    done: done || false,
    estimate: estimate || 0,
    category: category || "General",
    deadline: deadline || null,
    createdAt: Date.now(),
  };

  todos.push(newTodo);
  await writeJsonArray(TODOS_DB_PATH, todos);

  res.status(201).json(newTodo);
});

app.patch("/api/todos/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const updates = req.body || {};

  const todos = await readJsonArray(TODOS_DB_PATH);
  const idx = todos.findIndex((t) => t.id === id && t.userId === req.session.userId);
  if (idx === -1) return res.status(404).json({ error: "Todo not found" });

  todos[idx] = {
    ...todos[idx],
    ...updates,
    id: todos[idx].id,
    userId: todos[idx].userId,
  };

  await writeJsonArray(TODOS_DB_PATH, todos);
  res.json(todos[idx]);
});

app.delete("/api/todos/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  const todos = await readJsonArray(TODOS_DB_PATH);
  const before = todos.length;
  const next = todos.filter((t) => !(t.id === id && t.userId === req.session.userId));

  if (next.length === before) return res.status(404).json({ error: "Todo not found" });

  await writeJsonArray(TODOS_DB_PATH, next);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
