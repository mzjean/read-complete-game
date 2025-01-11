// Initialize game variables
let passages = [];
let currentPassageIndex = 0;
let timer;
let timeLeft = 180; // 3 minutes = 180 seconds

// Fetch passages from the local JSON file
async function fetchPassages() {
  try {
    const response = await fetch('passages.json');
    const data = await response.json();
    passages = data;
  } catch (error) {
    console.error('Error fetching passages:', error);
  }
}

// Start game function
function startGame() {
  // Hide the start game button and show the passage container
  document.getElementById('start-game-button').style.display = 'none';
  document.getElementById('passage-container').style.display = 'block';

  // Show the first passage
  showPassage();

  // Start the countdown timer
  startTimer();
}

// Show a passage and its inputs
function showPassage() {
  const passage = passages[currentPassageIndex];

  if (!passage) return; // No passage to show

  document.getElementById('passage-title').textContent = passage.title;
  document.getElementById('passage-text').textContent = passage.passage;

  // Create input fields for each blank
  const passageInputsDiv = document.getElementById('passage-inputs');
  passageInputsDiv.innerHTML = ''; // Clear any previous input fields

  passage.answers.forEach((answer, index) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.classList.add('blank');
    input.dataset.index = index;
    passageInputsDiv.appendChild(input);
  });

  // Show the submit button
  document.getElementById('submit-button').style.display = 'block';
}

// Start timer countdown
function startTimer() {
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up!");
      checkAnswers(); // Automatically submit when the time is up
    } else {
      timeLeft--;
      document.getElementById('timer').textContent = timeLeft;
    }
  }, 1000);
}

// Check the answers submitted by the user
function checkAnswers() {
  const inputs = document.querySelectorAll('.blank');
  const passage = passages[currentPassageIndex];
  let correctAnswers = 0;

  inputs.forEach((input, index) => {
    if (input.value.trim().toLowerCase() === passage.answers[index].toLowerCase()) {
      correctAnswers++;
      input.style.backgroundColor = 'lightgreen';
    } else {
      input.style.backgroundColor = 'red';
    }
  });

  alert(`You got ${correctAnswers} out of ${passage.answers.length} correct!`);

  // Move to the next passage or end the game
  if (currentPassageIndex < passages.length - 1) {
    currentPassageIndex++;
    showPassage();
  } else {
    alert("You've completed all the passages!");
  }
}
