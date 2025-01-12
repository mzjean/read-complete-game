document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const startButton = document.getElementById("start-button");
    const submitButton = document.getElementById("submit-button");
    const nextButton = document.getElementById("next-button");
    const passageContainer = document.getElementById("passage-container");
    const passageTitle = document.getElementById("passage-title");
    const passageText = document.getElementById("passage-text");
    const timerDisplay = document.getElementById("timer");
    const resultDisplay = document.getElementById("result");
    const analyticsDisplay = document.getElementById("analytics");
    const body = document.body;

    const darkModeToggle = document.getElementById("dark-mode-toggle");

    let currentPassageIndex = 0;
    let timerInterval;
    let timer = 180; // 3 minutes in seconds
    let passages = [];

    // Hide timer initially
    timerDisplay.style.display = "none";

    // Fetch passages from passages.json
    fetch("passages.json")
        .then((response) => response.json())
        .then((data) => {
            passages = data;
        })
        .catch((error) => {
            console.error("Error fetching passages:", error);
        });

    const updateTimerDisplay = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        // Change timer color in the last 10 seconds
        if (timer <= 10) {
            timerDisplay.classList.add("red");
        } else {
            timerDisplay.classList.remove("red");
        }
    };

    const startTimer = () => {
        timer = 180; // Reset timer
        updateTimerDisplay();
        timerDisplay.style.display = "block"; // Show the timer
        timerInterval = setInterval(() => {
            timer--;
            updateTimerDisplay();
            if (timer <= 0) {
                clearInterval(timerInterval);
                autoSubmit();
            }
        }, 1000);
    };

    const loadPassage = () => {
        if (currentPassageIndex < passages.length) {
            const passage = passages[currentPassageIndex];
            passageTitle.textContent = passage.title;
            const textWithBlanks = passage.text.replace(/_+/g, (match) => {
                const numFields = match.length; // Number of underscores
                let inputFields = "";
                for (let i = 0; i < numFields; i++) {
                    inputFields += `<input type="text" maxlength="1" class="blank" />`;
                }
                return `<span class="input-group">${inputFields}</span>`;
            });
            passageText.innerHTML = textWithBlanks;

            // Show the Submit button
            submitButton.style.display = "inline-block";
        }
    };

    const autoSubmit = () => {
        const inputGroups = document.querySelectorAll(".input-group");
        const passage = passages[currentPassageIndex];
        const correctAnswers = passage.answers;

        let userAnswers = [];
        inputGroups.forEach((group) => {
            const inputs = Array.from(group.querySelectorAll(".blank")); // Convert NodeList to Array
            let groupAnswer = inputs.map((input) => input.value.toLowerCase()).join("");
            userAnswers.push(groupAnswer);
        });

        // Check answers
        inputGroups.forEach((group, index) => {
            const inputs = Array.from(group.querySelectorAll(".blank")); // Convert NodeList to Array
            const isCorrect = userAnswers[index] === correctAnswers[index];

            inputs.forEach((input, inputIndex) => {
                input.disabled = true;
                input.classList.add(isCorrect ? "correct" : "incorrect");

                if (!isCorrect) {
                    input.value = correctAnswers[index][inputIndex];
                }
            });
        });

        const total = correctAnswers.length;
        const accuracy = Math.round(
            (userAnswers.filter((ans, idx) => ans === correctAnswers[idx]).length / total) * 100
        );
        resultDisplay.textContent = `You answered ${accuracy}% of the blanks correctly!`;

        // Hide Submit and show Next
        submitButton.style.display = "none";
        nextButton.style.display = "inline-block";
    };

    startButton.addEventListener("click", () => {
        startButton.style.display = "none"; // Hide Start button
        resultDisplay.textContent = "";
        analyticsDisplay.style.display = "none";
        passageContainer.style.display = "block"; // Ensure the container is visible
        loadPassage();
        startTimer();
    });

    submitButton.addEventListener("click", () => {
        clearInterval(timerInterval); // Stop the timer
        autoSubmit();
    });

    nextButton.addEventListener("click", () => {
        if (currentPassageIndex < passages.length - 1) {
            currentPassageIndex++;
            nextButton.style.display = "none";
            resultDisplay.textContent = "";
            analyticsDisplay.style.display = "none";
            passageTitle.textContent = "";
            passageText.innerHTML = "";
            timerDisplay.textContent = "3:00";
            loadPassage();
            startTimer();
        } else {
            // Hide passage container and buttons after the last passage
            passageContainer.style.display = "none"; // Completely hides the container
            nextButton.style.display = "none";
            timerDisplay.style.display = "none";

            // Show a completion message
            resultDisplay.textContent = "You've completed all passages! Well done!";
            analyticsDisplay.style.display = "block";
            analyticsDisplay.textContent = "Your performance analytics will appear here.";
        }
    });

    // Dark Mode Toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener("change", () => {
            if (darkModeToggle.checked) {
                body.classList.add("dark-mode");
            } else {
                body.classList.remove("dark-mode");
            }
        });
    }
});
