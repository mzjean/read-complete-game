import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

// Add Event Listeners for the buttons
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM content loaded");

  const registerButton = document.getElementById('registerButton');
  const loginButton = document.getElementById('loginButton');
  const goToRegisterButton = document.getElementById('goToRegisterButton');
  const goToLoginButton = document.getElementById('goToLoginButton');
  
  console.log(registerButton, loginButton, goToRegisterButton, goToLoginButton);
  
  // Add event listeners if buttons exist
  if (registerButton) {
    registerButton.addEventListener('click', registerUser);
    console.log("Register button listener added");
  }

  if (loginButton) {
    loginButton.addEventListener('click', loginUserHandler);
    console.log("Login button listener added");
  }

  if (goToRegisterButton) {
    goToRegisterButton.addEventListener('click', showRegisterForm);
    console.log("Go to Register button listener added");
  }

  if (goToLoginButton) {
    goToLoginButton.addEventListener('click', showLoginForm);
    console.log("Go to Login button listener added");
  }
});

// Show Register Form
function showRegisterForm() {
  console.log('Showing Register Form...');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
}

// Show Login Form
function showLoginForm() {
  console.log('Showing Login Form...');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
}

// Register user
function registerUser() {
  console.log('Registering user...');
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const firstName = document.getElementById('register-first-name').value;
  const lastName = document.getElementById('register-last-name').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      set(ref(database, 'users/' + user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email
      }).then(() => {
        alert('User registered successfully');
        showGameInterface(user); // Pass user data to the game interface
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Login user
function loginUserHandler() {
  console.log('Logging in user...');
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User logged in:", user);
      showGameInterface(user); // Pass user data to the game interface
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Logout user
function logoutUser() {
  console.log("Logging out user...");
  signOut(auth)
    .then(() => {
      alert('User logged out');
      showLoginForm(); // Show login/register form
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

function showGameInterface(user) {
  console.log('Showing game interface...');
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';

  // Display user's name in welcome message
  const welcomeMessage = document.getElementById('welcome-message');
  welcomeMessage.innerText = `Welcome, ${user.displayName || user.email}!`;

  loadPassages();  // Fetch and load passages data here
}

async function loadPassages() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/mzjean/read-complete-game/refs/heads/main/passages.json');
    const data = await response.json();
    console.log('Passages loaded:', data);
    // Use the data here to start the game
  } catch (error) {
    console.error('Error fetching passages:', error);
  }
}

function startGame() {
  loadPassages();
  // Game initialization logic
}
