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
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    let currentPassageIndex = 0;
    let timerInterval;
    let timer = 180; // 3 minutes in seconds
    let passages = [];

    // Hide timer initially
    timerDisplay.style.display = "none";

    // Fetch passages from JSON
    fetch("passages.json")
        .then((response) => response.json())
        .then((data) => {
            passages = data;
        })
        .catch((error) => console.error("Error fetching passages:", error));

    const updateTimerDisplay = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        timerDisplay.classList.toggle("red", timer <= 10);
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

            const textWithBlanks = passage.text.split(/(_+)/).map((chunk) => {
                if (chunk.startsWith("_")) {
                    return `<span class="input-group">${Array(chunk.length)
                        .fill('<input type="text" maxlength="1" class="blank" />')
                        .join("")}</span>`;
                }
                return `<span class="plain-text">${chunk}</span>`; // Wrap plain text for consistency
            }).join("");

            passageText.innerHTML = textWithBlanks;

            // Add event listeners for input navigation
            const inputs = passageText.querySelectorAll("input.blank");
            inputs.forEach((input, index) => {
                input.addEventListener("input", () => {
                    if (input.value.length === 1 && index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                });

                input.addEventListener("keydown", (e) => {
                    if (e.key === "Backspace" && input.value === "" && index > 0) {
                        inputs[index - 1].focus();
                    }
                });
            });

            submitButton.style.display = "inline-block";
        }
    };

    const autoSubmit = () => {
        const inputs = document.querySelectorAll("#passage-text input");
        const passage = passages[currentPassageIndex];
        const correctAnswers = passage.answers;

        let correctCount = 0;

        inputs.forEach((input, idx) => {
            const answer = correctAnswers[idx];
            if (input.value.trim().toLowerCase() === answer.toLowerCase()) {
                correctCount++;
                input.classList.add("correct");
            } else {
                input.classList.add("incorrect");
                input.value = answer; // Populate correct answer in incorrect fields
            }
        });

        const total = correctAnswers.length;
        const accuracy = Math.round((correctCount / total) * 100);
        resultDisplay.textContent = `You answered ${accuracy}% of the blanks correctly!`;

        submitButton.style.display = "none";
        nextButton.style.display = "inline-block";
    };

    startButton.addEventListener("click", () => {
        startButton.style.display = "none"; // Hide Start button
        resultDisplay.textContent = "";
        analyticsDisplay.style.display = "none";
        passageContainer.style.display = "block";
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
            loadPassage();
            startTimer();
        } else {
            passageContainer.style.display = "none";
            nextButton.style.display = "none";
            timerDisplay.style.display = "none";
            resultDisplay.textContent = "You've completed all passages! Well done!";
            analyticsDisplay.style.display = "block";
            analyticsDisplay.textContent = "Your performance analytics will appear here.";
        }
    });

    // Dark mode toggle
    darkModeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });
});
