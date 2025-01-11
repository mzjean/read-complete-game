// Get the elements for game interface
const gameContainer = document.getElementById('game-container');
const authContainer = document.getElementById('auth-container');
const logoutBtnContainer = document.getElementById('logout-btn-container');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

// Register function
function register() {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  registerUser(email, password)
    .then((userCredential) => {
      // Register successful, store user data
      const user = userCredential.user;
      storeUserData(user.uid, user.displayName, user.email);
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
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  loginUser(email, password)
    .then((userCredential) => {
      // Login successful
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
  logoutUser()
    .then(() => {
      authContainer.style.display = 'block';
      logoutBtnContainer.style.display = 'none';
      gameContainer.style.display = 'none';
    })
    .catch((error) => {
      console.error("Error logging out: ", error);
    });
}

// Fetch and display the passage
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

// Display passage and blanks
function displayPassage(passage) {
  gameContainer.innerHTML = `
    <h3>${passage.title}</h3>
    <p id="passage">${passage.passage.replace(/_/g, '<input type="text" maxlength="1" />')}</p>
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
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach((input, index) => {
    const correctLetter = "a"; // Replace with actual correct answers
    if (input.value.toLowerCase() === correctLetter) {
      input.style.backgroundColor = "green";
    } else {
      input.style.backgroundColor = "red";
    }
  });
}