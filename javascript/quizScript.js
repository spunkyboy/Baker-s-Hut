const quizData = [
    {
        question: "Paris is the capital of France?",
        options: ["True", "False"],
        answer: "True"
    },
    {
        question: "Which language is primarily used for web development?",
        options: ["Python", "JavaScript", "Java", "C++"],
        answer: "JavaScript"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        answer: "Pacific"
    },
    {
        question: "Who developed the theory of relativity?",
        options: ["Newton", "Einstein", "Tesla", "Galileo"],
        answer: "Einstein"
    },
    // New questions added
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        answer: "Mars"
    },
    {
        question: "Who is the author of 'To Kill a Mockingbird'?",
        options: ["Ernest Hemingway", "Harper Lee", "J.K. Rowling", "George Orwell"],
        answer: "Harper Lee"
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Oxygen", "Osmium", "Ozone", "Opium"],
        answer: "Oxygen"
    },
    {
        question: "What is the speed of light?",
        options: ["299,792 km/s", "150,000 km/s", "100,000 km/s", "200,000 km/s"],
        answer: "299,792 km/s"
    }
];


let currentQuestionIndex = 0;
let userAnswers = [];
let currentUser = null;

function showSignIn() {
    document.getElementById('signin-heading').classList.add('active');
    document.getElementById('signup-heading').classList.remove('active');
    document.getElementById('quiz-page').classList.remove('active');
    document.getElementById('result-page').classList.remove('active');
}

function showSignUp() {
    document.getElementById('signup-heading').classList.add('active');
    document.getElementById('signin-heading').classList.remove('active');
}

let startTime; // Variable to store the start time of the quiz

function showQuizPage() {
    document.getElementById('quiz-page').classList.add('active');
    document.getElementById('signin-heading').classList.remove('active');
    document.getElementById('signup-heading').classList.remove('active');
    document.getElementById('result-page').classList.remove('active');
    loadQuestion();
      //Record the start time when the quiz page is shown
      startTime = new Date().getTime();
}

// Function to load the current question
function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const questionData = quizData[currentQuestionIndex];

    questionContainer.innerHTML = ` <div class='quiz-class'>
        ${questionData.question} <p class='quiz-radio-text'>
        ${questionData.options.map((option, idx) => 
            `<input type="radio" name="answer" id="option${idx}" value="${option}">
            <label for="option${idx}">${option}</label><br>`
        ).join('')}</p>
    </div>`;

    // Disable the Next button initially
    document.getElementById('next-btn').disabled = true;
    
    // Disable the Submit button initially
    document.getElementById('submit-btn').disabled = true;

    // Reset the selected answer for the current question
    const selectedAnswer = userAnswers[currentQuestionIndex];
    if (selectedAnswer) {
        document.querySelector(`input[value="${selectedAnswer}"]`).checked = true;
    }

    // Add event listener to enable Next button when answer is selected
    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            document.getElementById('next-btn').disabled = false;

            // Enable the Submit button if on the last question
            if (currentQuestionIndex === quizData.length - 1) {
                document.getElementById('submit-btn').disabled = false;
            }
        });
    });

    // Disable the Next button if on the last question
    if (currentQuestionIndex === quizData.length - 1) {
        document.getElementById('next-btn').disabled = true;
    }
}

function checkAnswers() {
    let score = 0;
    userAnswers.forEach((answer, idx) => {
        if (answer === quizData[idx].answer) score++;
    });
    return score;
}


function showResultPage() {
    const result = checkAnswers();
    let resultMessage = "";
    const resultElement = document.getElementById('result');

     // Calculate the time spent on the quiz
     const endTime = new Date().getTime();
     const timeSpent = endTime - startTime; // Time in milliseconds
 
     // Convert milliseconds to hours, minutes, and seconds
     const hours = Math.floor(timeSpent / (1000 * 60 * 60)); // Calculate hours
     const minutes = Math.floor((timeSpent % (1000 * 60 * 60)) / (1000 * 60)); // Calculate minutes
     const seconds = Math.floor((timeSpent % (1000 * 60)) / 1000); // Calculate seconds
 
    // Display the message based on the score
    if (result >= 3) {
        resultMessage = `Congratulations! You passed the quiz with ${result} out of ${quizData.length} correct answers.`;
        
        // Change result text color to green (pass)
        resultElement.style.color = '#003636';
        resultElement.style.backgroundColor = '#e0ffff';
        resultElement.style.padding = '10px';  // Padding around the text
        resultElement.style.borderRadius = '5px';  
        resultElement.style.lineHeight = '1.6';
        
        // Disable the "Try Again" button if the user passes
        document.getElementById('retry-btn').disabled = true; // Disable "Try Again" button on pass
    } else {
        resultMessage = `You failed the quiz with ${result} out of ${quizData.length} correct answers. Try again!`;
        
        // Change result text color to red (fail)
        resultElement.style.color = '#800000';
        resultElement.style.backgroundColor = '#e0ffff';  // Light red background color (adjust as needed)
        resultElement.style.padding = '10px';  // Padding around the text
        resultElement.style.borderRadius = '5px';  
        resultElement.style.lineHeight = '1.6';
        
        // Enable the "Try Again" button if the user fails
        document.getElementById('retry-btn').disabled = false; // Enable "Try Again" button on fail
    }
     // Format time in hours, minutes, and seconds (hh:mm:ss)
     const formattedTime = `${hours}:${minutes}:${seconds}s`;

      // Add the time spent to the result message
      resultMessage += `<br><strong>Time taken: ${formattedTime}</strong>`;

    resultElement.innerHTML = resultMessage;
    document.getElementById('result-page').classList.add('active');
    document.getElementById('quiz-page').classList.remove('active');

}

