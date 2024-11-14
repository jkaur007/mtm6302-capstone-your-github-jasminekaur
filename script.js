let correctCount = parseInt(localStorage.getItem("correctCount")) || 0;
let incorrectCount = parseInt(localStorage.getItem("incorrectCount")) || 0;
document.getElementById("correctCount").textContent = correctCount;
document.getElementById("incorrectCount").textContent = incorrectCount;

document.getElementById("startQuizBtn").addEventListener("click", async function() {
    const difficulty = document.getElementById("difficulty").value;
    const apiUrl = `https://quizapi.io/api/v1/questions?apiKey=kE2vhRSS0DOi5IOyZVHjhaSHeSxwco6JbAtsoXSQ&limit=1&difficulty=${difficulty}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        displayQuestion(data[0]);
    } catch (error) {
        console.error("Error fetching question:", error);
    }
});

function displayQuestion(questionData) {
    document.getElementById("difficulty-form").style.display = "none";
    document.getElementById("question-container").style.display = "block";
    
    document.getElementById("question").textContent = questionData.question;
    
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";
    
    const answerKeys = Object.keys(questionData.answers).filter(key => questionData.answers[key] !== null);
    
    answerKeys.forEach(key => {
        const answerText = questionData.answers[key];
        const isCorrect = questionData.correct_answers[`${key}_correct`] === "true";
        
        const button = document.createElement("button");
        button.textContent = answerText;
        button.dataset.correct = isCorrect;
        
        answersDiv.appendChild(button);
    });
    
    document.getElementById("submitAnswerBtn").onclick = submitAnswer;
}

function submitAnswer() {
    const selectedAnswer = document.querySelector("#answers button[data-selected='true']");
    if (selectedAnswer) {
        const isCorrect = selectedAnswer.dataset.correct === "true";
        
        if (isCorrect) {
            correctCount++;
            alert("Correct!");
        } else {
            incorrectCount++;
            alert("Incorrect!");
        }
        
        localStorage.setItem("correctCount", correctCount);
        localStorage.setItem("incorrectCount", incorrectCount);
        
        document.getElementById("correctCount").textContent = correctCount;
        document.getElementById("incorrectCount").textContent = incorrectCount;
        
        document.getElementById("question-container").style.display = "none";
        document.getElementById("difficulty-form").style.display = "block";
    } else {
        alert("Please select an answer!");
    }
}

document.getElementById("answers").addEventListener("click", function(e) {
    if (e.target.tagName === "BUTTON") {
        document.querySelectorAll("#answers button").forEach(btn => btn.removeAttribute("data-selected"));
        e.target.setAttribute("data-selected", "true");
    }
});

document.getElementById("resetBtn").addEventListener("click", function() {
    correctCount = 0;
    incorrectCount = 0;
    
    localStorage.setItem("correctCount", correctCount);
    localStorage.setItem("incorrectCount", incorrectCount);
    
    document.getElementById("correctCount").textContent = correctCount;
    document.getElementById("incorrectCount").textContent = incorrectCount;
});
