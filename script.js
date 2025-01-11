// Define the startGame function
function startGame() {
  const startButton = document.getElementById('start-game-button');
  startButton.style.display = 'none';  // Hide the start game button once clicked
  
  const passageContainer = document.getElementById('passage-container');
  passageContainer.style.display = 'block';  // Show the passage container

  // Call function to display the first passage
  showPassage();
}

// Fetch passages from the local JSON file
async function fetchPassages() {
  try {
    const response = await fetch('passages.json');  // Fetch from the local JSON file
    const data = await response.json();
    return data;  // Return the parsed JSON data
  } catch (error) {
    console.error('Error fetching passages:', error);
  }
}

let passages = []; // To store the passages data
let currentPassageIndex = 0; // Keeps track of the current passage

// Load the first passage when the page is ready
window.onload = async () => {
  passages = await fetchPassages();  // Fetch and store the passages
  showPassage();  // Show the first passage
}

// Display a passage
function showPassage() {
  const passage = passages[currentPassageIndex]; // Get the current passage
  if (!passage) return;

  const passageTitle = document.getElementById('passage-title');
  const passageText = document.getElementById('passage-text');
  const submitButton = document.getElementById('submit-button');

  // Set the title and passage text
  passageTitle.textContent = passage.title;
  passageText.textContent = passage.passage;

  // Show the submit button only after the passage is displayed
  submitButton.style.display = 'block';

  // Set up event listener for the submit button
  submitButton.onclick = function () {
    checkAnswers(passage);  // Check answers when the user submits
  };
}

// Check answers for the current passage
function checkAnswers(passage) {
  const blanks = document.querySelectorAll('.blank'); // Get all blanks in the passage
  let correctAnswers = 0;

  blanks.forEach((blank, index) => {
    const userAnswer = blank.value.trim().toLowerCase();
    if (userAnswer === passage.answers[index].toLowerCase()) {
      correctAnswers++;
      blank.style.backgroundColor = 'lightgreen'; // Correct answer
    } else {
      blank.style.backgroundColor = 'red'; // Incorrect answer
    }
  });

  // Show feedback based on correct answers
  alert(`You got ${correctAnswers} out of ${passage.answers.length} correct!`);
  
  // Move to the next passage or end the game
  if (currentPassageIndex < passages.length - 1) {
    currentPassageIndex++;
    showPassage();
  } else {
    alert("You've completed all the passages!");
  }
}
