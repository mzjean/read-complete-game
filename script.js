import { auth, db, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from './firebase.js';

// DOM Elements
const registerPage = document.getElementById('registerPage');
const loginPage = document.getElementById('loginPage');
const userPage = document.getElementById('userPage');

// Check if the user is authenticated
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        registerPage.style.display = 'none';
        loginPage.style.display = 'none';
        userPage.style.display = 'block';
        document.getElementById('userName').textContent = user.displayName || 'User'; // Display username
    } else {
        // No user is signed in
        registerPage.style.display = 'block';
        loginPage.style.display = 'block';
        userPage.style.display = 'none';
    }
});

// Register new user
document.getElementById('registerButton').addEventListener('click', async () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user info in Realtime Database
        await set(ref(db, 'users/' + user.uid), {
            username: firstName + " " + lastName,
            email: email
        });

        // Auto-login the user after registration
        alert('Registration successful!');
        window.location.href = "/userPage"; // Redirect to logged-in user page
    } catch (error) {
        console.error('Error registering user:', error);
        alert(error.message);
    }
});

// Google login
document.getElementById('googleLoginButton').addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Store user info in Realtime Database
        await set(ref(db, 'users/' + user.uid), {
            username: user.displayName,
            email: user.email
        });

        console.log('User logged in with Google:', user);
        alert('Google login successful!');
        window.location.href = "/userPage"; // Redirect to logged-in user page
    } catch (error) {
        console.error('Error logging in with Google:', error);
        alert(error.message);
    }
});

// Login existing user
document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User logged in:', user);
        alert('Login successful!');
        window.location.href = "/userPage";  // Redirect to logged-in user page
    } catch (error) {
        console.error('Error logging in user:', error);
        alert(error.message);
    }
});

// Logout user
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log('User logged out');
        alert('Logged out successfully!');
        window.location.href = "/loginPage";  // Redirect to login page
    } catch (error) {
        console.error('Error logging out:', error);
        alert(error.message);
    }
});
