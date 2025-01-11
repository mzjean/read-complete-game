// Import Firebase dependencies
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

// Initialize Firebase
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
            currentUser = user;
            switchToGame();
        })
        .catch((error) => {
            console.error("Error registering user:", error.message);
            alert("Error: " + error.message);
        });
}

function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Welcome back!");
            currentUser = user;
            switchToGame();
        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
            alert("Error: " + error.message);
        });
}

function logoutUser() {
    signOut(auth)
        .then(() => {
            alert("You have logged out.");
            currentUser = null;
            switchToLogin();
        })
        .catch((error) => {
            console.error("Error logging out:", error.message);
            alert("Error: " + error.message);
        });
}

// Leaderboard
function fetchLeaderboard() {
    const leaderboardRef = ref(database, 'users/');
    get(leaderboardRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const sortedLeaderboard = Object.values(data).sort((a, b) => b.score - a.score);
                populateLeaderboard(sortedLeaderboard);
            } else {
                console.log("No leaderboard data available.");
            }
        })
        .catch((error) => {
            console.error("Error fetching leaderboard:", error.message);
        });
}

function saveScore(score) {
    if (currentUser) {
        update(ref(database, 'users/' + currentUser.uid), {
            score: score
        });
    }
}

// Global Variables
let passages = [];
let currentPassage = 0;
let score = 0;
let timeLeft = 180; // 3 minutes
let timerInterval; // To store the timer interval
let completedPassages = 0;
let currentUser = null;

// Fetch Questions from `database.json`
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
            console.log("Passages fetched from database file:", passages);
        })
        .catch((error) => {
            console.error("Error fetching questions from database file:", error);
            alert("Error fetching passages. Please try again later.");
        });
}

// Populate Leaderboard
function populateLeaderboard(data) {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = ""; // Clear existing entries
    data.forEach((entry) => {
        const listItem = document.createElement("li");
        listItem.innerText = `${entry.displayName}: ${entry.score} points`;
        leaderboardList.appendChild(listItem);
    });
}

// Game and Timer Logic
function startGame() {
    if (passages.length === 0) {
        alert("No passages available. Please check the database.");
        return;
    }
    currentPassage = 0;
    score = 0;
    completedPassages = 0;
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("game-container").style.display = "block";
    document.getElementById("start-button").style.display = "none";
    document.getElementById("end-summary").style.display = "none";
    displayPassage();
    startTimer();
}

function displayPassage() {
    if (currentPassage >= passages.length) {
        endGame();
        return;
    }

    const passage = passages[currentPassage];
    document.getElementById("answer1").value = "";
    document.getElementById("answer2").value = "";
    document.getElementById("answer3").value = "";
    document.getElementById("passage").innerText = passage.passage;
}

function startTimer() {
    timeLeft = 180; // Reset to 3 minutes
    document.getElementById("timer").innerText = `Time left: 3:00`;

    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("timer").innerText = `Time left: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitAnswers(); // Auto-submit when time is up
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
    completedPassages++;
    document.getElementById("score").innerText = `Score: ${score}`;

    if (currentPassage < passages.length - 1) {
        currentPassage++;
        displayPassage();
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById("game-container").style.display = "none";
    document.getElementById("end-summary").style.display = "block";
    document.getElementById("final-score").innerText = `Final Score: ${score}`;
    document.getElementById("passages-completed").innerText = `Passages Completed: ${completedPassages}`;
    fetchLeaderboard();
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchQuestions();
    document.getElementById("start-button").addEventListener("click", startGame);
    document.getElementById("submit-button").addEventListener("click", submitAnswers);
    document.getElementById("play-again-button").addEventListener("click", startGame);
});
