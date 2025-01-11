// Firebase initialization (from firebase.js)
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Firebase configuration
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Show Register Form
function showRegisterForm() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

// Show Login Form
function showLoginForm() {
  document.getElementById("register-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}

// Register user
function registerUserHandler() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const firstName = document.getElementById("register-first-name").value;
  const lastName = document.getElementById("register-last-name").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // Save user data in the Firebase Realtime Database
      set(ref(database, 'users/' + user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email
      }).then(() => {
        alert("User registered successfully!");
        showLoginForm();
      }).catch((error) => {
        alert("Error saving user data: " + error.message);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Login user
function loginUserHandler() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById("auth-container").style.display = "none";
      document.getElementById("game-container").style.display = "block";
      document.getElementById("user-name").innerText = user.displayName || `${user.email}`;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Fetch passages from the raw JSON file hosted on GitHub
async function fetchPassages() {
  const response = await fetch('https://raw.githubusercontent.com/mzjean/read-complete-game/refs/heads/main/passages.json');
  const passages = await response.json();
  return passages;
}

// Load a passage from the fetched data
async function loadPassage() {
  const passages = await fetchPassages();
  const randomPassage = passages[Math.floor(Math.random() * passages.length)];
  
  document.getElementById("passage-text").innerText = randomPassage.passage;
  document.getElementById("passage-id").innerText = `Passage #${randomPassage.id}`;

  // Generate input fields for the blanks
  let inputHTML = '';
  randomPassage.passage.split('').forEach((char, index) => {
    if (char === '_') {
      inputHTML += `<input type="text" id="blank-${index}" maxlength="1" />`;
    } else {
      inputHTML += char;
    }
  });
  document.getElementById("inputs-container").innerHTML = inputHTML;

  // Store the answers for checking later
  window.currentAnswers = randomPassage.answers;
}

// Handle submission of answers
function submitAnswers() {
  let correctAnswers = 0;

  // Loop through each blank and check the answer
  window.currentAnswers.forEach((correctAnswer, index) => {
    const inputField = document.getElementById(`blank-${index}`);
    const userAnswer = inputField.value.trim().toLowerCase();
    
    if (userAnswer === correctAnswer.toLowerCase()) {
      correctAnswers++;
      inputField.style.backgroundColor = 'green'; // Correct answer
    } else {
      inputField.style.backgroundColor = 'red'; // Incorrect answer
    }
  });

  alert(`You got ${correctAnswers} out of ${window.currentAnswers.length} correct!`);
}

// Event listeners for start and submit
document.getElementById("start-button").addEventListener("click", loadPassage);
document.getElementById("submit-button").addEventListener("click", submitAnswers);
