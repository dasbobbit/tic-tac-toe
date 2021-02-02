// Create grid
const gameBoard = (() => {
    const boardContainer = document.getElementById('board-container');

    const setBoard = () => {
        const DIM = 3;
        for (let i = 0; i < DIM * DIM; i++) {
            let gridBlock = document.createElement('div');
            let span = document.createElement('span');
            gridBlock.className = 'block';
            gridBlock.id = `${i}`;
            span.className = 'span';
            gridBlock.appendChild(span);
            boardContainer.insertAdjacentElement('beforeend', gridBlock);
        };
    };

    const updateBoard = (id, playerSymbol) => {
        let blockToUpdate = document.getElementById(`${id}`);
        // console.log(blockToUpdate.firstChild);
        blockToUpdate.firstChild.textContent = playerSymbol;
    };

    const resetBoard = () => {
        let blocksToReset = gameController.blockClick;
        blocksToReset.forEach((block) => {
            block.firstChild.textContent = "";
        });
        console.log(blocksToReset);

    }
    setBoard();

    return {
        updateBoard,
        resetBoard
    }
})();

const players = (() => {
    const player = (_name, _playerSymbol, _startGame) => {
        const name = _name;
        const playerSymbol = _playerSymbol;
        const isTurn = playerSymbol === "X" ? true : false;
        const playerScore = 0;
        const startGame = isTurn;
        return { name, playerSymbol, startGame, isTurn, playerScore };
    }
    return {
        player
    }
})();

const gameController = (() => {
    let gameArray = new Array(9).fill("");
    let totalMoves = 0;
    let firstToGames;
    let player1, player2;

    const myModal = document.querySelector('#myModal');
    const container = document.querySelector('#container');
    container.classList.add('.freeze');

    const player1input = document.querySelector('#player1-input');
    const player2input = document.querySelector('#player2-input');
    const player1Score = document.querySelector('#player1-score');
    const player2Score = document.querySelector('#player2-score');
    const player1Symbol = document.querySelector('#player1-symbol');
    const player2Symbol = document.querySelector('#player2-symbol');
    const dialogTxt = document.querySelector('#dialogue-text');
    const player1Name = document.querySelector('#player1-name');
    const player2Name = document.querySelector('#player2-name');

    const playerSelect = document.querySelector('#player-opponent');
    const aiSelect = document.querySelector('#ai-opponent');
    incompleteEntry = document.querySelector('#incomplete-entry');
    // console.log(firstToGames);
    
    const newGame = () => {
        myModal.style.display = "block";
        gameArray = new Array(9).fill("");
        totalMoves = 0;
        firstToGames = 0;
        // player1.playerScore = 0;
        // player2.playerScore = 0;
        gameBoard.resetBoard;
    };
    newGame();

    const submitEntry = (e) => {
        console.log(e);
        console.log(player2input.value);
        firstToGamesInput = document.querySelector('#first-to-number');
        firstToGames = firstToGamesInput.value;
        if (player1input.value == "" || player2input.value == "") {
            incompleteEntry.textContent = "Fill the names in";
        } else if (firstToGames < 1) {
            incompleteEntry.textContent = "Play at least one game!";
        } else {
            player1 = players.player(`${player1input.value}`, "X");
            player2 = players.player(`${player2input.value}`, "O");
            player1Name.textContent = `${player1.name}`;
            player2Name.textContent = `${player2.name}`;
            player1Score.textContent = `${player1.playerScore}`;
            player2Score.textContent = `${player2.playerScore}`;
            player1Symbol.textContent = `${player1.playerSymbol}`;
            player2Symbol.textContent = `${player2.playerSymbol}`;
            incompleteEntry.textContent = "";
            myModal.style.display = "none";
            dialogTxt.textContent = "";
            console.log(player1);
            console.log(player2);
        }
    }

    const playerSwitch = () => {
        player1.isTurn = player1.isTurn === true ? false : true;
        player2.isTurn = player1.isTurn === true ? false : true;
    }
    console.log(totalMoves);

    const playerMove = (e) => {
        console.log(player1);
        console.log(player2);
        if (myModal.style.display == 'none') {
            let player = player1.isTurn === true ? player1 : player2;
            console.log(e);
            if (gameArray[e.target.id] == "") {
                gameArray[e.target.id] = player.playerSymbol;
                gameBoard.updateBoard(e.target.id, player.playerSymbol);
                playerSwitch();
    
                checkWinner(player);
            }
        }
    };

    const checkWinner = (player) => {
        totalMoves++
        const winningCombo = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        winningCombo.forEach((combo) => {
            let gameWonCount = 0;
            for (i = 0; i < 3; i++) {
                if (gameArray[combo[i]] === player.playerSymbol) gameWonCount++;
            }
            if (gameWonCount == 3) {
                dialogTxt.textContent = `${player.name} wins the round!`;
                player.name === player1.name ? player1.playerScore++ : player2.playerScore++;
                resetRound();
                console.log(player1);
                console.log(player2);
            }

        });
        if (totalMoves === 9) {
            dialogTxt.textContent = `Tie round`;
            resetRound();
        }
    }
    const resetRound = () => {
        // Switch who starts the game
        player1.startGame = player1.startGame === true ? false : true;
        player2.startGame = player2.startGame === true ? false : true;
        // Ensure player who starts game has first turn
        player1.isTurn = player1.startGame === true ? true : false;
        player2.isTurn = player2.startGame === true ? true : false;
        // Update playerScores
        player1Score.textContent = `${player1.playerScore}`;
        player2Score.textContent = `${player2.playerScore}`;

        // Check if games to win is reached
        if (player1.playerScore == firstToGames || player2.playerScore == firstToGames) {
            if (player1.playerScore == firstToGames) {
                dialogTxt.textContent = `${player1.name} wins the game!`;
            } else {
                dialogTxt.textContent = `${player2.name} wins the game!`;
            }
            newGame();
        }
        gameArray = new Array(9).fill("");
        totalMoves = 0;
        gameBoard.resetBoard();
        
        return gameArray;
    }

    let blockClick = document.querySelectorAll('.block');
    blockClick.forEach(element => element.addEventListener('click', playerMove));

    const submit = document.querySelector('#submit-entry')
    submit.addEventListener('click', submitEntry);

    return {
        blockClick,
        checkWinner,
        playerMove,
        newGame
    }

})();