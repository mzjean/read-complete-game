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

            if (passages.length > 0) {
                startGame();
            } else {
                console.error("No questions available in the database.");
                document.getElementById("passage").innerText = "No passages available. Please try again later.";
            }
        })
        .catch((error) => {
            console.error("Error fetching questions from database file:", error);
            document.getElementById("passage").innerText = "Error loading passages. Please try again later.";
        });
}

// Start Game
function startGame() {
    currentPassage = 0;
    score = 0;
    document.getElementById("score").innerText = `Score: ${score}`;
    if (passages[currentPassage]) {
        console.log("Displaying passage:", passages[currentPassage]); // Debugging log
        // Access the correct property 'passage' for the current passage
        document.getElementById("passage").innerText = passages[currentPassage].passage;
    } else {
        console.error("No valid passage found:", passages[currentPassage]); // Debugging log
        document.getElementById("passage").innerText = "No passage available.";
    }
    startTimer();
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
            // Handle game end or move to the next passage
        } else {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.innerText = `Time left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }
    }, 1000); // Update every second
}

// Example: Start Fetching Questions When Page Loads
document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded. Fetching questions...");
    fetchQuestions(); // Start by fetching questions from the database
});
