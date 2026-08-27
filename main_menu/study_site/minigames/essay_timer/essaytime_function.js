const selectedSet = JSON.parse(localStorage.getItem("selectedStudySet"));
const setKey = selectedSet?.name ? `essayTimerAttempts:${selectedSet.name}` : "essayTimerAttempts:default";
const readout = document.getElementById("timerReadout");
const status = document.getElementById("timerStatus");
const bestTime = document.getElementById("bestTime");
const attemptCount = document.getElementById("attemptCount");
const wordCount = document.getElementById("wordCount");
const attemptHistory = document.getElementById("attemptHistory");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const finishButton = document.getElementById("finishButton");

let elapsedMilliseconds = 0;
let startedAt = null;
let animationFrame;
let attempts = JSON.parse(localStorage.getItem(setKey)) || [];

function formatTime(milliseconds) {
  const tenths = Math.floor(milliseconds / 100) % 10;
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor(milliseconds / 60000) % 60;
  const hours = Math.floor(milliseconds / 3600000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function updateReadout() {
  if (startedAt !== null) elapsedMilliseconds = Date.now() - startedAt;
  readout.textContent = formatTime(elapsedMilliseconds);
  if (startedAt !== null) animationFrame = requestAnimationFrame(updateReadout);
}

function setRunning(running) {
  startButton.disabled = running;
  pauseButton.disabled = !running;
  finishButton.disabled = !running;
}

function renderResults() {
  const quickest = attempts.length ? Math.min(...attempts) : null;
  bestTime.textContent = quickest === null ? "No attempts" : formatTime(quickest);
  attemptCount.textContent = attempts.length;
  attemptHistory.innerHTML = "";
  [...attempts].reverse().forEach((attempt, index) => {
    const item = document.createElement("li");
    item.textContent = `Attempt ${attempts.length - index}: ${formatTime(attempt)}`;
    attemptHistory.appendChild(item);
  });
}

function startAttempt() {
  if (startedAt === null) startedAt = Date.now() - elapsedMilliseconds;
  setRunning(true);
  status.textContent = "Attempt in progress.";
  updateReadout();
}

function pauseAttempt() {
  if (startedAt === null) return;
  elapsedMilliseconds = Date.now() - startedAt;
  startedAt = null;
  cancelAnimationFrame(animationFrame);
  setRunning(false);
  status.textContent = "Paused. Resume when you are ready.";
  updateReadout();
}

function finishAttempt() {
  if (startedAt === null) return;
  elapsedMilliseconds = Date.now() - startedAt;
  startedAt = null;
  cancelAnimationFrame(animationFrame);
  attempts.push(elapsedMilliseconds);
  localStorage.setItem(setKey, JSON.stringify(attempts));
  setRunning(false);
  status.textContent = `Attempt saved at ${formatTime(elapsedMilliseconds)}.`;
  renderResults();
  updateReadout();
}

function resetAttempt() {
  startedAt = null;
  elapsedMilliseconds = 0;
  cancelAnimationFrame(animationFrame);
  setRunning(false);
  status.textContent = "Ready for a new attempt.";
  updateReadout();
}

startButton.addEventListener("click", startAttempt);
pauseButton.addEventListener("click", pauseAttempt);
finishButton.addEventListener("click", finishAttempt);
document.getElementById("resetButton").addEventListener("click", resetAttempt);

document.getElementById("setLabel").textContent = selectedSet?.name
  ? `${selectedSet.name} essay practice and quickest-time tracking.`
  : "Practice an essay and track your quickest attempt.";
renderResults();
updateReadout();
