// Importing Firebase functions from the hosted Firebase file
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase config (already defined in your firebase.js)
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

// Check if elements exist before attaching event listeners
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
  const gameInterface = document.getElementById('gameInterface');
  const loginRegister = document.getElementById('loginRegister');
  
  if (gameInterface && loginRegister) {
    gameInterface.style.display = 'block'; // Show the game
    loginRegister.style.display = 'none'; // Hide the login/register form
  }
}

// Function to show login/register form
function showLoginRegisterForm() {
  const loginRegister = document.getElementById('loginRegister');
  const gameInterface = document.getElementById('gameInterface');

  if (loginRegister && gameInterface) {
    loginRegister.style.display = 'block'; // Show the login/register form
    gameInterface.style.display = 'none'; // Hide the game interface
  }
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
  // Placeholder for passage start logic
  console.log(passages); // Display the passages
  // Add game logic here (display passage, handle input, check answers, etc.)
}
