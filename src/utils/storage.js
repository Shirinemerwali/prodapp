const USERS_URL = "/data/users.db";
const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

async function fetchJson(url, defaultValue) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch " + url);
        return await response.json();
    } catch (error) {
        console.error(error);
        return defaultValue;
    }
}

function readJson(key, defaultValue) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return defaultValue;

        const parsed = JSON.parse(raw);
        return parsed ?? defaultValue;
    } catch (error) {
        console.error(`Error reading "${key}" from localStorage:`, error);
        return defaultValue;
    }
}

function writeJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing "${key}" to localStorage:`, error);
    }
}

async function ensureUsersInitialized() {
    const existing = localStorage.getItem(USERS_KEY);
    if (existing) {
        return readJson(USERS_KEY, []);
    }

    const usersFromFile = await fetchJson(USERS_URL, []);
    writeJson(USERS_KEY, usersFromFile);
    return usersFromFile;
}

export async function getUsers() {
    return ensureUsersInitialized();
}

export function saveUsers(users) {
    writeJson(USERS_KEY, users);
}

export function getCurrentUser() {
    return readJson(CURRENT_USER_KEY, null);
}

export function setCurrentUser(user) {
    if (!user) {
        localStorage.removeItem(CURRENT_USER_KEY);
    } else {
        writeJson(CURRENT_USER_KEY, user);
    }
}

export function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
}




