import { auth, loginUser, logoutUser, fetchPassages } from './firebase.js';

const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const startButton = document.getElementById('startButton');
const userNameSpan = document.getElementById('user-name');
const gameContainer = document.getElementById('game-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const goToRegisterButton = document.getElementById('goToRegisterButton');
const goToLoginButton = document.getElementById('goToLoginButton');

// Listen for login button click
loginButton.addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await loginUser(email, password);
    console.log("User logged in:", userCredential);
    displayUserInfo(userCredential.user);
  } catch (error) {
    alert('Error logging in: ' + error.message);
  }
});

// Listen for register button click
registerButton.addEventListener('click', async () => {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const firstName = document.getElementById('register-first-name').value;
  const lastName = document.getElementById('register-last-name').value;

  try {
    const userCredential = await registerUser(email, password);
    console.log("User registered:", userCredential);

    // Add the user details (name) to the database
    const userRef = ref(db, 'users/' + userCredential.user.uid);
    await set(userRef, {
      username: `${firstName} ${lastName}`,
      email: email,
    });

    displayUserInfo(userCredential.user);
  } catch (error) {
    alert('Error registering: ' + error.message);
  }
});

// Show user info after login or registration
function displayUserInfo(user) {
  // Show username in the UI
  const usernameRef = ref(db, 'users/' + user.uid + '/username');
  get(usernameRef).then(snapshot => {
    const username = snapshot.val();
    if (username) {
      userNameSpan.innerText = username;
    }
  });

  loginForm.style.display = 'none';
  registerForm.style.display = 'none';
  gameContainer.style.display = 'block';
  console.log('User logged in: ' + user.email);
}

// Go to Register Form
goToRegisterButton.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});

// Go to Login Form
goToLoginButton.addEventListener('click', () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Start Game
startButton.addEventListener('click', async () => {
  const passages = await fetchPassages();
  if (passages.length > 0) {
    startGame(passages);
  }
});

// Game Start Logic
function startGame(passages) {
  console.log("Starting game...");
  // Display the first passage and game content
  const passage = passages[0]; // Get the first passage from the database
  document.getElementById('passage-title').innerText = passage.title;
  document.getElementById('passage-text').innerText = passage.text;
  document.getElementById('game-content').style.display = 'block';
}
