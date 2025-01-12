document.addEventListener('DOMContentLoaded', function() {
    const startGameButton = document.getElementById('start-game-button');
    const submitButton = document.getElementById('submit-button');
    const nextPassageButton = document.getElementById('next-passage-button');
    const passageContainer = document.getElementById('passage-container');
    const timerDisplay = document.getElementById('timer');
    const passageTitle = document.getElementById('passage-title');
    const passageText = document.getElementById('passage-text');

    let passages = [];
    let currentPassageIndex = 0;
    let timer;

    // Initially hide the timer
    timerDisplay.style.display = 'none';
    submitButton.style.display = 'none';
    nextPassageButton.style.display = 'none';

    // Fetch the passages when the game starts
    function fetchPassages() {
        fetch('passages.json')
            .then(response => response.json())
            .then(data => {
                passages = data;
                showPassage(); // Show the first passage
            })
            .catch(error => {
                console.error('Error fetching passages:', error);
            });
    }

    // Display the current passage
    function showPassage() {
        if (currentPassageIndex < passages.length) {
            const passage = passages[currentPassageIndex];
            passageTitle.textContent = passage.title;
            passageText.textContent = passage.text;
            createAnswerFields(passage.text); // Create answer input fields based on the passage text
            startTimer(); // Start the timer for this passage
            submitButton.style.display = 'inline-block'; // Show the Submit button
            nextPassageButton.style.display = 'none'; // Hide Next Passage button until after submission
        } else {
            endGame(); // End the game when all passages are completed
        }
    }

    // Dynamically create input fields for blanks in the passage
    function createAnswerFields(passageText) {
        const blanks = passageText.match(/__+/g);
        let passageWithInputs = passageText;
        
        blanks.forEach((blank, index) => {
            passageWithInputs = passageWithInputs.replace(blank, `<input type="text" id="blank-${index}" class="blank" maxlength="${blank.length}" />`);
        });

        passageContainer.innerHTML = `
            <h2>${passageTitle.textContent}</h2>
            <p>${passageWithInputs}</p>
        `;
    }

    // Start the timer for each passage
    function startTimer() {
        let timeLeft = 180; // 3 minutes in seconds
        timerDisplay.style.display = 'inline-block'; // Show the timer
        timerDisplay.innerHTML = `Time Left: ${formatTime(timeLeft)} seconds`;

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.innerHTML = `Time Left: ${formatTime(timeLeft)} seconds`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                submitAnswer(); // Submit automatically when the time runs out
            }
        }, 1000);
    }

    // Format the timer display as M:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Submit the current answer and show the Next Passage button
    function submitAnswer() {
        clearInterval(timer);
        submitButton.style.display = 'none'; // Hide the Submit button
        nextPassageButton.style.display = 'inline-block'; // Show the Next Passage button
    }

    // Show the next passage when the button is clicked
    nextPassageButton.addEventListener('click', function() {
        currentPassageIndex++;
        showPassage();
    });

    // Start the game when the Start button is clicked
    startGameButton.addEventListener('click', function() {
        fetchPassages();
        startGameButton.style.display = 'none'; // Hide the Start Game button
    });

    // End the game and show a completion message
    function endGame() {
        passageContainer.innerHTML = "<h2>You've completed all of the passages! Good job!</h2>";
        timerDisplay.style.display = 'none'; // Hide the timer when game ends
        submitButton.style.display = 'none'; // Hide the submit button
        nextPassageButton.style.display = 'none'; // Hide the next passage button
    }
});
