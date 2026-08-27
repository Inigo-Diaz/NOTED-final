const hangmanImage = document.querySelector(".hangman-box img");

const termDisplay = document.querySelector(".hangman-items");
const incorrectGuesses = document.querySelector(".incorrect-guesses b");
const keyboardDiv = document.querySelector(".hangman-keyboard");

const gameModal = document.querySelector(".game-modal");
const PAbtn = document.querySelector(".play-again");

let currentTerm, correctLetters, incorrectGuessesCount;
const maxGuesses = 8;
const playableFlashcards = testFlashcard
  .map(card => ({
    term: typeof card.term === "string" ? card.term.trim() : "",
    def: typeof card.def === "string" ? card.def : card.definition
  }))
  .filter(card => card.term && typeof card.def === "string");

const resetGame = () => {
  // Reset all UI/UX elements to play again
  correctLetters = [];
  incorrectGuessesCount = 0;
  hangmanImage.src = `../../../../aesthetic_tools/images/hangman-game/hangman-${incorrectGuessesCount}.png`;
  incorrectGuesses.innerText = `${incorrectGuessesCount} / ${maxGuesses}`;
  keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
  termDisplay.innerHTML = currentTerm.split("").map(() => `<li class="letter"></li>`).join("");
  gameModal.classList.remove("show");
}

const GetRandomWord = () => {
  // Selects a random flashcard from the flashcard set
  if (playableFlashcards.length === 0) {
    document.querySelector(".definition-text").innerText = "This set has no playable flashcards.";
    keyboardDiv.querySelectorAll("button").forEach(button => button.disabled = true);
    return;
  }

  const { term, def } = playableFlashcards[Math.floor(Math.random() * playableFlashcards.length)];
  currentTerm = term.toUpperCase();
  document.querySelector(".definition-text").innerText = def;
  resetGame();
}

const gameOver = (win) => {
  // Show game over details from winning or losing
  setTimeout(() => {
    gameModal.querySelector("h4").innerText = `${win ? `You win!` : `Game Over!`}`;
    gameModal.querySelector("p").innerHTML = `Correct Answer: <b>${currentTerm}</b>`;
    gameModal.classList.add("show");

  }, 300);
}


// Function that checks if the letter clicked is in the current term and logs it to the console
const initGame = (button, clickedLetter) => {
  if(currentTerm.includes(clickedLetter)) {
      [...currentTerm] .forEach((letter, index) => {
        if(letter === clickedLetter) {
          correctLetters.push(letter);
          termDisplay.querySelectorAll("li")[index].innerText = letter;
          termDisplay.querySelectorAll("li")[index].classList.add("guessed");
        }
      })
    } else {

      incorrectGuessesCount ++;
      hangmanImage.src = `../../../../aesthetic_tools/images/hangman-game/hangman-${incorrectGuessesCount}.png`;
    }
  button.disabled = true;
  incorrectGuesses.innerText = `${incorrectGuessesCount} / ${maxGuesses}`;

  // Game over conditions
  if(incorrectGuessesCount === maxGuesses) return gameOver(false);
  if(correctLetters.length === currentTerm.length) return gameOver(true);
  }

// Creates the functional keyboard and adding event listeners, recording the letter clicked and passing it to the initGame function

for (let i = 48; i <= 57; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  keyboardDiv.appendChild(button);
  button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

for (let i = 65; i <= 90; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    button.style.textTransform = "uppercase";
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

GetRandomWord();
PAbtn.addEventListener("click", GetRandomWord);





