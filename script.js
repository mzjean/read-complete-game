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
        .catch((error) => {
            console.error("Error fetching passages:", error);
            resultDisplay.textContent = "Failed to load passages. Please try again later.";
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
        timerDisplay.style.display = "block";
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
        const passage = passages[currentPassageIndex];
        passageTitle.textContent = passage.title;
        passageText.innerHTML = passage.text;
    };

    const autoSubmit = () => {
        // Logic for auto-submitting the answer
        resultDisplay.textContent = "Time's up! Your answer has been submitted.";
        nextButton.style.display = "block";
    };

    startButton.addEventListener("click", () => {
        startButton.style.display = "none";
        submitButton.style.display = "block";
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
