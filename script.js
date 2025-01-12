/* General Styling */
body {
    font-family: 'Poppins', Arial, sans-serif;
    background-color: #ffffff;
    color: #073055ff;
    margin: 0;
    padding: 0;
}

header {
    text-align: center;
    background-color: #ffc802ff;
    padding: 20px;
    border-bottom: 2px solid #e5e5e5ff;
    letter-spacing: 0.05em; /* Adds kerning to header text */
}

h1, h2 {
    font-family: 'Montserrat', Arial, sans-serif;
    font-weight: bold;
    letter-spacing: 0.1em; /* Adds more kerning to headings */
}

h1 {
    font-size: 2rem;
    margin-bottom: 10px;
}

h2 {
    font-size: 1.5rem;
    color: #073055ff;
    margin-bottom: 15px;
}

/* Game Container */
.game-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    text-align: center;
    line-height: 1.6; /* Adds spacing between lines for better readability */
}

/* Timer */
#timer {
    margin: 20px auto;
    font-size: 2rem;
    font-weight: bold;
    color: #073055ff;
    letter-spacing: 0.05em; /* Kerning for the timer */
}

#timer.red {
    color: #ff0000; /* Change color to red in the last 10 seconds */
}

/* Buttons */
button {
    background-color: #073055ff;
    color: #ffffff;
    padding: 8px 16px; /* Reduced padding for sleeker buttons */
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 0.95rem;
    letter-spacing: 0.05em; /* Kerning for button text */
    transition: transform 0.2s, background-color 0.3s;
    display: inline-block;
    margin: 10px 5px; /* Adds spacing between buttons */
}

button:hover {
    background-color: #6d7681ff;
    transform: scale(1.05);
}

button:active {
    transform: scale(0.98);
}

button[disabled] {
    display: none; /* Hide disabled buttons */
}

/* Inputs */
input[type="text"] {
    border: 1.5px solid #e5e5e5ff; /* Slightly thinner border */
    border-radius: 5px;
    padding: 3px 5px; /* Reduced padding for smaller fields */
    font-size: 0.9rem; /* Smaller font size */
    width: 25px; /* Reduced width for smaller fields */
    text-align: center;
    margin: 0 2px; /* Adds spacing between input fields */
}

input.correct {
    border-color: #28a745; /* Green for correct */
    background-color: #d4edda;
}

input.incorrect {
    border-color: #dc3545; /* Red for incorrect */
    background-color: #f8d7da;
}

/* Dark Mode */
body.dark-mode {
    background-color: #1e1e1e;
    color: #ffffff;
}

body.dark-mode header {
    background-color: #073055ff;
    color: #ffffff;
}

body.dark-mode h1, body.dark-mode h2 {
    color: #fce08bff; /* Light yellow for headings in dark mode */
}

body.dark-mode button {
    background-color: #ffc802ff;
    color: #073055ff;
}

body.dark-mode button:hover {
    background-color: #fce08bff;
}

body.dark-mode input[type="text"] {
    background-color: #333333;
    color: #ffffff;
    border: 2px solid #6d7681ff;
}

/* Dark Mode Toggle */
#dark-mode-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

#dark-mode-label {
    font-size: 1rem;
    margin-right: 10px;
    color: #073055ff;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e5e5ff;
    transition: 0.4s;
    border-radius: 30px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    border-radius: 50%;
    background-color: white;
    bottom: 4px;
    left: 4px;
    transition: 0.4s;
}

input:checked + .slider {
    background-color: #073055ff;
}

input:checked + .slider:before {
    transform: translateX(30px);
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

#passage-container {
    animation: fadeIn 0.5s ease;
}

/* Responsive Design */
@media screen and (max-width: 600px) {
    h1 {
        font-size: 1.5rem;
    }

    h2 {
        font-size: 1.2rem;
    }

    button {
        font-size: 0.9rem;
        padding: 6px 12px;
    }

    .game-container {
        padding: 10px;
    }
}
