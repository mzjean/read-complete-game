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
    document.getElementById("start-button").addEventListener("click", startGame);
});
