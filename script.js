const boardContainer = document.getElementById('board-container');

// Create grid
const gameBoard = (() => {

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
        console.log(blockToUpdate.firstChild);
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
        return { name, playerSymbol, startGame, isTurn, playerScore};
    }
    return {
        player
    }
})();

const gameController = (() => {
    let gameArray = new Array(9).fill("");
    let player1 = players.player("Player 1", "X");
    let player2 = players.player("Player 2", "O");
    let totalMoves = 0;
    let firstToGames = 5;

    // console.log(player1);
    // console.log(player2);

    const player1Name = document.querySelector('#player1-name');
    const player2Name = document.querySelector('#player2-name');
    const player1Score = document.querySelector('#player1-score');
    const player2Score = document.querySelector('#player2-score');
    const player1Symbol = document.querySelector('#player1-symbol');
    const player2Symbol = document.querySelector('#player2-symbol');
    const dialogTxt = document.querySelector('#dialogue-text');

    player1Name.textContent = `${player1.name}`;
    player2Name.textContent = `${player2.name}`;
    player1Score.textContent = `${player1.playerScore}`;
    player2Score.textContent = `${player2.playerScore}`;



    const playerSwitch = () => {
        player1.isTurn = player1.isTurn === true ? false : true;
        player2.isTurn = player1.isTurn === true ? false : true;
    }
    console.log(totalMoves);

    const playerMove = (e) => {

        let player = player1.isTurn === true ? player1 : player2;
        // console.log(e);
        if (gameArray[e.target.id] == "") {
            gameArray[e.target.id] = player.playerSymbol;
            gameBoard.updateBoard(e.target.id, player.playerSymbol);
            playerSwitch();

            checkWinner(player);
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
        if (player1.playerScore === 5 || player2.playerScore === 5) {
            if (player1.playerScore === 5) {
                dialogTxt.textContent = `${player1.name} wins the game!`;
            } else {
                dialogTxt.textContent = `${player2.name} wins the game!`;
            }
            
        }

        gameArray = new Array(9).fill("");
        gameBoard.resetBoard();
        totalMoves = 0;
        return gameArray;
    }

    let blockClick = document.querySelectorAll('.block');
    blockClick.forEach(element => element.addEventListener('click', playerMove));


    return {
        blockClick,
        checkWinner,
        playerMove
    }

})();