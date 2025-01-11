// Import Firebase functions from the hosted Firebase file
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBQBBiJ_Ia7Bte76hHCb8CABBQ-Ym0TyYk",
  authDomain: "readandcompletegame.firebaseapp.com",
  databaseURL: "https://readandcompletegame-default-rtdb.firebaseio.com",
  projectId: "readandcompletegame",
  storageBucket: "readandcompletegame.firebasestorage.app",
  messagingSenderId: "258271166303",
  appId: "1:258271166303:web:822be022fb0eabd27800ea",
  measurementId: "G-Y1FFMJ6EN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

// Select DOM elements for registration, login, and logout
const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');

// Event listeners for registration and login
if (registerButton && loginButton && logoutButton) {
  registerButton.addEventListener('click', registerUser);
  loginButton.addEventListener('click', loginUserHandler);
  logoutButton.addEventListener('click', logoutUser);
}

// Function to register user
function registerUser() {
  const email = emailInput.value;
  const password = passwordInput.value;
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Store user data in Firebase
      set(ref(database, 'users/' + user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email
      }).then(() => {
        alert('User registered successfully');
        showGameInterface(); // Proceed to game
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Function to log in the user
function loginUserHandler() {
  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      showGameInterface(); // Proceed to game
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Function to log out the user
function logoutUser() {
  signOut(auth)
    .then(() => {
      alert('User logged out');
      showLoginRegisterForm(); // Show login/register form
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Function to show the game interface after login
function showGameInterface() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';

  loadPassage();
  startTimer();
}

// Function to show login/register form
function showLoginRegisterForm() {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
}

// Initialize the game with passages from JSON
fetch('https://raw.githubusercontent.com/mzjean/read-complete-game/refs/heads/main/passages.json')
  .then(response => response.json())
  .then(passages => {
    startGame(passages); // Start the game with the loaded passages
  })
  .catch(error => {
    console.error("Error loading passages:", error);
  });

// Function to start the game
function startGame(passages) {
  const passage = passages[0]; // Display the first passage
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

// Timer functionality
function startTimer() {
  let timeRemaining = 180; // 3 minutes
  const timer = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      document.getElementById('timer').textContent = `Time left: ${Math.floor(timeRemaining / 60)}:${timeRemaining % 60}`;
    } else {
      clearInterval(timer);
      submitAnswers();
    }
  }, 1000);
}

// Submit answers function
async function submitAnswers() {
  const inputs = document.querySelectorAll('#inputs-container input');
  const passages = await fetchPassages();
  const passage = passages[0];

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

// Fetch passages from the GitHub JSON file
async function fetchPassages() {
  const response = await fetch('https://raw.githubusercontent.com/mzjean/read-complete-game/refs/heads/main/passages.json');
  const data = await response.json();
  return data.passages;
}
