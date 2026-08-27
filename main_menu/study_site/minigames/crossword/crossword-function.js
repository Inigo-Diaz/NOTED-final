const storedSet = JSON.parse(localStorage.getItem("selectedStudySet"));
const fallbackCards = [
  { term: "Photosynthesis", definition: "The process plants use to make food from sunlight." },
  { term: "Gravity", definition: "The force that attracts a body toward Earth." },
  { term: "Ecosystem", definition: "A community of organisms and their environment." }
];

const cards = (storedSet && Array.isArray(storedSet.cards) ? storedSet.cards : fallbackCards)
  .map(card => ({
    term: typeof card.term === "string" ? card.term.replace(/[^a-z]/gi, "").toUpperCase() : "",
    definition: typeof card.definition === "string" ? card.definition : card.def
  }))
  .filter(card => card.term && typeof card.definition === "string")
  .filter((card, index, allCards) => allCards.findIndex(item => item.term === card.term) === index)
  .slice(0, 12);

const board = document.getElementById("crosswordGame");
const clues = document.getElementById("clues");
const message = document.getElementById("message");
const size = Math.max(15, Math.min(31, Math.max(...cards.map(card => card.term.length), 15) + 6));
let placedWords = [];
let cellMap = new Map();

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function canPlace(word, row, column, direction) {
  for (let index = 0; index < word.length; index += 1) {
    const currentRow = row + (direction === "down" ? index : 0);
    const currentColumn = column + (direction === "across" ? index : 0);
    if (currentRow < 0 || currentRow >= size || currentColumn < 0 || currentColumn >= size) return false;
    const existing = cellMap.get(`${currentRow}-${currentColumn}`);
    if (existing && existing.letter !== word[index]) return false;
  }
  return true;
}

function placeWord(card, row, column, direction) {
  for (let index = 0; index < card.term.length; index += 1) {
    const cell = {
      row: row + (direction === "down" ? index : 0),
      column: column + (direction === "across" ? index : 0),
      letter: card.term[index]
    };
    cellMap.set(`${cell.row}-${cell.column}`, cell);
  }
  card.row = row;
  card.column = column;
  card.direction = direction;
}

function buildPuzzle() {
  placedWords = shuffle(cards).map(card => ({ ...card }));
  cellMap = new Map();
  placedWords.forEach((card, index) => {
    const direction = Math.random() < 0.5 ? "across" : "down";
    const center = Math.floor(size / 2);
    const row = direction === "across" ? center : Math.max(0, center - Math.floor(card.term.length / 2));
    const column = direction === "across" ? Math.max(0, center - Math.floor(card.term.length / 2)) : center;
    let placed = false;
    for (let attempt = 0; attempt < size * size * 2 && !placed; attempt += 1) {
      const candidateRow = (row + Math.floor(attempt / size)) % size;
      const candidateColumn = (column + attempt) % size;
      if (canPlace(card.term, candidateRow, candidateColumn, direction)) {
        placeWord(card, candidateRow, candidateColumn, direction);
        placed = true;
      }
    }
    if (!placed) card.row = -1;
  });
}

function renderBoard() {
  const numbers = new Map();
  let nextNumber = 1;
  placedWords
    .filter(card => card.row >= 0)
    .sort((firstCard, secondCard) => firstCard.row - secondCard.row || firstCard.column - secondCard.column)
    .forEach(card => {
      const start = `${card.row}-${card.column}`;
      if (!numbers.has(start)) numbers.set(start, nextNumber++);
    });

  placedWords.forEach(card => {
    card.number = numbers.get(`${card.row}-${card.column}`);
  });
  board.innerHTML = "";
  for (let row = 0; row < size; row += 1) {
    const tableRow = board.insertRow();
    for (let column = 0; column < size; column += 1) {
      const tableCell = tableRow.insertCell();
      const cell = cellMap.get(`${row}-${column}`);
      if (!cell) continue;
      tableCell.className = "cell";
      const number = numbers.get(`${row}-${column}`);
      if (number) {
        const numberLabel = document.createElement("span");
        numberLabel.className = "cell-number";
        numberLabel.textContent = number;
        tableCell.appendChild(numberLabel);
      }
      const input = document.createElement("input");
      input.maxLength = 1;
      input.dataset.answer = cell.letter;
      input.dataset.row = row;
      input.dataset.column = column;
      input.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}`);
      input.addEventListener("input", event => { event.target.value = event.target.value.replace(/[^a-z]/gi, "").toUpperCase(); });
      tableCell.appendChild(input);
    }
  }
}

function renderClues() {
  clues.innerHTML = "";
  placedWords.filter(card => card.row >= 0).forEach(card => {
    const clue = document.createElement("button");
    clue.className = "clue";
    clue.innerHTML = `<strong>${card.number || ""} ${card.direction}</strong><span>${card.definition}</span>`;
    clue.addEventListener("click", () => {
      const firstCell = board.querySelector(`input[data-row="${card.row}"][data-column="${card.column}"]`);
      if (firstCell) firstCell.focus();
    });
    clues.appendChild(clue);
  });
}

function startGame() {
  document.getElementById("setName").textContent = storedSet?.name || "Study Set";
  message.textContent = cards.length ? "" : "This set has no playable flashcards.";
  buildPuzzle();
  renderBoard();
  renderClues();
}

document.getElementById("checkButton").addEventListener("click", () => {
  const inputs = [...board.querySelectorAll("input")];
  const correct = inputs.filter(input => input.value === input.dataset.answer).length;
  message.textContent = correct === inputs.length && inputs.length > 0 ? "Puzzle complete!" : `${correct} of ${inputs.length} squares are correct.`;
});
document.getElementById("newGameButton").addEventListener("click", startGame);
startGame();