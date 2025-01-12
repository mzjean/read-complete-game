let currentPassageIndex = 0;
let timer;
let timeRemaining = 180; // 3 minutes for the timer

// Load the passage data from the provided JSON
let passages = [];
fetch('passages.json')
  .then(response => response.json())
  .then(data => {
    passages = data;  // Store the loaded passages in the array
    renderPassage();  // Display the first passage
  })
  .catch(error => console.error("Error loading passages:", error));

// Start the timer and show the passage when "Start" is clicked
document.getElementById("start-button").addEventListener("click", startGame);

function startGame() {
  document.getElementById("passage-container").style.display = "block";  // Show the passage
  document.getElementById("start-button").style.display = "none";  // Hide the start button
  startTimer();  // Start the countdown timer
}

function startTimer() {
  timer = setInterval(function() {
    timeRemaining--;
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeRemaining <= 30) {
      document.getElementById("timer").classList.add("red");  // Turn the timer red in the last 30 seconds
    }

    if (timeRemaining <= 0) {
      clearInterval(timer);  // Stop the timer
      submitAnswers();  // Auto-submit when the timer reaches zero
    }
  }, 1000);
}

// Render the passage and fill the blanks with input fields
function renderPassage() {
  let passage = passages[currentPassageIndex];
  document.getElementById("passage-title").textContent = passage.title;
  
  let passageText = passage.text_with_blanks;
  let passageHTML = passageText.split(/([_]+)/).map(part => {
    if (part === "_") {
      return '<input type="text" class="blank" maxlength="1">';
    } else {
      return `<span class="plain-text">${part}</span>`;
    }
  }).join('');
  
  document.getElementById("passage-container").innerHTML = passageHTML;
}

// Submit the answers and show results
document.getElementById("submit-button").addEventListener("click", submitAnswers);

function submitAnswers() {
  let inputs = document.querySelectorAll('.blank');
  let passage = passages[currentPassageIndex];
  let correctAnswers = passage.answer_mapping;
  
  inputs.forEach((input, index) => {
    if (input.value.toLowerCase() === correctAnswers[index].toLowerCase()) {
      input.classList.add('correct');
    } else {
      input.classList.add('incorrect');
    }
  });

  // Show the "Next Passage" button
  document.getElementById("next-passage-button").style.display = "block";
}

// Move to the next passage
document.getElementById("next-passage-button").addEventListener("click", nextPassage);

function nextPassage() {
  currentPassageIndex++;
  
  if (currentPassageIndex >= passages.length) {
    // If there are no more passages, show a congratulations message
    document.getElementById("passage-container").innerHTML = "<h2>Congratulations! You've completed all passages.</h2>";
    clearInterval(timer);  // Stop the timer
    document.getElementById("next-passage-button").style.display = "none";  // Hide the button
    return;
  }

  timeRemaining = 180;  // Reset timer for the next passage
  document.getElementById("next-passage-button").style.display = "none";  // Hide the button until next submission
  renderPassage();  // Render the new passage
  clearInterval(timer);  // Clear the previous timer
  startTimer();  // Start the timer for the new passage
}

// Auto-focus on the next text field when the user fills the current one
document.addEventListener("input", function(event) {
  if (event.target.classList.contains("blank") && event.target.value.length === 1) {
    let nextInput = event.target.nextElementSibling;
    if (nextInput && nextInput.classList.contains("blank")) {
      nextInput.focus();
    }
  }
});

// Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  // Adjust input field styling when in dark mode
  if (document.body.classList.contains("dark-mode")) {
    document.querySelectorAll(".blank").forEach(input => {
      input.classList.remove("yellow-outline");
      input.classList.add("grey-outline");
    });
  } else {
    document.querySelectorAll(".blank").forEach(input => {
      input.classList.remove("grey-outline");
      input.classList.add("yellow-outline");
    });
  }
}
