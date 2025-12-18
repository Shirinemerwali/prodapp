// src/utils/storage.js
// Centralized API helpers + CRUD functions for Habits & Todos (and simple auth).
// Uses Vite proxy if configured; otherwise set VITE_API_BASE (e.g. http://localhost:3000).

const API_BASE = import.meta.env.VITE_API_BASE || "";

const USER_KEY = "user";

export function setStoredUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn() {
  return Boolean(getStoredUser());
}

function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

async function apiRequest(path, options = {}) {
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    ...options,
    signal: options.signal, // ✅ important
    headers: { ...(options.headers || {}) },
  });

  // ✅ handle auth state cleanly
  if (res.status === 401) return null;

  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    let details = "";
    if (ct.includes("application/json")) {
      const err = await res.json().catch(() => ({}));
      details = err?.error || err?.message || "";
    } else {
      details = await res.text().catch(() => "");
    }
    throw new Error(details || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

/* -----------------------------
   Auth (if your backend supports these routes)
----------------------------- */
export async function login(identifier, password) {
  return await apiRequest("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
}

export async function signup({ name, email, password }) {
  return await apiRequest("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getCurrentUser() {
  return null; // no session-based auth in this project
}

export async function logout() {
  try {
    await apiRequest("/api/logout", { method: "POST" });
    setStoredUser(null);
  } catch {
    // ignore
  }
}

/* -----------------------------
   Habits CRUD
----------------------------- */
export async function getHabits(userId, signal) {
  const qs = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return await apiRequest(`/api/habits${qs}`, { signal });
}

export async function createHabit({ title, priority }) {
  return await apiRequest("/api/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, priority }),
  });
}

export async function updateHabit(id, updates) {
  return await apiRequest(`/api/habits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function deleteHabit(id) {
  await apiRequest(`/api/habits/${id}`, { method: "DELETE" });
  return true;
}

/* -----------------------------
   Todos CRUD
----------------------------- */
export const TODO_CATEGORIES = ["Hälsa", "Hushåll", "Jobb", "Nöje", "Studier", "Övrigt"];

export async function getTodos(userId, signal) {
  const qs = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return await apiRequest(`/api/todos${qs}`, { signal });
}

export async function createTodo({ title, description, done, estimate, category, deadline }) {
  return await apiRequest("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      done: Boolean(done),
      estimate:
        estimate === "" || estimate === null || estimate === undefined
          ? 0
          : Number(estimate),
      category,
      deadline,
    }),
  });
}

export async function updateTodo(id, updates) {
  return await apiRequest(`/api/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function deleteTodo(id) {
  await apiRequest(`/api/todos/${id}`, { method: "DELETE" });
  return true;
}
