// Firebase initialization using CDN scripts
const firebaseConfig = {
    apiKey: "AIzaSyBQBBI_J_Ia7Bte76hHCb8CABBQ-Ym0TyYk",
    authDomain: "readandcompletegame.firebaseapp.com",
    databaseURL: "https://readandcompletegame-default-rtdb.firebaseio.com",
    projectId: "readandcompletegame",
    storageBucket: "readandcompletegame.firebasestorage.app",
    messagingSenderId: "258271166303",
    appId: "1:258271166303:web:822be022fb0eabd27800ea",
    measurementId: "G-Y1FFMJ6EN6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Authentication
function registerUser(email, password, displayName) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            database.ref('users/' + user.uid).set({ email, displayName, score: 0 });
            alert("Registration successful!");
        })
        .catch((error) => alert("Error: " + error.message));
}

function loginUser(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(() => alert("Login successful!"))
        .catch((error) => alert("Error: " + error.message));
}

function logoutUser() {
    auth.signOut()
        .then(() => alert("Logout successful!"))
        .catch((error) => alert("Error: " + error.message));
}

// Leaderboard
function fetchLeaderboard() {
    database.ref('users/').once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = Object.values(snapshot.val()).sort((a, b) => b.score - a.score);
                populateLeaderboard(data);
            }
        })
        .catch((error) => console.error("Error: " + error.message));
}

function populateLeaderboard(data) {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = "";
    data.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${user.displayName}: ${user.score}`;
        leaderboardList.appendChild(listItem);
    });
}

// Game
let passages = [];
function fetchQuestions() {
    fetch('database.json')
        .then((res) => res.json())
        .then((data) => passages = data.questions)
        .catch((err) => console.error(err));
}

function startGame() {
    if (!passages.length) return alert("No passages available.");
    // Reset the game state here
}

document.addEventListener("DOMContentLoaded", fetchQuestions);
