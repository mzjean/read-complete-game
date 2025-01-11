import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, getDatabase, ref, set } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const gameContainer = document.getElementById('game-container');
    const userNameDisplay = document.getElementById('user-name');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const goToRegisterButton = document.getElementById('goToRegisterButton');
    const goToLoginButton = document.getElementById('goToLoginButton');
    const startButton = document.getElementById('startButton');
    const passageTitle = document.getElementById('passage-title');
    const passageText = document.getElementById('passage-text');
    const inputsContainer = document.getElementById('inputs-container');
    const timerElement = document.getElementById('timer');
    let currentUser = null;
    let passages = [];

    const startGame = () => {
        document.getElementById('start-container').style.display = 'none';
        document.getElementById('game-content').style.display = 'block';
        // Load passage and display
        const randomPassage = passages[Math.floor(Math.random() * passages.length)];
        passageTitle.textContent = randomPassage.title;
        passageText.textContent = randomPassage.passage;
        loadInputs(randomPassage.answers);
        startTimer();
    };

    const loadInputs = (answers) => {
        // Generate inputs for each answer
        inputsContainer.innerHTML = '';
        answers.forEach((answer, index) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `input-${index}`;
            input.placeholder = 'Type here...';
            inputsContainer.appendChild(input);
        });
    };

    const startTimer = () => {
        let timer = 60; // 60 seconds timer
        const timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                timerElement.textContent = `${timer} seconds remaining`;
            } else {
                clearInterval(timerInterval);
                submitAnswers();
            }
        }, 1000);
    };

    const submitAnswers = () => {
        const inputs = document.querySelectorAll('input');
        let score = 0;
        inputs.forEach((input, index) => {
            const correctAnswer = passages[0].answers[index];
            if (input.value.toLowerCase() === correctAnswer.toLowerCase()) {
                score++;
                input.style.backgroundColor = 'lightgreen';
            } else {
                input.style.backgroundColor = 'red';
            }
        });
        alert(`Your score is ${score} out of ${inputs.length}`);
    };

    const loginUserHandler = async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            currentUser = userCredential.user;
            const userRef = ref(db, 'users/' + currentUser.uid);
            userRef.once('value', snapshot => {
                const userData = snapshot.val();
                userNameDisplay.textContent = `Welcome, ${userData.username.split(' ')[0]}`; // Display first name
            });
            loginForm.style.display = 'none';
            gameContainer.style.display = 'block';
            console.log('Logged in');
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    const registerUserHandler = async () => {
        const firstName = document.getElementById('register-first-name').value;
        const lastName = document.getElementById('register-last-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            currentUser = userCredential.user;
            await set(ref(db, 'users/' + currentUser.uid), {
                username: firstName + ' ' + lastName,
                email: email
            });
            userNameDisplay.textContent = `Welcome, ${firstName}`; // Display first name
            registerForm.style.display = 'none';
            gameContainer.style.display = 'block';
            console.log('User registered');
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    };

    // Event Listeners
    loginButton.addEventListener('click', loginUserHandler);
    registerButton.addEventListener('click', registerUserHandler);
    goToRegisterButton.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
    goToLoginButton.addEventListener('click', () => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    startButton.addEventListener('click', startGame);

    // Load passages
    fetch('https://raw.githubusercontent.com/mzjean/read-complete-game/refs/heads/main/passages.json')
        .then(response => response.json())
        .then(data => {
            passages = data;
        })
        .catch(error => console.error('Error loading passages:', error));
});
