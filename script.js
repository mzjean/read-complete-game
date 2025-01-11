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
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.style.display = "none"; // Hide feedback for new passage

    if (passages[currentPassage]) {
        console.log("Displaying passage:", passages[currentPassage]);
        document.getElementById("passage").innerText = passages[currentPassage].passage;
    } else {
        handleEmptyPassages();
    }
}

// Timer Functionality
function startTimer() {
    timeLeft = 180;
    const timerElement = document.getElementById("timer");

    clearInterval(timerInterval); 
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up!");
            submitAnswers();
            promptNextPassage();
        } else {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.innerText = `Time left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

            if (timeLeft <= 10) {
                timerElement.style.color = "red"; // Warning visual cue
            } else {
                timerElement.style.color = "black"; // Reset color
            }
        }
    }, 1000);
}

// Submit Answers
function submitAnswers() {
    const answer1 = document.getElementById("answer1").value.trim();
    const answer2 = document.getElementById("answer2").value.trim();
    const answer3 = document.getElementById("answer3").value.trim();

    const correctAnswers = [
        passages[currentPassage].answer1,
        passages[currentPassage].answer2,
        passages[currentPassage].answer3,
    ];

    let correctCount = 0;
    if (answer1 === correctAnswers[0]) correctCount++;
    if (answer2 === correctAnswers[1]) correctCount++;
    if (answer3 === correctAnswers[2]) correctCount++;

    score += correctCount;
    completedPassages++;
    document.getElementById("score").innerText = `Score: ${score}`;

    // Provide Feedback
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.style.display = "block";
    feedbackElement.innerHTML = `Correct Answers:<br>
        Word 1: ${correctAnswers[0]}<br>
        Word 2: ${correctAnswers[1]}<br>
        Word 3: ${correctAnswers[2]}`;
}

// Prompt for Next Passage
function promptNextPassage() {
    const userChoice = confirm("Would you like to try another passage?");
    if (userChoice) {
        currentPassage++;
        if (currentPassage < passages.length) {
            displayPassage();
            startTimer();
        } else {
            handleEmptyPassages();
        }
    } else {
        endGame();
    }
}

// Handle Empty Passages
function handleEmptyPassages() {
    alert("No more passages available. Great job!");
    endGame();
}

// End Game Summary
function endGame() {
    document.getElementById("game-container").style.display = "none";
    document.getElementById("end-summary").style.display = "block";
    document.getElementById("final-score").innerText = `Final Score: ${score}`;
    document.getElementById("passages-completed").innerText = `Passages Completed: ${completedPassages}`;
}

// Leaderboard Functionality
function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    leaderboard.push({ score, completedPassages, date: new Date().toLocaleString() });
    leaderboard.sort((a, b) => b.score - a.score); // Sort by highest score
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    const leaderboardElement = document.getElementById("leaderboard");
    leaderboardElement.innerHTML = leaderboard.slice(0, 5).map((entry, index) => 
        `<p>${index + 1}. Score: ${entry.score}, Passages: ${entry.completedPassages}, Date: ${entry.date}</p>`
    ).join("");
}

// Login Flow
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

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded. Fetching questions...");
    fetchQuestions(); 
    document.getElementById("user-form").addEventListener("submit", handleLogin);
    document.getElementById("start-button").addEventListener("click", () => {
        startGame();
        updateLeaderboard();
    });
});
