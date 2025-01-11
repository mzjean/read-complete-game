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
    console.log(passages); // Log passages to ensure it's being fetched properly
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

  // Log passage to ensure it's being displayed
  console.log('Showing passage:', passage);

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
  document.getElementById('next-pass').style.display = 'none'; // Hide Next Passage button initially
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
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

  // Show the Next Passage button and hide the Submit button
  document.getElementById('submit-button').style.display = 'none';
  document.getElementById('next-pass').style.display = 'block';
}

// Move to the next passage
function nextPassage() {
  // Increment the passage index and show the next passage
  currentPassageIndex++;

  // If all passages have been completed, show a message
  if (currentPassageIndex < passages.length) {
    showPassage();
  } else {
    alert("You've completed all the passages!");
    // Optionally, show analytics or restart the game here
  }

  // Reset the timer
  timeLeft = 180; // Reset to 3 minutes
  document.getElementById('timer').textContent = `${Math.floor(timeLeft / 60)}:00`;
  startTimer(); // Restart the timer
}

// Call fetchPassages when the page is ready
fetchPassages();
