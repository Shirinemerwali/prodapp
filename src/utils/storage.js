const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5174";
const CURRENT_USER_KEY = "currentUser";

export async function login(identifier, password) {
  const res = await fetch(`/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Login failed");
  }

  const user = await res.json();
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export async function signup({ name, email, password }) {
  const res = await fetch(`/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Signup failed");
  }

  const user = await res.json();
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export async function getCurrentUser() {
  const res = await fetch(`api/me`, {
    credentials: "include",
  });

  if (!res.ok) return null;
  return await res.json();
}

export async function logout() {
  await fetch(`api//logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getHabits() {
  const res = await fetch(`api/habits`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to load habits");
  return await res.json();
}

export async function createHabit({ title, priority }) {
  const res = await fetch(`api/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, priority }),
  });

  if (!res.ok) throw new Error("Failed to create habit");
  return await res.json();
}

export async function updateHabit(id, updates) {
  const res = await fetch(`api/habits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Failed to update habit");
  return await res.json();
}

export async function deleteHabit(id) {
  const res = await fetch(`api/habits/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete habit");
}
