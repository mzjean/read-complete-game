import { fetchPassages } from './firebase.js';

// Start Game Button
document.getElementById("startGameButton").addEventListener("click", startGame);

async function startGame() {
    const passages = await fetchPassages();
    let currentPassage = 0;
    loadPassage(passages[currentPassage]);

    const timer = startTimer(180);  // 3 minutes timer
    document.getElementById("submitButton").addEventListener("click", function() {
        submitAnswers(passages[currentPassage]);
        currentPassage++;
        if (currentPassage < passages.length) {
            loadPassage(passages[currentPassage]);
        } else {
            showResults();
        }
    });
}

function loadPassage(passage) {
    document.getElementById("passage").textContent = passage.text;  // Update the passage text
}

function startTimer(seconds) {
    let timeRemaining = seconds;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = timeRemaining;

    const interval = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(interval);
            submitAnswers();  // Auto-submit when time runs out
        }
    }, 1000);
    return interval;
}

function submitAnswers(passage) {
    console.log("Answers submitted for passage", passage);
    // Logic for answer submission and scoring (not storing to Firebase)
}

function showResults() {
    const timeSpent = sessionStorage.getItem('passageCompletionTime');
    const correctAnswers = sessionStorage.getItem('correctAnswers');
    console.log(`Time Spent: ${timeSpent} seconds`);
    console.log(`Correct Answers: ${correctAnswers}`);
    // Display results in #results
    document.getElementById("results").style.display = 'block';
    document.getElementById("results").textContent = `You completed the game with ${correctAnswers} correct answers in ${timeSpent} seconds.`;
}
