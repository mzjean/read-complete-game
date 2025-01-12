// Render Passage
function renderPassage() {
  const passage = passages[currentPassageIndex];
  passageContainer.innerHTML = `
    <h2>${passage.title}</h2>
    <p>${renderTextWithBlanks(passage.text_with_blanks)}</p>
    <button id="submit-btn" class="game-button submit-button" onclick="submitAnswers()">Submit</button>
  `;
}

function renderTextWithBlanks(text) {
  return text.replace(/_/g, () => `<input type="text" maxlength="1">`);
}

// Apply feedback (green/red) to inputs
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

  feedbackContainer.innerHTML = `
    <p>You got ${correctCount} out of ${inputs.length} correct.</p>
    <button class="game-button next-button" onclick="loadNextPassage()">Next Passage</button>
  `;
  feedbackContainer.classList.remove("hidden");
}

// Start Game
function startGame() {
  startButton.classList.add("hidden");
  document.getElementById("good-luck-message").classList.add("hidden");
  timerElement.classList.remove("hidden");
  passageContainer.classList.remove("hidden");
  timeLeft = 180;
  startTimer();
  renderPassage();
}
