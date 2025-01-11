// Get the user info
let currentUser = null;
let currentPassage = null;
let timer;
let timeLeft = 60;

// Toggle between Register and Login forms
function showRegisterForm() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

function showLoginForm() {
  document.getElementById("register-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}

// Handle registration
async function registerUserHandler() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  
  try {
    const userCredential = await registerUser(email, password);
    currentUser = userCredential.user;
    document.getElementById("user-name").textContent = currentUser.email.split('@')[0]; // Display email name
    showStartInterface();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Handle login
async function loginUserHandler() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await loginUser(email, password);
    currentUser = userCredential.user;
    document.getElementById("user-name").textContent = currentUser.email.split('@')[0]; // Display email name
    showStartInterface();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Show the start game interface after login
function showStartInterface() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  document.getElementById("start-container").style.display = "block";
}

// Start the game after the user clicks "Start Game"
function startGame() {
  document.getElementById("start-container").style.display = "none";
  document.getElementById("game-content").style.display = "block";
  loadPassage();
  startTimer();
}

// Fetch and display a random passage
async function loadPassage() {
  try {
    const passages = await fetchPassages();
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];
    currentPassage = randomPassage;
    document.getElementById("passage-title").textContent = randomPassage.title;
    document.getElementById("passage-text").textContent = randomPassage.passage;

    // Create input fields for the blanks
    let inputHTML = '';
    for (let i = 0; i < randomPassage.passage.length; i++) {
      if (randomPassage.passage[i] === '_') {
        inputHTML += `<input type="text" id="blank-${i}" maxlength="1" />`;
      } else {
        inputHTML += randomPassage.passage[i];
      }
    }
    document.getElementById("inputs-container").innerHTML = inputHTML;
  } catch (error) {
    console.error("Error loading passage:", error);
  }
}

// Start the timer for the game
function startTimer() {
  timer = setInterval(function() {
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitAnswers();
    } else {
      document.getElementById("timer").textContent = `Time Left: ${timeLeft} seconds`;
      timeLeft--;
    }
  }, 1000);
}

// Submit answers
function submitAnswers() {
  let correctAnswers = 0;

  for (let i = 0; i < currentPassage.passage.length; i++) {
    const inputField = document.getElementById(`blank-${i}`);
    if (inputField && inputField.value.toLowerCase() === currentPassage.passage[i].toLowerCase()) {
      correctAnswers++;
      inputField.style.backgroundColor = 'green'; // Correct answer
    } else if (inputField) {
      inputField.style.backgroundColor = 'red'; // Incorrect answer
    }
  }

  alert(`You got ${correctAnswers} out of ${currentPassage.passage.length} correct!`);
}
