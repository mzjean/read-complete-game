import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const auth = getAuth();
const db = getDatabase();

// Register user
document.getElementById("registerButton").addEventListener("click", async () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userId = user.uid;
        
        // Store user data in Realtime Database
        set(ref(db, 'users/' + userId), {
            username: firstName + " " + lastName,
            email: email
        });
        
        // Redirect to the logged-in page
        displayUserPage();
    } catch (error) {
        console.error(error.message);
    }
});

// Google Login
document.getElementById("googleLoginButton").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userId = user.uid;
        
        // Store user data in Realtime Database
        set(ref(db, 'users/' + userId), {
            username: user.displayName,
            email: user.email
        });
        
        // Redirect to the logged-in page
        displayUserPage();
    } catch (error) {
        console.error(error.message);
    }
});

// Login user
document.getElementById("loginButton").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        displayUserPage();
    } catch (error) {
        console.error(error.message);
    }
});

// Logout user
document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        await signOut(auth);
        displayLoginPage();
    } catch (error) {
        console.error(error.message);
    }
});

// Monitor user authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        displayUserPage(user);
    } else {
        displayLoginPage();
    }
});

// Display the logged-in user's page
function displayUserPage(user) {
    document.getElementById("userPage").style.display = "block";
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("userName").textContent = user.displayName || user.email; // Use user's displayName or email
}

// Display the login page
function displayLoginPage() {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("userPage").style.display = "none";
}
