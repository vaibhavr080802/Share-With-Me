const uploadInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const keyDisplay = document.getElementById("generatedKey");
const countdownTimer = document.getElementById("countdownTimer");
const downloadInput = document.getElementById("downloadKey");
const downloadBtn = document.getElementById("downloadBtn");

let fileStorage = {}; // Stores files temporarily in memory
let timerInterval = null;

// Generate a Unique Key (6-digit)
function generateKey() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Start Countdown Timer
function startCountdown(expirationTime) {
    clearInterval(timerInterval);
    function updateTimer() {
        const now = new Date().getTime();
        const timeLeft = expirationTime - now;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            keyDisplay.innerHTML = "EXPIRED";
            countdownTimer.innerHTML = "00:00";
            return;
        }
        const hours = String(Math.floor(timeLeft / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((timeLeft % (1000 * 60)) / 1000)).padStart(2, '0');
        countdownTimer.innerHTML = `${hours}:${minutes}:${seconds}`;
    }
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

// Handle File Upload
uploadBtn.addEventListener("click", () => {
    const file = uploadInput.files[0];
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }
    const key = generateKey();
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    fileStorage[key] = { file, expirationTime };

    keyDisplay.innerHTML = `Your Key: <b>${key}</b>`;
    startCountdown(expirationTime);
});

// Handle File Download
downloadBtn.addEventListener("click", () => {
    const key = downloadInput.value.trim().toUpperCase();
    if (!fileStorage[key]) {
        alert("Invalid or expired key.");
        return;
    }
    const { file, expirationTime } = fileStorage[key];
    if (new Date().getTime() > expirationTime) {
        alert("Key has expired!");
        return;
    }
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
