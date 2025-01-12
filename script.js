let passages = []; // Global array to store passages
let currentPassageIndex = 0; // Tracks the current passage being shown
let timer; // Timer variable to store the interval
let timeLeft = 180; // Timer set to 3 minutes (180 seconds)

// Function to fetch passages from the passages.json file
function fetchPassages() {
  fetch('passages.json') // Ensure this path is correct (adjust if in a different folder)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load passages');
      }
      return response.json();
    })
    .then(data => {
      console.log('Passages fetched:', data); // Log the fetched passages for debugging
      passages = data; // Store the passages in the global array
      if (passages.length > 0) {
        showPassage(currentPassageIndex); // Show the first passage
      } else {
        console.error('No passages found.');
      }
    })
    .catch(error => {
      console.error("Error fetching passages:", error);
    });
}

// Function to show a passage and start the timer
function showPassage(index) {
  if (index >= passages.length) {
    endGame(); // If no more passages, end the game
    return;
  }

  const passage = passages[index];
  const passageContainer = document.getElementById('passage-container');
  const timerElement = document.getElementById('timer');
  const submitButton = document.getElementById('submit-button');
  const nextPassageButton = document.getElementById('next-passage-button');

  // Display the passage title and blanks
  passageContainer.innerHTML = `
    <h2>${passage.title}</h2>
    <p id="passage-text">${passage.text.replace(/__/g, '<input type="text" maxlength="1" class="blank" />')}</p>
  `;

  // Show the submit button
  submitButton.style.display = 'inline-block';
  nextPassageButton.style.display = 'none'; // Hide "Next Passage" button until the user submits

  // Start the timer
  startTimer();

  // Add event listener for the submit button
  submitButton.onclick = function () {
    handleSubmit();
    nextPassageButton.style.display = 'inline-block'; // Show next passage button after submit
    submitButton.style.display = 'none'; // Hide submit button after submission
  };

  // Add event listener for the next passage button
  nextPassageButton.onclick = function () {
    currentPassageIndex++;
    showPassage(currentPassageIndex); // Show next passage
  };
}

// Start the countdown timer and update the UI
function startTimer() {
  timeLeft = 180; // Reset the time for each passage
  updateTimerDisplay();

  // Set a timer to update the countdown every second
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer); // Stop the timer
      handleSubmit(); // Submit automatically when time runs out
      document.getElementById('next-passage-button').style.display = 'inline-block'; // Show next passage button
      document.getElementById('submit-button').style.display = 'none'; // Hide submit button
    }
  }, 1000);
}

// Update the timer display in M:SS format
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer').textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds} seconds`;
}

// Handle the submission of answers
function handleSubmit() {
  const blanks = document.querySelectorAll('.blank');
  let correctCount = 0;

  // Check each input field for correct answers
  blanks.forEach((blank, index) => {
    const correctAnswer = passages[currentPassageIndex].answers[index]; // Assuming answers array is defined in passages.json
    if (blank.value.toLowerCase() === correctAnswer.toLowerCase()) {
      correctCount++;
      blank.classList.add('correct');
    } else {
      blank.classList.add('incorrect');
    }
  });

  // Show feedback and hide the submit button
  alert(`You got ${correctCount} out of ${blanks.length} correct!`);
}

// End the game after all passages are completed
function endGame() {
  const passageContainer = document.getElementById('passage-container');
  passageContainer.innerHTML = `
    <h2>You've completed all of the passages! Good job!</h2>
  `;
  document.getElementById('next-passage-button').style.display = 'none'; // Hide next passage button after the last passage
}

// Start the game when the page is ready
document.getElementById('start-game-button').addEventListener('click', () => {
  fetchPassages(); // Load the passages
});
