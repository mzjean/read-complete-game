// Initialize Firebase
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

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Register new user
document.getElementById('registerButton').addEventListener('click', async () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Store user info in Realtime Database
        firebase.database().ref('users/' + user.uid).set({
            username: firstName + " " + lastName,
            email: email
        });

        // Auto-login the user after registration
        console.log('User registered:', user);
        alert('Registration successful!');
        // Redirect or show logged-in screen here
    } catch (error) {
        console.error('Error registering user:', error);
        alert(error.message);
    }
});

// Google login
document.getElementById('googleLoginButton').addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;

        // Store user info in Realtime Database
        firebase.database().ref('users/' + user.uid).set({
            username: user.displayName,
            email: user.email
        });

        console.log('User logged in with Google:', user);
        alert('Google login successful!');
        // Redirect or show logged-in screen here
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
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('User logged in:', user);
        alert('Login successful!');
        // Redirect or show logged-in screen here
    } catch (error) {
        console.error('Error logging in user:', error);
        alert(error.message);
    }
});

// Logout user
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        await firebase.auth().signOut();
        console.log('User logged out');
        alert('Logged out successfully!');
        // Redirect or show login screen
    } catch (error) {
        console.error('Error logging out:', error);
        alert(error.message);
    }
});
