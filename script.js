document.addEventListener('DOMContentLoaded', function() {
    const startGameButton = document.getElementById('start-game-button');
    const submitButton = document.getElementById('submit-button');
    const nextPassageButton = document.getElementById('next-passage-button');
    const timerDisplay = document.getElementById('timer');
    const passageContent = document.getElementById('passage-content');
    let passages = [];
    let currentPassageIndex = 0;
    let timer;
    
    // Initially hide timer and buttons
    timerDisplay.style.display = 'none';
    submitButton.style.display = 'none';
    nextPassageButton.style.display = 'none';

    // Fetch passages from the JSON file
    function fetchPassages() {
        const passagesData = [
            {
                "id": 1,
                "title": "A Day at the Park",
                "text": "It was a s__nny day in the p__rk. The b__rds were ch__rping.",
                "answers": ["u", "a", "e", "i"]
            },
            {
                "id": 2,
                "title": "The Importance of Exercise",
                "text": "Ex__rcise is imp__rtant for your h__alth and w__ll-being.",
                "answers": ["e", "o", "e", "e"]
            }
        ];
        passages = passagesData;
        showPassage(); // Display the first passage
    }

    // Show the current passage and timer
    function showPassage() {
        if (currentPassageIndex < passages.length) {
            const passage = passages[currentPassageIndex];
            passageContent.innerHTML = `
                <h2>${passage.title}</h2>
                <p>${createAnswerFields(passage.text)}</p>
            `;
            startTimer(); // Start the timer for this passage
            submitButton.style.display = 'inline-block';
            nextPassageButton.style.display = 'none'; // Hide Next Passage button until after submission
        } else {
            endGame(); // End the game when all passages are completed
        }
    }

    // Create the input fields for blanks in the passage
    function createAnswerFields(text) {
        const blanks = text.match(/__+/g); // Match blanks in the text
        let passageWithInputs = text;

        blanks.forEach((blank, index) => {
            passageWithInputs = passageWithInputs.replace(blank, `<input type="text" id="blank-${index}" class="blank" maxlength="${blank.length}" />`);
        });

        return passageWithInputs;
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
        passageContent.innerHTML = "<h2>You've completed all of the passages! Good job!</h2>";
        timerDisplay.style.display = 'none'; // Hide the timer when game ends
        submitButton.style.display = 'none'; // Hide the submit button
        nextPassageButton.style.display = 'none'; // Hide the next passage button
    }
});
