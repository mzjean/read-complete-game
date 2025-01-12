// Global Variables
let passages = [];
let currentPassageIndex = 0;
let timer;
let timeLeft = 180; // 3 minutes

// DOM Elements
const startButton = document.getElementById("start-game-btn");
const timerElement = document.getElementById("timer");
const passageContainer = document.getElementById("passage-container");
const feedbackContainer = document.getElementById("feedback-container");

// Fetch Passages
async function fetchPassages() {
  try {
    const response = await fetch("passages.json");
    if (!response.ok) throw new Error("Failed to fetch passages.");
    passages = await response.json();
    validatePassages(passages);
  } catch (error) {
    displayError("Unable to load passages. Please try again later.");
    console.error(error);
  }
}

// Validate Passages
function validatePassages(data) {
  if (!Array.isArray(data)) throw new Error("Invalid passages format.");
  data.forEach((passage) => {
    const { passage_id, title, text_with_blanks, answer_mapping } = passage;
    if (!passage_id || !title || !text_with_blanks || !answer_mapping) {
      throw new Error(`Passage ${passage_id} is missing required fields.`);
    }
  });
}

// Start Game
function startGame() {
  console.log("startGame function triggered"); // Debug Message

  // Hide the start button and good luck message
  startButton.classList.add("hidden");
  document.getElementById("good-luck-message").classList.add("hidden");

  // Show timer and passage container
  timerElement.classList.remove("hidden");
  passageContainer.classList.remove("hidden");

  // Reset timer and render the first passage
  timeLeft = 180;
  startTimer();
  renderPassage();
}

// Timer Logic
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitAnswers();
    }
  }, 1000);
}

function updateTimer() {
  timerElement.textContent = `Time Left: ${formatTime(timeLeft)}`;
  if (timeLeft <= 30 && timeLeft > 10) {
    timerElement.classList.add("warning");
    timerElement.classList.remove("danger");
  } else if (timeLeft <= 10) {
    timerElement.classList.add("danger");
  } else {
    timerElement.classList.remove("warning", "danger");
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Render Passage
function renderPassage() {
  const passage = passages[currentPassageIndex];
  passageContainer.innerHTML = `
    <h2>${passage.title}</h2>
    <p>${renderTextWithBlanks(passage.text_with_blanks)}</p>
    <button id="submit-btn" class="game-button submit-button" onclick="submitAnswers()">Submit</button>
  `;

  // Add event listeners to auto-advance the cursor
  const inputs = document.querySelectorAll("#passage-container input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === input.maxLength && index < inputs.length - 1) {
        inputs[index + 1].focus(); // Move to the next field
      }
    });
  });
}

function renderTextWithBlanks(text) {
  return text.replace(/_/g, () => `<input type="text" maxlength="1">`);
}

// Submit Answers
function submitAnswers() {
  clearInterval(timer);

  const passage = passages[currentPassageIndex];
  const inputs = document.querySelectorAll("#passage-container input");
  let correctCount = 0;

  inputs.forEach((input, index) => {
    const userAnswer = input.value.toLowerCase();
    const correctAnswers = passage.answer_mapping[`i_${index + 1}`] || [];
    if (correctAnswers.includes(userAnswer)) {
      input.classList.add("correct");
      correctCount++;
    } else {
      input.classList.add("incorrect");
    }
  });

  // Calculate percentage correct
  const totalFields = inputs.length;
  const percentageCorrect = ((correctCount / totalFields) * 100).toFixed(2);

  feedbackContainer.innerHTML = `
    <p>You got ${correctCount} out of ${totalFields} correct (${percentageCorrect}%).</p>
    <button class="game-button next-button" onclick="loadNextPassage()">Next Passage</button>
  `;
  feedbackContainer.classList.remove("hidden");
}

// Load Next Passage
function loadNextPassage() {
  currentPassageIndex++;
  if (currentPassageIndex < passages.length) {
    feedbackContainer.classList.add("hidden");
    timeLeft = 180;
    startTimer();
    renderPassage();
  } else {
    endGame();
  }
}

// End Game
function endGame() {
  passageContainer.innerHTML = `<h2>Congratulations! You completed all passages.</h2>
    <button class="game-button start-button" onclick="restartGame()">Restart</button>`;
}

// Restart Game
function restartGame() {
  localStorage.clear();
  location.reload();
}

// Display Error
function displayError(message) {
  document.body.innerHTML = `<h1>${message}</h1>`;
}

// On Page Load
window.onload = async () => {
  await fetchPassages(); // Ensure fetchPassages is properly called here
  startButton.addEventListener("click", startGame); // Ensure event listener is attached
};
