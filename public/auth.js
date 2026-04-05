// ============================================================
// Client-side Auth & API Helpers
// ============================================================

const AUTH_BASE_PATH = (function () {
  const path = window.location.pathname;
  if (path.includes("/fill-in-the-blanks/") || path.includes("/read-and-complete/")) {
    return "../";
  }
  return "./";
})();

const API_BASE = "/api";

// --- Token management ---

function getToken() {
  return localStorage.getItem("det_token");
}

function setToken(token) {
  localStorage.setItem("det_token", token);
}

function clearToken() {
  localStorage.removeItem("det_token");
  localStorage.removeItem("det_user");
}

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("det_user"));
  } catch {
    return null;
  }
}

function setSavedUser(user) {
  localStorage.setItem("det_user", JSON.stringify(user));
}

// --- API helper ---

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = "Bearer " + token;

  const res = await fetch(API_BASE + endpoint, { ...options, headers });
  const data = await res.json();

  if (res.status === 401) {
    clearToken();
    window.location.href = AUTH_BASE_PATH + "login.html";
    throw new Error("Not logged in");
  }
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// --- Auth state ---

async function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = AUTH_BASE_PATH + "login.html";
    return;
  }

  try {
    const data = await apiFetch("/auth/me");
    setSavedUser(data.user);
    renderUserBar(data.user);
  } catch {
    clearToken();
    window.location.href = AUTH_BASE_PATH + "login.html";
  }
}

function renderUserBar(user) {
  const existing = document.getElementById("user-bar");
  if (existing) existing.remove();

  const bar = document.createElement("div");
  bar.id = "user-bar";
  bar.innerHTML = `
    <div class="user-bar-left">
      <a href="${AUTH_BASE_PATH}index.html">Home</a>
      <a href="${AUTH_BASE_PATH}my-results.html">My Results</a>
      <a href="${AUTH_BASE_PATH}leaderboard.html">Leaderboard</a>
    </div>
    <div class="user-bar-right">
      <span class="user-bar-name">${escapeHtml(user.name)}</span>
      <button onclick="logoutUser()" class="user-bar-logout">Logout</button>
    </div>
  `;
  document.body.prepend(bar);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function logoutUser() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch { /* ignore */ }
  clearToken();
  window.location.href = AUTH_BASE_PATH + "login.html";
}

// --- Game results ---

async function saveGameResult({ gameType, passageTitle, passageIndex, correctCount, totalCount, percentage, wrongAnswers }) {
  return apiFetch("/results", {
    method: "POST",
    body: JSON.stringify({ gameType, passageTitle, passageIndex, correctCount, totalCount, percentage, wrongAnswers })
  });
}

async function getUserResults() {
  return apiFetch("/results");
}

async function getLeaderboard() {
  return apiFetch("/leaderboard");
}
