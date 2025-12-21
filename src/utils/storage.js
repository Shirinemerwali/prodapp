// src/utils/storage.js
// Centralized API helpers + CRUD functions for Habits & Todos (and simple auth).
// Uses Vite proxy if configured; otherwise set VITE_API_BASE (e.g. http://localhost:3000).

const API_BASE = import.meta.env.VITE_API_BASE || "";

function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

async function apiRequest(path, options = {}, allow401 = false) {
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    ...options,
    headers: { ...(options.headers || {}) },
  });

  if (res.status === 401 && allow401) return null;

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      message = data?.error || data?.message || message;
    } catch {}
    throw new Error(message);
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
  return apiRequest("/api/me", {}, true); 
}

export async function logout() {
  await apiRequest("/api/logout", { method: "POST" });
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
      createdAt: Date.now(),
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


/* -----------------------------
   Events CRUD
----------------------------- */

export async function getEvents(signal) {
  return apiRequest("/api/events", { signal });
}

export async function createEvent({ title, description, start, end }) {
  return await apiRequest("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, start, end }),
  });
}

export async function updateEvent(id, updates) {
  return await apiRequest(`/api/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function deleteEvent(id) {
  await apiRequest(`/api/events/${id}`, { method: "DELETE" });
  return true;
}