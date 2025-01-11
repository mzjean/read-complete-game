import { fetchPassages } from './firebase.js';

let passages = [];
let currentPassage = 0;
let timer;

// Start Game Button
document.getElementById("startGameButton").addEventListener("click", async () => {
    try {
        passages = await fetchPassages(); // Fetch passages
        if (passages.length > 0) {
            loadPassage(passages[currentPassage]); // Load the first passage
            document.getElementById("submitButton").style.display = "block"; // Show the submit button
        } else {
            alert("No passages available!");
        }
    } catch (error) {
        console.error("Error fetching passages:", error);
    }
});

// Load Passage Function
function loadPassage(passage) {
    document.getElementById("passage").textContent = passage.text;  // Update the passage text
    startTimer(180);  // Start a 3-minute timer for the passage
}

// Start Timer
function startTimer(seconds) {
    let timeRemaining = seconds;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = timeRemaining;

    timer = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            submitAnswers();  // Auto-submit when time runs out
        }
    }, 1000);
}

// Submit Answers
document.getElementById("submitButton").addEventListener("click", submitAnswers);

function submitAnswers() {
    // Logic for submitting answers (not storing to Firebase)
    console.log("Answers submitted for passage", passages[currentPassage]);

    currentPassage++;
    if (currentPassage < passages.length) {
        loadPassage(passages[currentPassage]);
    } else {
        showResults();
    }
}

function showResults() {
    // Show results after completing all passages
    document.getElementById("results").style.display = 'block';
    document.getElementById("results").textContent = `Game Over! You completed all passages.`;
}
