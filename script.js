let currentPassageIndex = 0;
let timerInterval;
let timer = 180; // 3 minutes in seconds

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const nextButton = document.getElementById("next-button");
    const passageTitle = document.getElementById("passage-title");
    const passageText = document.getElementById("passage-text");
    const timerDisplay = document.getElementById("timer");
    const resultDisplay = document.getElementById("result");
    const analyticsDisplay = document.getElementById("analytics");

    let passages = [];

    // Fetch passages from passages.json
    fetch("passages.json")
        .then((response) => response.json())
        .then((data) => {
            passages = data;
        });

    const updateTimerDisplay = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const startTimer = () => {
        timer = 180; // Reset timer
        updateTimerDisplay();
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
        let textWithBlanks = passage.text.split("").map((char, index) => {
            return char === "_" ? `<input type="text" maxlength="1" data-index="${index}" />` : char;
        }).join("");
        passageText.innerHTML = textWithBlanks;
    };

    const autoSubmit = () => {
        const inputs = document.querySelectorAll("#passage-text input");
        const passage = passages[currentPassageIndex];
        let correctCount = 0;

        inputs.forEach((input, idx) => {
            const answer = passage.answers[idx];
            if (input.value.toLowerCase() === answer) {
                correctCount++;
                input.style.backgroundColor = "#d4edda";
            } else {
                input.style.backgroundColor = "#f8d7da";
                input.value = answer; // Show correct answer
            }
        });

        const total = passage.answers.length;
        const accuracy = Math.round((correctCount / total) * 100);
        resultDisplay.textContent = `You answered ${accuracy}% of the blanks correctly!`;
        nextButton.disabled = false;
    };

    startButton.addEventListener("click", () => {
        startButton.disabled = true;
        nextButton.disabled = true;
        loadPassage();
        startTimer();
    });

    nextButton.addEventListener("click", () => {
        if (currentPassageIndex < passages.length - 1) {
            currentPassageIndex++;
            startButton.disabled = false;
            nextButton.disabled = true;
            resultDisplay.textContent = "";
            analyticsDisplay.style.display = "none";
            clearInterval(timerInterval);
            passageTitle.textContent = "";
            passageText.innerHTML = "";
            timerDisplay.textContent = "3:00";
        } else {
            resultDisplay.textContent = "You've completed all passages!";
            analyticsDisplay.style.display = "block";
        }
    });
});
