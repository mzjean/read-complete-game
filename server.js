const express = require("express");
const Database = require("better-sqlite3");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database setup ---
const db = new Database(process.env.DB_PATH || "det_practice.db");
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS game_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    game_type TEXT NOT NULL,
    passage_title TEXT,
    passage_index INTEGER,
    correct_count INTEGER NOT NULL,
    total_count INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    wrong_answers TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Prepared statements
const stmts = {
  findUserByEmail: db.prepare("SELECT * FROM users WHERE email = ?"),
  createUser: db.prepare("INSERT INTO users (email, name) VALUES (?, ?)"),
  updateUserName: db.prepare("UPDATE users SET name = ? WHERE id = ?"),
  createSession: db.prepare("INSERT INTO sessions (token, user_id) VALUES (?, ?)"),
  findSession: db.prepare(`
    SELECT sessions.token, sessions.user_id, users.id, users.email, users.name
    FROM sessions JOIN users ON sessions.user_id = users.id
    WHERE sessions.token = ?
  `),
  deleteSession: db.prepare("DELETE FROM sessions WHERE token = ?"),
  saveResult: db.prepare(`
    INSERT INTO game_results (user_id, game_type, passage_title, passage_index, correct_count, total_count, percentage, wrong_answers)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  getUserResults: db.prepare(`
    SELECT * FROM game_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 200
  `),
  getLeaderboard: db.prepare(`
    SELECT
      users.name AS display_name,
      users.id AS user_id,
      COUNT(*) AS total_games,
      ROUND(AVG(percentage)) AS overall_avg,
      ROUND(AVG(CASE WHEN game_type = 'fitb' THEN percentage END)) AS fitb_avg,
      ROUND(AVG(CASE WHEN game_type = 'readComplete' THEN percentage END)) AS read_complete_avg,
      MAX(game_results.created_at) AS last_played
    FROM game_results
    JOIN users ON game_results.user_id = users.id
    GROUP BY users.id
    ORDER BY overall_avg DESC
    LIMIT 50
  `)
};

// --- Middleware ---
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function getUser(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  return stmts.findSession.get(token) || null;
}

function requireAuth(req, res, next) {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: "Not logged in" });
  req.user = user;
  next();
}

// --- Auth Routes ---

// Register or login (passwordless: just email + name)
app.post("/api/auth/login", (req, res) => {
  const { email, name } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  let user = stmts.findUserByEmail.get(email.trim().toLowerCase());

  if (!user) {
    // New user - name is required
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required for new students", needsName: true });
    }
    const result = stmts.createUser.run(email.trim().toLowerCase(), name.trim());
    user = { id: result.lastInsertRowid, email: email.trim().toLowerCase(), name: name.trim() };
  }

  // Create session token
  const token = crypto.randomBytes(32).toString("hex");
  stmts.createSession.run(token, user.id);

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

// Get current user
app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({
    user: { id: req.user.user_id, email: req.user.email, name: req.user.name }
  });
});

// Update name
app.put("/api/auth/me", requireAuth, (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  stmts.updateUserName.run(name.trim(), req.user.user_id);
  res.json({ user: { id: req.user.user_id, email: req.user.email, name: name.trim() } });
});

// Logout
app.post("/api/auth/logout", requireAuth, (req, res) => {
  stmts.deleteSession.run(req.headers.authorization.replace("Bearer ", ""));
  res.json({ ok: true });
});

// --- Game Results Routes ---

// Save a game result
app.post("/api/results", requireAuth, (req, res) => {
  const { gameType, passageTitle, passageIndex, correctCount, totalCount, percentage, wrongAnswers } = req.body;

  if (!gameType || correctCount == null || totalCount == null || percentage == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  stmts.saveResult.run(
    req.user.user_id,
    gameType,
    passageTitle || null,
    passageIndex ?? null,
    correctCount,
    totalCount,
    percentage,
    JSON.stringify(wrongAnswers || [])
  );

  res.json({ ok: true });
});

// Get my results
app.get("/api/results", requireAuth, (req, res) => {
  const results = stmts.getUserResults.all(req.user.user_id);
  res.json(results.map((r) => ({
    ...r,
    wrong_answers: JSON.parse(r.wrong_answers || "[]")
  })));
});

// --- Leaderboard ---

app.get("/api/leaderboard", requireAuth, (req, res) => {
  const entries = stmts.getLeaderboard.all();
  res.json(entries);
});

// --- Fallback to index.html for SPA-like routing ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`DET Practice App running on http://localhost:${PORT}`);
});
