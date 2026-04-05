// ============================================================
// Shared Authentication & Firestore Helpers
// ============================================================

// Determine base path (works from root or subdirectories)
const AUTH_BASE_PATH = (function () {
  const path = window.location.pathname;
  if (path.includes("/fill-in-the-blanks/") || path.includes("/read-and-complete/")) {
    return "../";
  }
  return "./";
})();

// --- Auth State ---

function requireAuth() {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = AUTH_BASE_PATH + "login.html";
    } else {
      renderUserBar(user);
    }
  });
}

function getCurrentUser() {
  return auth.currentUser;
}

function renderUserBar(user) {
  // Remove existing bar if any
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
      <span class="user-bar-name">${sanitizeForBar(user.displayName || user.email)}</span>
      <button onclick="logoutUser()" class="user-bar-logout">Logout</button>
    </div>
  `;
  document.body.prepend(bar);
}

function sanitizeForBar(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function logoutUser() {
  await auth.signOut();
  window.location.href = AUTH_BASE_PATH + "login.html";
}

// --- Firestore: Save Game Result ---

async function saveGameResult({ gameType, passageTitle, passageIndex, correctCount, totalCount, percentage, wrongAnswers }) {
  const user = getCurrentUser();
  if (!user) return;

  const result = {
    userId: user.uid,
    displayName: user.displayName || user.email,
    gameType,
    passageTitle,
    passageIndex,
    correctCount,
    totalCount,
    percentage,
    wrongAnswers, // Array of { blankIndex, userAnswer, correctAnswers }
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  await db.collection("gameResults").add(result);
  await updateLeaderboard(user, gameType, percentage);
}

// --- Firestore: Update Leaderboard ---

async function updateLeaderboard(user, gameType, percentage) {
  const ref = db.collection("leaderboard").doc(user.uid);
  const doc = await ref.get();

  if (doc.exists) {
    const data = doc.data();
    const field = gameType === "fitb" ? "fitb" : "readComplete";
    const scores = data[field] || [];
    scores.push(percentage);

    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    const allScores = {
      fitb: data.fitb || [],
      readComplete: data.readComplete || []
    };
    allScores[field] = scores;
    const allFlat = [...allScores.fitb, ...allScores.readComplete];
    const overallAvg = Math.round(allFlat.reduce((a, b) => a + b, 0) / allFlat.length);

    await ref.update({
      [field]: scores,
      [`${field}Avg`]: avg,
      overallAvg,
      displayName: user.displayName || user.email,
      totalGames: (data.totalGames || 0) + 1,
      lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
    });
  } else {
    const field = gameType === "fitb" ? "fitb" : "readComplete";
    await ref.set({
      userId: user.uid,
      displayName: user.displayName || user.email,
      fitb: field === "fitb" ? [percentage] : [],
      readComplete: field === "readComplete" ? [percentage] : [],
      fitbAvg: field === "fitb" ? percentage : 0,
      readCompleteAvg: field === "readComplete" ? percentage : 0,
      overallAvg: percentage,
      totalGames: 1,
      lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

// --- Firestore: Get User Results ---

async function getUserResults() {
  const user = getCurrentUser();
  if (!user) return [];

  const snapshot = await db.collection("gameResults")
    .where("userId", "==", user.uid)
    .orderBy("timestamp", "desc")
    .limit(100)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// --- Firestore: Get Leaderboard ---

async function getLeaderboard() {
  const snapshot = await db.collection("leaderboard")
    .orderBy("overallAvg", "desc")
    .limit(50)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
