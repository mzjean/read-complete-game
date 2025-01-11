// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

// Your Firebase config
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

// Register User
function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Login User
function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Logout User
function logoutUser() {
  return signOut(auth);
}

// Store user data in the database
function storeUserData(userId, name, email) {
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email
  });
}

// Fetch passage data from GitHub
function fetchPassages() {
  fetch('https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY/main/passages.json')
    .then(response => response.json())
    .then(data => {
      const passages = data;
      const passage = passages[0]; // For now, just use the first passage
      displayPassage(passage);
      startTimer();
    })
    .catch((error) => {
      console.error("Error fetching passages: ", error);
    });
}