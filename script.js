import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const registerButton = document.getElementById('registerBtn');
  const loginButton = document.getElementById('loginBtn');
  const logoutButton = document.getElementById('logoutButton');
  
  // Check if buttons exist
  if (registerButton) {
    registerButton.addEventListener('click', showRegisterForm);
  }
  
  if (loginButton) {
    loginButton.addEventListener('click', showLoginForm);
  }
  
  if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
  }
});

// Show Register Form
function showRegisterForm() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
}

// Show Login Form
function showLoginForm() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
}

// Register user
function registerUser() {
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
        showGameInterface(); // Proceed to game
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Login user
function loginUserHandler() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      showGameInterface(); // Proceed to game
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Logout user
function logoutUser() {
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

function showGameInterface() {
  // Hide login and register forms
  document.getElementById('auth-container').style.display = 'none';
  
  // Show the game interface
  document.getElementById('game-container').style.display = 'block';

  // You can set additional game-related functionality here (e.g., load passages, start game logic)
}

// Load Passages from JSON URL
function loadPassages() {
  fetch("https://raw.githubusercontent.com/mzjean/read-complete-game/refs/heads/main/passages.json")
    .then(response => response.json())
    .then(data => {
      console.log("Passages loaded", data);
      // Store or use the data for gameplay here
    })
    .catch(error => {
      console.error("Error loading passages:", error);
    });
}

// Load Passages when the game starts
function startGame() {
  loadPassages();
  // Add further game initialization logic here
}
