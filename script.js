// Initialize correct and incorrect counts from localStorage, or set to 0 if not present
let correctCount = parseInt(localStorage.getItem("correctCount")) || 0;
let incorrectCount = parseInt(localStorage.getItem("incorrectCount")) || 0;

// Update the displayed counts on the webpage
document.getElementById("correctCount").textContent = correctCount;
document.getElementById("incorrectCount").textContent = incorrectCount;

// Add an event listener for the "Start Quiz" button
document.getElementById("startQuizBtn").addEventListener("click", async function() {
    const difficulty = document.getElementById("difficulty").value; // Get selected difficulty level
    const apiUrl = `https://quizapi.io/api/v1/questions?apiKey=kE2vhRSS0DOi5IOyZVHjhaSHeSxwco6JbAtsoXSQ&limit=1&difficulty=${difficulty}`; // Construct API URL
    
    try {
        const response = await fetch(apiUrl); // Fetch quiz question
        const data = await response.json(); // Parse response JSON
        
        displayQuestion(data[0]); // Display the retrieved question
    } catch (error) {
        console.error("Error fetching question:", error); // Log any errors
    }
});

/*Function to display the fetched question 
 and answers */

function displayQuestion(questionData) {
    // Hide the difficulty selection form and show the question container
    document.getElementById("difficulty-form").style.display = "none";
    document.getElementById("question-container").style.display = "block";
    
    // Display the question text
    document.getElementById("question").textContent = questionData.question;
    
    const answersDiv = document.getElementById("answers"); // Get the answers container
    answersDiv.innerHTML = ""; // Clear any existing answers
    
    // Filter valid answers (exclude null values) and add them as buttons
    const answerKeys = Object.keys(questionData.answers).filter(key => questionData.answers[key] !== null);
    answerKeys.forEach(key => {
        const answerText = questionData.answers[key]; // Answer text
        const isCorrect = questionData.correct_answers[`${key}_correct`] === "true"; // Check if the answer is correct
        
        const button = document.createElement("button"); // Create a button element
        button.textContent = answerText; // Set button text
        button.dataset.correct = isCorrect; // Store correctness information in data attribute
        
        answersDiv.appendChild(button); // Append button to the answers container
    });
    
    document.getElementById("submitAnswerBtn").onclick = submitAnswer; // Set up answer submission
}

// Function to handle answer submission
function submitAnswer() {
    const selectedAnswer = document.querySelector("#answers button[data-selected='true']"); // Get the selected answer
    if (selectedAnswer) {
        const isCorrect = selectedAnswer.dataset.correct === "true"; // Check if the answer is correct
        
        if (isCorrect) {
            correctCount++; // Increment correct count
            alert("Correct!"); // Notify the user
        } else {
            incorrectCount++; // Increment incorrect count
            alert("Incorrect!"); // Notify the user
        }
        
        // Update localStorage with the new counts
        localStorage.setItem("correctCount", correctCount);
        localStorage.setItem("incorrectCount", incorrectCount);
        
        // Update the displayed counts
        document.getElementById("correctCount").textContent = correctCount;
        document.getElementById("incorrectCount").textContent = incorrectCount;
        
        // Reset the UI to show the difficulty selection form
        document.getElementById("question-container").style.display = "none";
        document.getElementById("difficulty-form").style.display = "block";
    } else {
        alert("Please select an answer!"); // Notify the user to select an answer
    }
}

// Event listener for answer button clicks
document.getElementById("answers").addEventListener("click", function(e) {
    if (e.target.tagName === "BUTTON") {
        // Deselect all answer buttons and select the clicked one
        document.querySelectorAll("#answers button").forEach(btn => btn.removeAttribute("data-selected"));
        e.target.setAttribute("data-selected", "true");
    }
});

// Event listener for the "Reset" button to reset counts
document.getElementById("resetBtn").addEventListener("click", function() {
    correctCount = 0; // Reset correct count
    incorrectCount = 0; // Reset incorrect count
    
    // Update localStorage with the reset counts
    localStorage.setItem("correctCount", correctCount);
    localStorage.setItem("incorrectCount", incorrectCount);
    
    // Update the displayed counts
    document.getElementById("correctCount").textContent = correctCount;
    document.getElementById("incorrectCount").textContent = incorrectCount;
});
