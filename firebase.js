// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Your web app's Firebase configuration
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
const db = getDatabase(app);

export { auth, db, GoogleAuthProvider, signInWithPopup };

// Register new user
export async function registerUser(email, password, firstName, lastName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await set(ref(db, 'users/' + user.uid), {
      username: firstName + " " + lastName,
      email: email
    });
    console.log("User registered:", user);
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Login existing user
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

// Logout user
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

// Google login
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User logged in with Google:", user);
    return user;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
}

// Fetch passages from the database
export async function fetchPassages() {
  const passagesRef = ref(db, 'passages');
  try {
    const snapshot = await get(passagesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No passages found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching passages:", error);
    throw error;
  }
}

// Update leaderboard
export async function updateLeaderboard(passageId, userId, score) {
  try {
    await set(ref(db, 'leaderboards/' + passageId + '/' + userId), {
      userId: userId,
      score: score
    });
    console.log("Leaderboard updated");
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    throw error;
  }
}

// Fetch leaderboard for a specific passage
export async function fetchLeaderboard(passageId) {
  const leaderboardRef = ref(db, 'leaderboards/' + passageId);
  try {
    const snapshot = await get(leaderboardRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No leaderboard data found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}
