const USERS_KEY = "newsapp:users";
const SESSION_KEY = "newsapp:session";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

export function getCurrentUser() {
  return readJson(SESSION_KEY, null);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  return true;
}

export function register({ name, email, password }) {
  const users = readJson(USERS_KEY, []);
  const safeEmail = normalizeEmail(email);

  if (!name?.trim()) throw new Error("Name is required.");
  if (!safeEmail) throw new Error("Email is required.");
  if (!password || password.length < 6) throw new Error("Password must be at least 6 characters.");

  const exists = users.some((u) => normalizeEmail(u.email) === safeEmail);
  if (exists) throw new Error("Email is already registered.");

  // For demo only — password stored in plain text (NOT for production)
  const newUser = {
    id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: name.trim(),
    email: safeEmail,
    createdAt: new Date().toISOString()
  };

  users.unshift({ ...newUser, password });
  writeJson(USERS_KEY, users);

  // auto-login after register
  writeJson(SESSION_KEY, newUser);
  return newUser;
}

export function login({ email, password }) {
  const users = readJson(USERS_KEY, []);
  const safeEmail = normalizeEmail(email);

  if (!safeEmail) throw new Error("Email is required.");
  if (!password) throw new Error("Password is required.");

  const match = users.find((u) => normalizeEmail(u.email) === safeEmail && u.password === password);
  if (!match) throw new Error("Invalid email or password.");

  const sessionUser = { id: match.id, name: match.name, email: match.email };
  writeJson(SESSION_KEY, sessionUser);
  return sessionUser;
}