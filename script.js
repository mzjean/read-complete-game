document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const startButton = document.getElementById("start-button");
    const submitButton = document.getElementById("submit-button");
    const nextButton = document.getElementById("next-button");
    const passageTitle = document.getElementById("passage-title");
    const passageText = document.getElementById("passage-text");
    const timerDisplay = document.getElementById("timer");
    const resultDisplay = document.getElementById("result");
    const analyticsDisplay = document.getElementById("analytics");
    const body = document.body;

    // Add dark mode toggle
    const darkModeToggle = document.createElement("button");
    darkModeToggle.textContent = "Toggle Dark Mode";
    darkModeToggle.id = "dark-mode-toggle";
    darkModeToggle.style.marginTop = "20px";
    body.appendChild(darkModeToggle);

    let currentPassageIndex = 0;
    let timerInterval;
    let timer = 180; // 3 minutes in seconds
    let passages = [];
    let circle; // For circular timer

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

    // Initialize circular timer
    const initCircularTimer = () => {
        timerDisplay.style.display = "block";
        timerDisplay.innerHTML = `
            <div class="circular-timer">
                <svg width="100" height="100">
                    <circle class="timer-background" cx="50" cy="50" r="45"></circle>
                    <circle class="timer-foreground" cx="50" cy="50" r="45" style="stroke-dasharray: 283; stroke-dashoffset: 0;"></circle>
                </svg>
            </div>
        `;
        circle = document.querySelector(".timer-foreground");
    };

    const updateCircularTimer = () => {
        const totalTime = 180; // Total timer duration
        const dashArray = 283; // Circumference of the circle
        const dashOffset = (timer / totalTime) * dashArray;
        circle.style.strokeDashoffset = dashOffset;

        // Change timer color in the last 10 seconds
        if (timer <= 10) {
            circle.style.stroke = "#ff0000";
        } else {
            circle.style.stroke = "#073055ff";
        }
    };

    const startTimer = () => {
        timer = 180; // Reset timer
        updateCircularTimer();
        timerInterval = setInterval(() => {
            timer--;
            updateCircularTimer();
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
            const textWithBlanks = passage.text.split("").map((char, index) => {
                return char === "_" ? `<input type="text" maxlength="1" data-index="${index}" />` : char;
            }).join("");
            passageText.innerHTML = textWithBlanks;

            // Show the Submit button
            submitButton.style.display = "inline-block";
        }
    };

    const autoSubmit = () => {
        const inputs = document.querySelectorAll("#passage-text input");
        const passage = passages[currentPassageIndex];
        let correctCount = 0;

        inputs.forEach((input, idx) => {
            const answer = passage.answers[idx];
            if (input.value.toLowerCase() === answer) {
                correctCount++;
                input.classList.add("correct");
            } else {
                input.classList.add("incorrect");
                input.value = answer; // Show correct answer
            }
        });

        const total = passage.answers.length;
        const accuracy = Math.round((correctCount / total) * 100);
        resultDisplay.textContent = `You answered ${accuracy}% of the blanks correctly!`;

        // Hide Submit and show Next
        submitButton.style.display = "none";
        nextButton.style.display = "inline-block";
    };

    startButton.addEventListener("click", () => {
        startButton.style.display = "none"; // Hide Start button
        resultDisplay.textContent = "";
        analyticsDisplay.style.display = "none";
        loadPassage();
        initCircularTimer(); // Initialize the circular timer
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
            timerDisplay.innerHTML = ""; // Reset the timer display
            loadPassage();
            initCircularTimer();
            startTimer();
        } else {
            resultDisplay.textContent = "You've completed all passages!";
            analyticsDisplay.style.display = "block";
            nextButton.style.display = "none";
        }
    });

    // Dark Mode Toggle
    darkModeToggle.addEventListener("click", () => {
        if (body.classList.contains("dark-mode")) {
            body.classList.remove("dark-mode");
            darkModeToggle.textContent = "Toggle Dark Mode";
        } else {
            body.classList.add("dark-mode");
            darkModeToggle.textContent = "Toggle Light Mode";
        }
    });
});
