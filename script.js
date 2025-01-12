// Define global variables
let currentPassageIndex = 0;
let passages = []; // This will store the passages from your JSON file
let timerInterval;

// Start the game function
function startGame() {
  // Hide welcome section and show passage container
  document.getElementById("welcome-section").style.display = "none";
  document.getElementById("passage-container").style.display = "block";
  
  // Fetch passages and start the first passage
  fetchPassages();
  startTimer();
}

// Fetch passages from passages.json
function fetchPassages() {
  fetch('./passages.json')
    .then(response => response.json())
    .then(data => {
      passages = data;  // Store the passages
      showPassage(currentPassageIndex);  // Show the first passage
    })
    .catch(error => console.log("Error fetching passages:", error));
}

// Show a specific passage by index
function showPassage(index) {
  const passage = passages[index];
  document.getElementById("passage-title").textContent = passage.title;
  document.getElementById("passage-text").textContent = passage.text;

  // Display the blank spaces and input fields
  const passageInputs = document.getElementById("passage-inputs");
  passageInputs.innerHTML = ''; // Clear previous inputs
  for (let i = 0; i < passage.text.length; i++) {
    const char = passage.text.charAt(i);
    if (char === "_") {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      passageInputs.appendChild(input);
    } else {
      const span = document.createElement("span");
      span.textContent = char;
      passageInputs.appendChild(span);
    }
  }

  // Show the submit button
  document.getElementById("submit-button").style.display = "inline-block";
}

// Start the timer
function startTimer() {
  let timeLeft = 180; // 3 minutes = 180 seconds
  document.getElementById("timer").textContent = formatTime(timeLeft);

  timerInterval = setInterval(function() {
    timeLeft--;
    document.getElementById("timer").textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      checkAnswers();  // Automatically check answers when time is up
    }
  }, 1000);
}

// Format time in M:SS format
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Check answers after user presses submit
function checkAnswers() {
  // Disable the submit button
  document.getElementById("submit-button").style.display = "none";
  const inputs = document.getElementById("passage-inputs").getElementsByTagName("input");
  const passage = passages[currentPassageIndex];
  let correctCount = 0;

  // Check each input value against the corresponding letter
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value.toLowerCase() === passage.text.charAt(i + passage.text.indexOf("_")).toLowerCase()) {
      correctCount++;
      inputs[i].style.borderColor = 'green';  // Correct answer styling
    } else {
      inputs[i].style.borderColor = 'red';  // Incorrect answer styling
    }
  }

  // Show the "Next Passage" button
  document.getElementById("next-pass").style.display = "inline-block";
}

// Move to the next passage
function nextPassage() {
  currentPassageIndex++;  // Move to the next passage
  if (currentPassageIndex < passages.length) {
    showPassage(currentPassageIndex);  // Show next passage
    document.getElementById("next-pass").style.display = "none";  // Hide the next button again
  } else {
    // All passages are complete, show the end message
    document.getElementById("passage-container").style.display = "none";  // Hide the passages
    const endMessage = document.createElement("h2");
    endMessage.textContent = "You've completed all of the passages! Good job!";
    document.body.appendChild(endMessage);  // Display the end message
  }
}
