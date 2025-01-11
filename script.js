// Get the elements for the game interface
const gameContainer = document.getElementById('game-container');
const authContainer = document.getElementById('auth-container');
const logoutBtnContainer = document.getElementById('logout-btn-container');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Register function
function register() {
  const email = registerEmail.value;
  const password = registerPassword.value;
  
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      storeUserData(user.uid, user.email); // Store user data in the database
      authContainer.style.display = 'none';
      logoutBtnContainer.style.display = 'block';
      startGame();
    })
    .catch((error) => {
      console.error("Error registering user: ", error);
    });
}

// Login function
function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;
  
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      authContainer.style.display = 'none';
      logoutBtnContainer.style.display = 'block';
      startGame();
    })
    .catch((error) => {
      console.error("Error logging in: ", error);
    });
}

// Logout function
function logout() {
  signOut(auth)
    .then(() => {
      authContainer.style.display = 'block';
      logoutBtnContainer.style.display = 'none';
      gameContainer.style.display = 'none';
    })
    .catch((error) => {
      console.error("Error logging out: ", error);
    });
}

// Store user data in Firebase Database
function storeUserData(uid, email) {
  const userRef = ref(db, 'users/' + uid);
  set(userRef, {
    email: email,
    completedPassages: 0,
    totalScore: 0
  });
}

// Fetch passages from the database
function fetchPassages() {
  const passagesRef = ref(db, 'passages');
  return get(passagesRef);
}

// Start the game by fetching a passage
function startGame() {
  fetchPassages()
    .then((snapshot) => {
      const passages = snapshot.val();
      const passage = passages[0]; // For now, just use the first passage
      displayPassage(passage);
      startTimer();
    })
    .catch((error) => {
      console.error("Error fetching passages: ", error);
    });
}

// Display the passage and replace blanks with input fields
function displayPassage(passage) {
  gameContainer.innerHTML = `
    <h3>${passage.title}</h3>
    <p id="passage">${passage.passage.replace(/_/g, '<input type="text" maxlength="1" class="blank" />')}</p>
    <button onclick="submitAnswers()">Submit Answers</button>
  `;
  gameContainer.style.display = 'block';
}

// Timer functionality
let timer;
let timeLeft = 180; // 3 minutes

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitAnswers();
    } else {
      timeLeft--;
      document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;
    }
  }, 1000);
}

// Submit answers
function submitAnswers() {
  const inputs = document.querySelectorAll('.blank');
  inputs.forEach((input, index) => {
    const correctLetter = getCorrectLetter(index); // Function to fetch the correct letter based on index
    if (input.value.toLowerCase() === correctLetter) {
      input.style.backgroundColor = "green";
    } else {
      input.style.backgroundColor = "red";
    }
  });
}

// Function to get the correct letter for a specific blank
function getCorrectLetter(index) {
  const correctAnswers = ['s', 'p', 'a', 'c', 'e', 'y', 'o', 'u', 'l', 'i', 'b', 'r', 'a', 'r', 'i', 'e', 's']; // Example correct answers
  return correctAnswers[index];
}
