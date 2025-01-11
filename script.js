document.addEventListener('DOMContentLoaded', () => {
  const registerButton = document.getElementById('registerButton');
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  
  // Check if buttons exist
  if (registerButton) {
    registerButton.addEventListener('click', registerUser);
  }
  
  if (loginButton) {
    loginButton.addEventListener('click', loginUserHandler);
  }
  
  if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
  }
});

// Function to register user
function registerUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      set(ref(database, 'users/' + user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email
      }).then(() => {
        alert('User registered successfully');
        showGameInterface(); // Proceed to game
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Function to log in the user
function loginUserHandler() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      showGameInterface(); // Proceed to game
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Function to log out the user
function logoutUser() {
  signOut(auth)
    .then(() => {
      alert('User logged out');
      showLoginRegisterForm(); // Show login/register form
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}
