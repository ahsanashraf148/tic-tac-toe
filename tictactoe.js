const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const undoButton = document.getElementById('undoButton');
const restartvsComputerButton = document.getElementById('restartvsComputerButton');
const undovsComputerButton = document.getElementById('undovsComputerButton');
const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameHistory = [];
let scores = { X: 0, O: 0 };
let playerNames = { X: 'Player X', O: 'Player O' };
let playerName;
let difficulty;
let vsComputer = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const startGameButton = document.getElementById('startGameButton');
const startvsComputerButton = document.getElementById('startvsComputerButton');

function startGame() {
    playerNames.X = document.getElementById('playerXName').value || 'Player X';
    playerNames.O = document.getElementById('playerOName').value || 'Player O';
    vsComputer = false;
    restartGame();
}

function startGameVsComputer() {
    playerName = document.getElementById('playerName').value || 'Player';
    difficulty = document.getElementById('difficulty').value;
    vsComputer = true;
    restartGameVsComputer();
}

if (startGameButton) startGameButton.addEventListener('click', startGame);
if (startvsComputerButton) startvsComputerButton.addEventListener('click', startGameVsComputer);


function updateStatus(message) {
    statusDisplay.innerText = message;
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    gameHistory.push(gameState.slice()); // Save current state to history
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (vsComputer) {
        updateStatus(`${currentPlayer === 'X' ? playerName : "Computer"}'s turn`);
    }
    else {
        updateStatus(`${playerNames[currentPlayer]}'s turn`);
    }
}

function checkWin() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if ([a, b, c].includes('')) continue;
        if (a === b && b === c) {
            roundWon = true;
            scores[currentPlayer] += 1; // Update score
            updateStatus(`${playerNames[currentPlayer]} wins! Score: ${scores[currentPlayer]}`);
            winCondition.forEach(index => {
                cells[index].classList.add('winning-cell');
            });
            gameActive = false;
            playCelebrationSound();
            showWinnerAnimation(playerNames[currentPlayer]);
            return;
        }
    }
    if (!gameState.includes('')) {
        updateStatus(`Game ended in a draw!`);
        gameActive = false;
        return;
    }
    handlePlayerChange();
}

function checkWinVsComputer() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if ([a, b, c].includes('')) continue;
        if (a === b && b === c) {
            roundWon = true;
            updateStatus(`${a === 'X' ? playerName : "Computer"} wins!`);
            winCondition.forEach(index => {
                cells[index].classList.add('winning-cell');
            });
            gameActive = false;
            return;
        }
    }
    if (!gameState.includes('')) {
        updateStatus(`Game ended in a draw!`);
        gameActive = false;
        return;
    }
    if (gameActive) {
        if (currentPlayer === 'O') {
            computerMove();
        } else {
            handlePlayerChange();
        }
    }
}

function computerMove() {
    if (!gameActive || currentPlayer !== 'O') return;
    let availableSpots = gameState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    if (availableSpots.length === 0) return;
    let move;
    switch (difficulty) {
        case 'easy':
            move = availableSpots[Math.floor(Math.random() * availableSpots.length)]; // Random move
            break;
        case 'medium':
            // will Implement medium difficulty logic
            break;
        case 'hard':
            // will Implement hard difficulty logic
            break;
    }
    if (move !== undefined) {
        gameState[move] = 'O';
        document.querySelector(`[data-cell-index="${move}"]`).innerText = 'O';
        gameHistory.push(gameState.slice());
        checkWinVsComputer();
    }
}

function playCelebrationSound() {
    const sound = new Audio('celebrationSound.mp3');
    sound.play();
}

function showWinnerAnimation(winnerName) {
    const winnerDisplay = document.createElement('div');
    winnerDisplay.innerText = `${winnerName} Wins!`;
    winnerDisplay.classList.add('winner-display');
    document.body.appendChild(winnerDisplay);

    // Remove the winner display after the animation completes
    setTimeout(() => {
        document.body.removeChild(winnerDisplay);
    }, 2000);
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    if (vsComputer) {
        checkWinVsComputer();
        if (gameActive && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    } else {
        checkWin();
    }
}


function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameHistory = [];
    updateStatus(`${playerNames[currentPlayer]}'s turn`);
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('winning-cell');
    });
}

function restartGameVsComputer() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameHistory = [];
    updateStatus(`${playerName}'s turn`);
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('winning-cell');
    });
}

function undoMove() {
    // Check if the game is still active or if there's a previous state to revert to
    if (gameActive && gameHistory.length > 1) {
        gameHistory.pop(); // Remove the current state
        const previousState = gameHistory[gameHistory.length - 1]; // Get the last state
        gameState = [...previousState]; // Restore the game state to the last state

        // Toggle currentPlayer
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus(`${playerNames[currentPlayer]}'s turn`);
        
        cells.forEach((cell, index) => {
            cell.innerText = gameState[index]; // Update cell text based on gameState
            cell.classList.remove('winning-cell'); // Remove any winning cell highlight
        });
    }
}

function undoMoveVsComputer() {
    // Undo functionality for vsComputer mode
    // Similar to undoMove but might need adjustments for computer moves
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
if (restartButton) restartButton.addEventListener('click', restartGame);
if (restartvsComputerButton) restartvsComputerButton.addEventListener('click', restartGameVsComputer);
if (undovsComputerButton) undovsComputerButton.addEventListener('click', undoMoveVsComputer);
if (undoButton) undoButton.addEventListener('click', undoMove);
// document.getElementById('gameContainer').appendChild(undoButton);