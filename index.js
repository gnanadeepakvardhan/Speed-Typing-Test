const timerElement = document.getElementById('timer');
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const resultElement = document.getElementById('result');
const submitBtnElement = document.getElementById('submitBtn');
const resetBtnElement = document.getElementById('resetBtn');
const loadingSpinnerElement = document.getElementById('loadingSpinner');

let timerInterval;
let currentTime = 0;
let currentQuote = '';

document.addEventListener('DOMContentLoaded', function() {
    fetchRandomQuote();
    startTimer();
});

async function fetchRandomQuote() {
    try {
        showLoading(true);
        const response = await fetch('https://apis.ccbp.in/random-quote');
        
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        
        const data = await response.json();
        currentQuote = data.content;
        quoteDisplayElement.textContent = currentQuote;
        
        quoteInputElement.disabled = false;
        submitBtnElement.disabled = false;
        
        resultElement.textContent = '';
        resultElement.className = 'result-text';
        
    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteDisplayElement.textContent = 'Failed to load quote. Please try again.';
        quoteDisplayElement.style.color = '#dc3545';
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    if (show) {
        loadingSpinnerElement.style.display = 'block';
        quoteDisplayElement.style.opacity = '0.5';
    } else {
        loadingSpinnerElement.style.display = 'none';
        quoteDisplayElement.style.opacity = '1';
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        currentTime++;
        timerElement.textContent = currentTime;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    currentTime = 0;
    timerElement.textContent = currentTime;
    startTimer();
}

submitBtnElement.addEventListener('click', function() {
    const userInput = quoteInputElement.value.trim();
    
    if (userInput === '') {
        showResult('Please type the quote before submitting.', 'error');
        return;
    }
    
    if (userInput === currentQuote) {
        stopTimer();
        showResult(`Congratulations! You completed the typing test in ${currentTime} seconds.`, 'success');
        
        quoteInputElement.disabled = true;
        submitBtnElement.disabled = true;
    } else {
        showResult('The text you typed does not match the quote. Please try again.', 'error');
    }
});

resetBtnElement.addEventListener('click', function() {
    resetTimer();
    quoteInputElement.value = '';
    quoteInputElement.disabled = true;
    submitBtnElement.disabled = true;
    resultElement.textContent = '';
    resultElement.className = 'result-text';
    
    fetchRandomQuote();
});

function showResult(message, type) {
    resultElement.textContent = message;
    resultElement.className = `result-text ${type}`;
}

quoteInputElement.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        submitBtnElement.disabled = false;
    } else {
        submitBtnElement.disabled = true;
    }
});

quoteInputElement.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!submitBtnElement.disabled) {
            submitBtnElement.click();
        }
    }
});
