// Import Firebase functions from the hosted GitHub link
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

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const startBtn = document.getElementById('start-btn');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const passageContainer = document.getElementById('passage-container');
const passageText = document.getElementById('passage-text');
const inputFields = document.getElementById('input-fields');
const timerDisplay = document.getElementById('timer-display');

// Firebase user state listener
auth.onAuthStateChanged(user => {
  if (user) {
    // If user is logged in, show the game and user details
    console.log('User logged in:', user);
    showGame(user);
  } else {
    // Show login or register screen
    console.log('No user logged in');
    showLoginForm();
  }
});

// Register new user
registerBtn.addEventListener('click', async () => {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User registered:', user);

    // Save user data in the database
    await set(ref(database, 'users/' + user.uid), {
      firstName: firstName,
      lastName: lastName,
      email: email
    });

    // After registration, automatically log the user in
    showGame(user);
  } catch (error) {
    console.error('Error registering user:', error);
    alert('Error registering user: ' + error.message);
  }
});

// Login existing user
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User logged in:', user);

    // Show game after login
    showGame(user);
  } catch (error) {
    console.error('Error logging in user:', error);
    alert('Error logging in user: ' + error.message);
  }
});

// Logout current user
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    console.log('User logged out');
  } catch (error) {
    console.error('Error logging out:', error);
    alert('Error logging out: ' + error.message);
  }
});

// Show game screen
function showGame(user) {
  // Show user details and start the game
  const userDetails = document.getElementById('user-details');
  userDetails.innerHTML = `Welcome, ${user.displayName || user.email}`;

  // Hide login and register forms
  loginForm.style.display = 'none';
  registerForm.style.display = 'none';

  // Show the game
  passageContainer.style.display = 'block';
  loadPassages();
}

// Show login form
function showLoginForm() {
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
  passageContainer.style.display = 'none';
}

// Show register form
function showRegisterForm() {
  registerForm.style.display = 'block';
  loginForm.style.display = 'none';
  passageContainer.style.display = 'none';
}

// Load passages from GitHub
async function loadPassages() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/mzjean/read-complete-game/refs/heads/main/passages.json');
    const data = await response.json();
    console.log('Passages:', data);
    startGame(data);
  } catch (error) {
    console.error('Error loading passages:', error);
  }
}

// Start game with a passage
function startGame(passes) {
  const randomPassage = passes[Math.floor(Math.random() * passes.length)];
  const passageText = randomPassage.text;
  const passageId = randomPassage.id;

  displayPassage(passageText);
  startTimer();
}

// Display the passage text in the game
function displayPassage(text) {
  passageText.innerHTML = text;
}

// Start the countdown timer
function startTimer() {
  let timeLeft = 60; // 60 seconds
  timerDisplay.textContent = `Time left: ${timeLeft}`;

  const timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      // Handle answer submission after time runs out
      submitAnswers();
    }
  }, 1000);
}

// Submit answers when the timer runs out or when clicked
function submitAnswers() {
  // Compare user input with correct answers
  console.log('Answers submitted');
  // Handle answer checking here...
}
