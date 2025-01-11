import { auth, googleSignIn, registerUser, loginUser, logoutUser, fetchPassages } from './firebase.js';

const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");
const googleLoginButton = document.getElementById("googleLoginButton");
const startGameButton = document.getElementById("startGameButton");
const welcomeMessage = document.getElementById("welcomeMessage");

registerButton.addEventListener("click", async () => {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  try {
    await registerUser(email, password);
    alert("Registration successful!");
  } catch (error) {
    console.error("Error during registration:", error);
  }
});

loginButton.addEventListener("click", async () => {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  try {
    const user = await loginUser(email, password);
    console.log("Logged in user:", user);
    welcomeMessage.innerText = `Welcome, ${user.displayName}!`;
    showGameInterface();
  } catch (error) {
    console.error("Error during login:", error);
    alert("Login failed!");
  }
});

googleLoginButton.addEventListener("click", async () => {
  try {
    const user = await googleSignIn();
    console.log("Logged in with Google:", user);
    welcomeMessage.innerText = `Welcome, ${user.displayName}!`;
    showGameInterface();
  } catch (error) {
    console.error("Error during Google login:", error);
  }
});

startGameButton.addEventListener("click", () => {
  showGameInterface();
});

function showGameInterface() {
  fetchPassages()
    .then((passages) => {
      console.log("Passages:", passages);
      // Show game interface and passages here
    })
    .catch((error) => {
      console.error("Error loading passages:", error);
    });
}
