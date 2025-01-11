// Global Variables
let passages = [];
let currentPassage = 0;
let score = 0;
let timeLeft = 180; // 3 minutes
let timerInterval; // To store the timer interval

// Fetch Questions from `database.json`
function fetchQuestions() {
    fetch('database.json') // Ensure the file is in the same directory as the script
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            passages = data.questions; // Assuming your JSON structure has a "questions" array
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
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("game-container").style.display = "block";
    document.getElementById("start-button").style.display = "none";
    displayPassage();
    startTimer();
}

// Display Passage
function displayPassage() {
    if (passages[currentPassage]) {
        console.log("Displaying passage:", passages[currentPassage]); // Debugging log
        document.getElementById("passage").innerText = passages[currentPassage].passage;
    } else {
        console.error("No valid passage found:", passages[currentPassage]); // Debugging log
        document.getElementById("passage").innerText = "No passage available.";
    }
}

// Timer Functionality
function startTimer() {
    timeLeft = 180; // Reset timer to 3 minutes
    const timerElement = document.getElementById("timer");

    clearInterval(timerInterval); // Clear any previous intervals
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up!");
            submitAnswers(); // Automatically submit answers when time runs out
            promptNextPassage();
        } else {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.innerText = `Time left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }
    }, 1000); // Update every second
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
    document.getElementById("score").innerText = `Score: ${score}`;
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
            alert("No more passages available. Thank you for playing!");
        }
    } else {
        alert("Thank you for playing!");
        document.getElementById("game-container").style.display = "none";
        document.getElementById("start-button").style.display = "block";
    }
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
    fetchQuestions(); // Start by fetching questions from the database
    document.getElementById("user-form").addEventListener("submit", handleLogin);
    document.getElementById("start-button").addEventListener("click", startGame);
});
