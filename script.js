// Get the user info
let currentUser = null;

// Toggle between Register and Login forms
function showRegisterForm() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

function showLoginForm() {
  document.getElementById("register-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}

// Handle registration
async function registerUserHandler() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  
  try {
    const userCredential = await registerUser(email, password);
    currentUser = userCredential.user;
    document.getElementById("user-name").textContent = currentUser.email.split('@')[0]; // Display email name
    showStartInterface();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Handle login
async function loginUserHandler() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await loginUser(email, password);
    currentUser = userCredential.user;
    document.getElementById("user-name").textContent = currentUser.email.split('@')[0]; // Display email name
    showStartInterface();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Show the start game interface after login
function showStartInterface() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  document.getElementById("start-container").style.display = "block";
}

// Start the game after the user clicks "Start Game"
function startGame() {
  document.getElementById("start-container").style.display = "none";
  document.getElementById("game-content").style.display = "block";
  loadPassage();
}

// Fetch and display a random passage
async function loadPassage() {
  try {
    const passages = await fetchPassages();
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];
    document.getElementById("passage-text").textContent = randomPassage.title;

    // Create input fields for the blanks
    let inputHTML = '';
    for (let i = 0; i < randomPassage.blanks.length; i++) {
      inputHTML += `<input type="text" id="blank-${i}" placeholder="_">`;
    }
    document.getElementById("inputs-container").innerHTML = inputHTML;
  } catch (error) {
    console.error("Error loading passage:", error);
  }
}

// Submit answers
function submitAnswers() {
  let correctAnswers = 0;
  const passage = document.getElementById("passage-text").textContent;
  
  // Check if user input matches passage blanks
  for (let i = 0; i < passage.length; i++) {
    const inputField = document.getElementById(`blank-${i}`);
    if (inputField.value.toLowerCase() === passage[i].toLowerCase()) {
      correctAnswers++;
      inputField.style.backgroundColor = 'green'; // Correct answer
    } else {
      inputField.style.backgroundColor = 'red'; // Incorrect answer
    }
  }

  alert(`You got ${correctAnswers} out of ${passage.length} correct!`);
}
