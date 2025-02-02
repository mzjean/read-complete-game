// Utility Function for Sanitizing HTML
function sanitizeHTML(str) {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = str;
  return tempDiv.innerHTML;
}

// Global Variables
let passages = []; // Main data source
let currentPassageIndex = 0;
let timer;
let timeLeft = 20; // 20 seconds
const debugMode = true; // Enable debug logging

// DOM Elements
const startButton = document.getElementById("start-game-btn");
const submitButton = document.getElementById("submit-btn");
const nextButton = document.getElementById("next-btn");
const startOverButton = document.getElementById("start-over-btn");
const timerElement = document.getElementById("timer");
const passageContainer = document.getElementById("passage-container");
const feedbackContainer = document.getElementById("feedback-container");

// Utility Functions
function setButtonVisibility({ start = false, submit = false, next = false, startOver = false }) {
  startButton?.classList.toggle("hidden", !start);
  submitButton?.classList.toggle("hidden", !submit);
  nextButton?.classList.toggle("hidden", !next);
  startOverButton?.classList.toggle("hidden", !startOver);

  console.log("Button visibility updated:", { start, submit, next, startOver }); // Debug log
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function startTimer() {
  timerElement.textContent = formatTime(timeLeft);
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = formatTime(timeLeft);

    if (timeLeft === 10) timerElement.classList.replace("warning", "danger");

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitAnswers(); // Auto-submit when time runs out
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 20;
  timerElement.textContent = formatTime(timeLeft);
  timerElement.classList.remove("warning", "danger");
}

// Fetch Passages
async function fetchPassages() {
  try {
    const response = await fetch("fitb.json");
    if (!response.ok) throw new Error("Failed to fetch passages.");
    passages = await response.json();
    if (debugMode) console.log("Passages loaded:", passages);
  } catch (error) {
    alert("Unable to load passages. Please try again later.");
    console.error(error);
  }
}

// Game Logic
function startGame() {
  setButtonVisibility({ submit: true });
  timerElement.classList.remove("hidden");
  passageContainer.classList.remove("hidden");
  feedbackContainer.classList.add("hidden");
  resetTimer();
  startTimer();
  currentPassageIndex = 0;
  loadPassage(currentPassageIndex);
}

function loadPassage(index) {
  const passage = passages[index];
  if (!passage) {
    console.error(`No passage found for index: ${index}`);
    passageContainer.innerHTML = `<p>Error loading passage. Please restart the game.</p>`;
    return;
  }

  passageContainer.innerHTML = `
    <h2>${sanitizeHTML(passage.title)}</h2>
    <p>${renderTextWithBlanks(sanitizeHTML(passage.text_with_blanks))}</p>
  `;
  feedbackContainer.classList.add("hidden");
  setButtonVisibility({ submit: true });

  const inputs = passageContainer.querySelectorAll("input");
  inputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      if (/^[a-zA-Z]$/.test(input.value)) {
        input.value = input.value.toLowerCase();
        if (input.value.length === 1 && idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        }
      } else {
        input.value = ""; // Clear invalid input
        input.classList.add("input-error");
        setTimeout(() => input.classList.remove("input-error"), 2000);
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && input.value === "" && idx > 0) {
        inputs[idx - 1].focus(); // Navigate to previous field
        event.preventDefault();
      }
    });
  });
}

function renderTextWithBlanks(text) {
  let blankIndex = 0;
  return text.replace(/(\w*_+\w*|_+)/g, (match) => {
    if (match.includes("_")) {
      blankIndex++;
      return `<span style="white-space: nowrap;">${match.replace(
        /_/g,
        `<input type="text" maxlength="1" spellcheck="false" data-index="${blankIndex}">`
      )}</span>`;
    }
    return `<span>${match}</span>`;
  });
}

function submitAnswers() {
  clearInterval(timer);
  const passage = passages[currentPassageIndex];
  const inputs = document.querySelectorAll("#passage-container input");
  let correctCount = 0;

  inputs.forEach((input) => {
    const index = input.getAttribute("data-index");
    const userAnswer = input.value.toLowerCase().trim();
    const correctAnswers = passage.answer_mapping[index] || [];

    if (userAnswer === "") {
      input.classList.add("incorrect");
      input.classList.remove("correct");
      return;
    }

    if (correctAnswers.includes(userAnswer)) {
      input.classList.add("correct");
      input.classList.remove("incorrect");
      correctCount++;
    } else {
      input.classList.add("incorrect");
      input.classList.remove("correct");
    }

    if (debugMode) {
      console.log(`Index: ${index}, User Answer: "${userAnswer}", Correct Answers: ${correctAnswers}`);
    }
  });

  const totalFields = inputs.length;
  const percentageCorrect = Math.round((correctCount / totalFields) * 100); // Round to nearest whole number

  feedbackContainer.innerHTML = `<p>You got ${correctCount} out of ${totalFields} correct (${percentageCorrect}%).</p>`;
  feedbackContainer.classList.remove("hidden");
  setButtonVisibility({ next: true });
}

function loadNextPassage() {
  currentPassageIndex++;
  if (currentPassageIndex < passages.length) {
    resetTimer();
    startTimer();
    loadPassage(currentPassageIndex);
  } else {
    endGame();
  }
}

function endGame() {
  passageContainer.innerHTML = `
    <h2>Congratulations!</h2>
    <h3>You completed all passages.</h3>
  `;
  timerElement.classList.add("hidden"); // Hide the timer
  feedbackContainer.classList.add("hidden"); // Hide the score
  setButtonVisibility({ startOver: true }); // Show "Start Over" button
  console.log("End game reached, showing Start Over button."); // Debug log
}

// Initialization
window.onload = async () => {
  if (typeof document !== "undefined") {
    await fetchPassages();
    setButtonVisibility({ start: true });
  }
};

// Event Listeners
startButton?.addEventListener("click", startGame);
submitButton?.addEventListener("click", submitAnswers);
nextButton?.addEventListener("click", loadNextPassage);
startOverButton?.addEventListener("click", () => {
  window.location.reload(); // Refresh the entire page
});
