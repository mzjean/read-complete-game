let passages = [];
let currentPassageIndex = 0;
let timerInterval;

// DOM elements
const passageContainer = document.getElementById("passage-container");
const passageTitle = document.getElementById("passage-title");
const passageText = document.getElementById("passage-text");
const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const submitButton = document.getElementById("submit-button");
const timerElement = document.getElementById("timer");

// Fetch passages from JSON
fetch("passages.json")
    .then((response) => response.json())
    .then((data) => {
        passages = data;
        console.log("Passages loaded:", passages); // Debugging to ensure loading
    })
    .catch((error) => {
        console.error("Error fetching passages:", error);
    });

// Render passage with input fields
function renderPassage() {
    const passage = passages[currentPassageIndex];
    passageTitle.textContent = passage.title;

    // Replace underscores with the correct number of input fields
    const textWithBlanks = passage.text.replace(/_+/g, (match) => {
        const numFields = match.length; // Number of underscores
        let inputFields = "";
        for (let i = 0; i < numFields; i++) {
            inputFields += `<input type="text" maxlength="1" class="blank" />`;
        }
        return inputFields; // Insert the appropriate number of fields
    });

    passageText.innerHTML = textWithBlanks;
}

// Start the timer
function startTimer() {
    let timeLeft = 180; // 3 minutes
    timerElement.style.display = "block";
    timerElement.style.color = ""; // Reset timer color

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        // Change timer color to red when <= 10 seconds
        if (timeLeft <= 10) {
            timerElement.style.color = "red";
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Submitting answers.");
            handleSubmit();
        }

        timeLeft--;
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerElement.style.color = ""; // Reset timer color
}

// Handle start button
startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    nextButton.style.display = "none";
    submitButton.style.display = "block";
    renderPassage();
    startTimer();
});

// Handle submit button
submitButton.addEventListener("click", () => {
    handleSubmit();
    stopTimer(); // Stop the timer when user submits
});

function handleSubmit() {
    const inputs = document.querySelectorAll(".blank");
    const passage = passages[currentPassageIndex];
    const userAnswers = Array.from(inputs).map((input) => input.value.toLowerCase());
    const correctAnswers = passage.answers;

    // Check answers
    inputs.forEach((input, index) => {
        if (userAnswers[index] === correctAnswers[index]) {
            input.classList.add("correct");
        } else {
            input.classList.add("incorrect");
            input.value = correctAnswers[index]; // Show correct answer
        }
        input.disabled = true; // Disable inputs
    });

    submitButton.style.display = "none";
    nextButton.style.display = "block";
}

// Handle next button
nextButton.addEventListener("click", () => {
    if (currentPassageIndex < passages.length - 1) {
        currentPassageIndex++;
        renderPassage();
        submitButton.style.display = "block";
        nextButton.style.display = "none";
    } else {
        // End of passages
        passageTitle.textContent = "All passages completed!";
        passageText.innerHTML = "";
        nextButton.style.display = "none";
        timerElement.style.display = "none";
    }

    clearInterval(timerInterval); // Reset timer
    startTimer();
});
