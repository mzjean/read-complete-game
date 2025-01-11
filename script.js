import { auth, db, registerUser, loginUser, logoutUser, fetchPassages } from './firebase.js';

document.addEventListener("DOMContentLoaded", function() {
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');
    const goToLoginButton = document.getElementById('goToLoginButton');
    const goToRegisterButton = document.getElementById('goToRegisterButton');
    const startGameButton = document.getElementById('startGameButton');
    const welcomeUserName = document.getElementById('welcomeUserName');
    const authContainer = document.getElementById('auth-container');
    const gameContainer = document.getElementById('game-container');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    
    let currentUser = null;

    // Toggle between Login and Register forms
    goToLoginButton.addEventListener("click", function() {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
    });

    goToRegisterButton.addEventListener("click", function() {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    });

    // Register User
    registerButton.addEventListener("click", async function() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const userCredential = await registerUser(email, password);
            const user = userCredential.user;
            // Store user info in the Realtime Database
            await set(ref(db, 'users/' + user.uid), {
                username: firstName + " " + lastName,
                email: email
            });
            console.log('User registered:', user);
            loginUserHandler(user);
        } catch (error) {
            console.error("Error registering user:", error);
        }
    });

    // Login User
    loginButton.addEventListener("click", async function() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const userCredential = await loginUser(email, password);
            const user = userCredential.user;
            console.log("User logged in:", user);
            loginUserHandler(user);
        } catch (error) {
            console.error("Error logging in user:", error);
        }
    });

    // Handle login and show game interface
    function loginUserHandler(user) {
        currentUser = user;
        authContainer.style.display = "none";
        gameContainer.style.display = "block";
        welcomeUserName.textContent = currentUser.displayName || "User";
    }

    // Start the game
    startGameButton.addEventListener("click", function() {
        fetchPassages()
            .then(passage => {
                console.log("Passages loaded:", passage);
                // Implement your game logic here
            })
            .catch(error => {
                console.error("Error loading passages:", error);
            });
    });
});
