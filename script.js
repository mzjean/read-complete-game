// Global Variables
let passages = [];
let currentPassage = 0;
let score = 0;
let timeLeft = 180; // 3 minutes
let timerInterval; // To store the timer interval
let completedPassages = 0;

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

// Start Game Flow
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

// Display Passage
function displayPassage() {
    console.log("Displaying passage for index:", currentPassage);
    if (currentPassage >= passages.length) {
        endGame();
        return;
    }

    const passage = passages[currentPassage];
    console.log("Current passage object:", passage);

    if (!passage || !passage.passage) {
        console.error("Passage data is missing or undefined for index:", currentPassage);
        alert("An error occurred. Please try again.");
        return;
    }

    document.getElementById("passage").innerText = passage.passage;
}

// Handle Login Flow
function handleLogin(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();

    if (firstName && lastName && email) {
        document.getElementById("user-form").style.display = "none";
        document.getElementById("start-button").style.display = "block";
        alert(`Welcome, ${firstName} ${lastName}!`);
    } else {
        alert("Please fill out all fields to log in.");
    }
}

// Handle Submit Answers
function submitAnswers() {
    console.log("Submit button clicked!");

    // Validate currentPassage and its answers
    if (!passages[currentPassage] || !passages[currentPassage].answers) {
        console.error("Current passage or answers are undefined.");
        alert("An error occurred with the current passage. Please try again.");
        return;
    }

    const answer1 = document.getElementById("answer1").value.trim();
    const answer2 = document.getElementById("answer2").value.trim();
    const answer3 = document.getElementById("answer3").value.trim();
    const correctAnswers = passages[currentPassage].answers;

    console.log("User answers:", [answer1, answer2, answer3]);
    console.log("Correct answers:", correctAnswers);

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

// End Game Flow
function endGame() {
    clearInterval(timerInterval);
    document.getElementById("game-container").style.display = "none";
    document.getElementById("end-summary").style.display = "block";
    document.getElementById("final-score").innerText = `Final Score: ${score}`;
    document.getElementById("passages-completed").innerText = `Passages Completed: ${completedPassages}`;
}

// Timer Functionality
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

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchQuestions();
    document.getElementById("user-form").addEventListener("submit", handleLogin);
    document.getElementById("start-button").addEventListener("click", startGame);
    document.getElementById("submit-button").addEventListener("click", submitAnswers);
});
