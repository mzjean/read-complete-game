document.addEventListener("DOMContentLoaded", function () {
    let timer;
    let timeRemaining = 180; // Set time to 3 minutes (in seconds)
    let timerRunning = false;

    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;
    const timerDisplay = document.getElementById("timer");

    // Dark mode toggle functionality
    darkModeToggle.addEventListener("change", function () {
        body.classList.toggle("dark-mode");
    });

    // Timer logic
    function startTimer() {
        if (timerRunning) return; // Prevent multiple timers
        timerRunning = true;
        timer = setInterval(() => {
            timeRemaining--;
            let minutes = Math.floor(timeRemaining / 60);
            let seconds = timeRemaining % 60;
            timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

            // Change color when time reaches 10 seconds
            if (timeRemaining <= 10) {
                timerDisplay.classList.add("red");
            }

            // When timer reaches 0, stop it and trigger submit
            if (timeRemaining <= 0) {
                clearInterval(timer);
                timerRunning = false;
                submitAnswers();
            }
        }, 1000);
    }

    // Start the timer when the start button is clicked
    document.getElementById("start-button").addEventListener("click", function () {
        startTimer();
        timerDisplay.style.display = "block"; // Show the timer
    });

    // Submit answers function
    function submitAnswers() {
        const inputs = document.querySelectorAll("input[type='text']");
        inputs.forEach(input => {
            const correctAnswer = input.getAttribute("data-correct-answer");
            if (input.value.toLowerCase() === correctAnswer) {
                input.classList.add("correct");
            } else {
                input.classList.add("incorrect");
            }
        });

        // Disable submit button and show next passage button
        document.getElementById("submit-button").disabled = true;
        document.getElementById("next-passage-button").style.display = "inline-block";
    }

    // Event listeners for input fields to automatically move to the next field
    const textFields = document.querySelectorAll("input[type='text']");
    textFields.forEach((field, index) => {
        field.addEventListener("input", function () {
            if (field.value.length === 1 && index < textFields.length - 1) {
                textFields[index + 1].focus(); // Automatically move to next field
            }
        });
    });

    // Next passage button logic
    document.getElementById("next-passage-button").addEventListener("click", function () {
        // Reset the game and proceed to the next passage
        document.getElementById("next-passage-button").style.display = "none";
        document.getElementById("submit-button").disabled = false;
        
        // Clear inputs and reset the timer
        const inputs = document.querySelectorAll("input[type='text']");
        inputs.forEach(input => input.value = "");
        timeRemaining = 180; // Reset to 3 minutes
        timerDisplay.classList.remove("red"); // Remove red timer class
        startTimer();
    });
});
