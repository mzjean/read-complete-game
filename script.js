// Import Firebase using the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, get, update, child } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQBBiJ_Ia7Bte76hHCb8CABBQ-Ym0TyYk",
    authDomain: "readandcompletegame.firebaseapp.com",
    databaseURL: "https://readandcompletegame-default-rtdb.firebaseio.com",
    projectId: "readandcompletegame",
    storageBucket: "readandcompletegame.firebasestorage.app",
    messagingSenderId: "258271166303",
    appId: "1:258271166303:web:822be022fb0eabd27800ea",
    measurementId: "G-Y1FFMJ6EN6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// User Authentication
function registerUser(email, password, displayName) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            set(ref(database, 'users/' + user.uid), {
                email: email,
                displayName: displayName,
                score: 0
            });
            alert("User registered successfully!");
        })
        .catch((error) => {
            console.error("Error registering user:", error.message);
            alert("Registration failed: " + error.message);
        });
}

function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Login successful!");
        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
            alert("Login failed: " + error.message);
        });
}

function logoutUser() {
    signOut(auth)
        .then(() => {
            alert("User logged out successfully!");
        })
        .catch((error) => {
            console.error("Error logging out:", error.message);
        });
}

// Leaderboard Management
function fetchLeaderboard() {
    const leaderboardRef = ref(database, 'users/');
    get(leaderboardRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = Object.values(snapshot.val()).sort((a, b) => b.score - a.score);
                populateLeaderboard(data);
            } else {
                console.log("No leaderboard data found.");
            }
        })
        .catch((error) => {
            console.error("Error fetching leaderboard: " + error.message);
        });
}

function populateLeaderboard(data) {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = ""; // Clear existing entries
    data.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${user.displayName}: ${user.score}`;
        leaderboardList.appendChild(listItem);
    });
}

function saveScore(score) {
    if (currentUser) {
        update(ref(database, 'users/' + currentUser.uid), {
            score: score
        });
    }
}

// Game Logic
let passages = [];
let currentPassage = 0;
let score = 0;
let timeLeft = 180;
let timerInterval;

function fetchQuestions() {
    fetch('database.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            passages = data.questions;
        })
        .catch((error) => {
            console.error("Error fetching questions: " + error.message);
        });
}

function startGame() {
    if (passages.length === 0) {
        alert("No passages available. Please check the database.");
        return;
    }
    currentPassage = 0;
    score = 0;
    displayPassage();
    startTimer();
}

function displayPassage() {
    const passage = passages[currentPassage];
    document.getElementById("passage").textContent = passage.passage;
    document.getElementById("answer1").value = "";
    document.getElementById("answer2").value = "";
    document.getElementById("answer3").value = "";
}

function startTimer() {
    timeLeft = 180;
    document.getElementById("timer").textContent = `Time left: 3:00`;
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("timer").textContent = `Time left: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitAnswers();
        }
    }, 1000);
}

function submitAnswers() {
    const answer1 = document.getElementById("answer1").value.trim();
    const answer2 = document.getElementById("answer2").value.trim();
    const answer3 = document.getElementById("answer3").value.trim();
    const correctAnswers = passages[currentPassage].answers;

    let correctCount = 0;
    if (answer1.toLowerCase() === correctAnswers[0].toLowerCase()) correctCount++;
    if (answer2.toLowerCase() === correctAnswers[1].toLowerCase()) correctCount++;
    if (answer3.toLowerCase() === correctAnswers[2].toLowerCase()) correctCount++;

    score += correctCount;
    currentPassage++;

    if (currentPassage < passages.length) {
        displayPassage();
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);
    fetchLeaderboard();
    alert(`Game over! Your score: ${score}`);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchQuestions();
});
