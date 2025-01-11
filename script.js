// Import Firebase functions
import { auth, registerUser, loginUser, logoutUser, fetchPassages } from './firebase.js';

// Global variables
let currentPassageIndex = 0;
let timer;
let timeRemaining = 180;  // 3 minutes
let userPassages = [];

// Display auth container
document.getElementById('game-container').style.display = 'none';

// Show the register form
function showRegisterForm() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
}

// Show the login form
function showLoginForm() {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
}

// Handle registration
async function registerUserHandler() {
  const firstName = document.getElementById('register-first-name').value;
  const lastName = document.getElementById('register-last-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    await registerUser(email, password);
    localStorage.setItem('userName', firstName);
    showLoginForm();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Handle login
async function loginUserHandler() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    await loginUser(email, password);
    startGame();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Handle logout
async function logoutUserHandler() {
  try {
    await logoutUser();
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('auth-container').style.display = 'block';
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Start the game
function startGame() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';

  loadPassage();
  startTimer();
}

// Load a passage
async function loadPassage() {
  const passages = await fetchPassages();
  const passage = passages[currentPassageIndex];

  document.getElementById('passage-title').textContent = passage.title;
  document.getElementById('passage-text').textContent = passage.text;

  const inputsContainer = document.getElementById('inputs-container');
  inputsContainer.innerHTML = '';
  for (let i = 0; i < passage.text.length; i++) {
    if (passage.text[i] === '_') {
      const inputField = document.createElement('input');
      inputField.type = 'text';
      inputField.maxLength = 1;
      inputsContainer.appendChild(inputField);
    } else {
      const span = document.createElement('span');
      span.textContent = passage.text[i];
      inputsContainer.appendChild(span);
    }
  }
}

// Start the timer
function startTimer() {
  timer = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      document.getElementById('timer').textContent = `Time left: ${Math.floor(timeRemaining / 60)}:${timeRemaining % 60}`;
    } else {
      clearInterval(timer);
      submitAnswers();
    }
  }, 1000);
}

// Submit answers
async function submitAnswers() {
  const inputs = document.querySelectorAll('#inputs-container input');
  const passages = await fetchPassages();
  const passage = passages[currentPassageIndex];
  
  let correctAnswers = 0;
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const correctAnswer = passage.answers[i];

    if (input.value.toLowerCase() === correctAnswer.toLowerCase()) {
      correctAnswers++;
      input.style.backgroundColor = 'lightgreen';
    } else {
      input.style.backgroundColor = 'lightcoral';
    }
  }

  alert(`You scored ${correctAnswers} out of ${inputs.length}`);
}
