import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

// Firebase Configuration
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
const db = getDatabase(app);

// Register new user
document.getElementById('registerButton').addEventListener('click', function() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log("User registered: ", user);

        // Save user data to Firebase Database
        set(ref(db, 'users/' + user.uid), {
            firstName: firstName,
            lastName: lastName,
            email: email
        });

        // Automatically log in after registration
        window.location.href = "/game"; // Redirect to game page
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
});

// Login with email and password
document.getElementById('loginButton').addEventListener('click', function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in: ", user);
        window.location.href = "/game"; // Redirect to game page
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
});

// Google Login
document.getElementById('googleLoginButton').addEventListener('click', function() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        console.log("User logged in with Google: ", user);

        // Save user data to Firebase Database
        set(ref(db, 'users/' + user.uid), {
            firstName: user.displayName.split(" ")[0],
            lastName: user.displayName.split(" ")[1] || "",
            email: user.email
        });

        window.location.href = "/game"; // Redirect to game page
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
});

// Handle game page and logout
document.getElementById('startGameButton').addEventListener('click', function() {
    alert('Starting game...');
    // Replace with actual game logic
});

document.getElementById('logoutButton').addEventListener('click', function() {
    signOut(auth).then(() => {
        console.log('User logged out');
        window.location.href = "/login"; // Redirect to login page
    }).catch((error) => {
        console.log("Error logging out: ", error);
    });
});

// Firebase Auth State Listener
auth.onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('userName').textContent = user.displayName || user.email;
        document.getElementById('gamePage').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
    } else {
        document.getElementById('gamePage').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'block';
    }
});
