// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered:", userCredential);
    return userCredential;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Login existing user
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential);
    return userCredential;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

// Logout user
async function logoutUser() {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

// Fetch passages from the database
async function fetchPassages() {
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

// Example usage of these functions
fetchPassages();