// Function to shuffle the questions array
function shuffleQuestions() {
    for (let i = quizData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizData[i], quizData[j]] = [quizData[j], quizData[i]]; // Swap
    }
}


// Sign In logic
document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    const user = JSON.parse(localStorage.getItem(username));
    if (user && user.password === password) {
        currentUser = user;

        // Get the current hour
        const currentHour = new Date().getHours();

        // Determine the greeting based on the time of day
        let greeting = '';
        if (currentHour >= 5 && currentHour < 12) {
            greeting = 'Good Morning';
        } else if (currentHour >= 12 && currentHour < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }

        // Display the greeting message inside the div
        document.getElementById('greet-message').innerHTML = `${greeting}, ${username}!`;

        // You can optionally hide the login form after successful login
        document.getElementById('signin-form').style.display = 'none';

        shuffleQuestions();  // Shuffle questions after login
        showQuizPage();      // Show the quiz page
    } else {
        alert("Invalid credentials");
    }
});


document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    // Regular expression to check for required password criteria
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|;:'",<>\./?\\]).{8,}$/;

    if (localStorage.getItem(username)) {
        alert("Username already exists.");
    } else if (!passwordPattern.test(password)) {
        alert("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (e.g., @, #, $, %, etc.), and be at least 8 characters long.");
    } else {
        const newUser = { username, password };
        localStorage.setItem(username, JSON.stringify(newUser));
        alert("Sign up successful. Please sign in.");
        showSignIn();
    }
});

// Toggle show/hide password
document.getElementById('password-if').addEventListener('change', function() {
    const passwordField = document.getElementById('signup-password');
    if (this.checked) {
        passwordField.type = 'text';  // Show the password
    } else {
        passwordField.type = 'password';  // Hide the password
    }
});



document.getElementById('next-btn').addEventListener('click', function() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        userAnswers[currentQuestionIndex] = selectedOption.value;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex >= quizData.length) {
        currentQuestionIndex = quizData.length - 1;
        document.getElementById('next-btn').disabled = true; // Disable Next on last question
    }
    loadQuestion();
    document.getElementById('prev-btn').disabled = false;
});

document.getElementById('prev-btn').addEventListener('click', function() {
    currentQuestionIndex--;
    if (currentQuestionIndex <= 0) {
        currentQuestionIndex = 0;
        document.getElementById('prev-btn').disabled = true;
    }
    loadQuestion();
    document.getElementById('next-btn').disabled = false;

    // Disable Submit button if not on the last question
    document.getElementById('submit-btn').disabled = currentQuestionIndex !== quizData.length - 1;
});

document.getElementById('submit-btn').addEventListener('click', showResultPage);

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', logout);

function logout() {
    currentUser = null;
    userAnswers = [];
    document.getElementById('result-page').classList.remove('active');
    document.getElementById('quiz-page').classList.remove('active');
    document.getElementById('signin-heading').classList.add('active');
    document.getElementById('signup-heading').classList.remove('active');

      // Refresh the page to fully log out and reset everything
      location.reload();
}

// Retry logic after failing quiz
document.getElementById('retry-btn').addEventListener('click', function() {
    currentQuestionIndex = 0;
    userAnswers = [];
    shuffleQuestions();  // Shuffle questions after retry
    loadQuestion();
    document.getElementById('result-page').classList.remove('active');
    document.getElementById('quiz-page').classList.add('active');

});


window.onload = function() {
    showSignIn();
    document.getElementById('signin-username').focus();
};
