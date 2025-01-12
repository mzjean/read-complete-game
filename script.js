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
  await fetchPassages();
  // Add event listener for the Start Game button
  startButton.addEventListener("click", () => {
    console.log("Start Game button clicked");
    startGame();
  });
};
