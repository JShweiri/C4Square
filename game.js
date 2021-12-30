let canvas = document.getElementById("gc");

let ctx = canvas.getContext("2d");

const CIRCLE_SIZE = 90;

//0 is clear
//1 is black (human)
//2 is red (AI)
const BLACK_PIECE = 1;
const RED_PIECE = 2;

var P1DEPTH = 5;
var P2DEPTH = 5;

var ROW_COUNT = 6;
var COLUMN_COUNT = 7;

var P1Human = true;
var P2Human = false;

var player1UseMiniMax = true;
var player2UseMiniMax = true;
var P1N = 5000;
var P2N = 5000;

let board = createBoard(ROW_COUNT, COLUMN_COUNT);

function radioClicked(n) {
    numPlayers = n;
    setHTMLVisibility();
}

function setHTMLVisibility() {
    if (P1Human == false) {
        document.getElementById("P1MM").style.display = "inline";

        if (player1UseMiniMax) {
            document.getElementById("P1depthbox").style.display = "inline";
            document.getElementById("P1Nbox").style.display = "none";
        } else {
            document.getElementById("P1depthbox").style.display = "none";
            document.getElementById("P1Nbox").style.display = "inline";
        }

    } else {
        document.getElementById("P1MM").style.display = "none";
        document.getElementById("P1depthbox").style.display = "none";
        document.getElementById("P1Nbox").style.display = "none";

    }
    if (P2Human == false) {
        document.getElementById("P2MM").style.display = "inline";

        if (player2UseMiniMax) {
            document.getElementById("P2depthbox").style.display = "inline";
            document.getElementById("P2Nbox").style.display = "none";
        } else {
            document.getElementById("P2depthbox").style.display = "none";
            document.getElementById("P2Nbox").style.display = "inline";
        }

    } else {
        document.getElementById("P2MM").style.display = "none";
        document.getElementById("P2depthbox").style.display = "none";
        document.getElementById("P2Nbox").style.display = "none";
    }
}

function setHuman() {
    P1Human = document.getElementById("P1human").checked;
    P2Human = document.getElementById("P2human").checked;
    setHTMLVisibility();
}

function setDepthVisibility() {
    player1UseMiniMax = document.getElementById("P1miniMax").checked;
    player2UseMiniMax = document.getElementById("P2miniMax").checked;
    setHTMLVisibility();
}

function formSub() {
    ROW_COUNT = parseInt(document.getElementById("height").value);
    COLUMN_COUNT = parseInt(document.getElementById("width").value);
    P1N = parseInt(document.getElementById("P1n").value);
    P1DEPTH = parseInt(document.getElementById("P1depth").value);
    P2N = parseInt(document.getElementById("P2n").value);
    P2DEPTH = parseInt(document.getElementById("P2depth").value);

    resetGame();
}

function min(a, b) {
    return a < b ? a : b;
}

function createBoard(rows, cols) {
    return Array.from({ length: rows }, () => new Array(cols).fill(0));
};

function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = CIRCLE_SIZE * (COLUMN_COUNT + 1);
    canvas.height = CIRCLE_SIZE * (ROW_COUNT + 1);
    player = BLACK_PIECE;
    board = createBoard(ROW_COUNT, COLUMN_COUNT);
    drawBoard();
}

function isValidLocation(b, col) {
    return (b[0][col] == 0);
}

function getValidLocations(b) {
    let locations = [];
    for (let col = 0; col < COLUMN_COUNT; col++) {
        if (isValidLocation(b, col)) {
            locations.push(col);
        }
    }
    return locations;
}

function makeMove(b, col, p) {
    let row = getColHeight(b, col);

    if (row < 0) {
        throw new Error("Invalid move: " + col + " " + row);
    }

    //set the piece
    b[row][col] = p;

    return b;
}

function undoMove(b, col) {
    let row = getColHeight(b, col) + 1;

    if (row < 0 || row >= ROW_COUNT) {
        return;
    }

    //set the piece
    b[row][col] = 0;

    return b;
}

function drop_piece(b, col, p) {
    //get the row
    let row = getColHeight(b, col);

    if (row < 0) {
        throw new Error("Invalid move: " + col + " " + row);
    }

    //set the piece
    b[row][col] = p;
    //draw the piece
    drawBoard();

    return b;
}

function getColHeight(board, x) {
    let y;
    for (y = ROW_COUNT - 1; y >= 0 && board[y][x]; y--);
    return y;
}

function doMove1Player(x) {

    if (P1Human) {
        board = drop_piece(board, x, player);
    } else {

        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Thinking..", CIRCLE_SIZE * (COLUMN_COUNT + 1) / 2, CIRCLE_SIZE * (ROW_COUNT + 0.5) + 30);

        if (player1UseMiniMax) {
            let [col, minimax_score] = minimax(board, P1DEPTH, false);
            console.log(col + " " + minimax_score);
            board = drop_piece(board, col, player);

        } else {
            let col = MCBestMove(board, player, P1N);

            console.log(col);

            board = drop_piece(board, col, player);
        }
    }

    if (checkWin(board, player)) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Player " + player + " wins!", CIRCLE_SIZE * (COLUMN_COUNT + 1) / 2, 30);
        return;
    }

    player = player == 1 ? 2 : 1;

    // console.log(board);

    setTimeout(() => {



        if (P2Human) {
            board = drop_piece(board, x, player);
        } else {
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText("Thinking..", CIRCLE_SIZE * (COLUMN_COUNT + 1) / 2, CIRCLE_SIZE * (ROW_COUNT + 0.5) + 30);

            if (player2UseMiniMax) {
                let [col, minimax_score] = minimax(board, P2DEPTH, true);
                console.log(col + " " + minimax_score);
                board = drop_piece(board, col, player);

            } else {
                let col = MCBestMove(board, player, P2N);

                console.log(col);

                board = drop_piece(board, col, player);
            }
        }

        if (checkWin(board, player)) {
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText("Player " + player + " wins!", CIRCLE_SIZE * (COLUMN_COUNT + 1) / 2, 30);
            return;
        }

        player = player == 1 ? 2 : 1;

    }, 10);


}

function drawBoard() {
    ctx.fillStyle = "lightblue";
    ctx.rect(0, 0, CIRCLE_SIZE * (COLUMN_COUNT + 1), CIRCLE_SIZE * (ROW_COUNT + 1));
    ctx.fill();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {

            ctx.beginPath();
            ctx.arc((j + 1) * CIRCLE_SIZE, (i + 1) * CIRCLE_SIZE, CIRCLE_SIZE / 2, 0, 2 * Math.PI);

            if (board[i][j] == 0) {
                ctx.fillStyle = "gray";
            }

            if (board[i][j] == 1) {
                ctx.fillStyle = "black";
            }

            if (board[i][j] == 2) {
                ctx.fillStyle = "red";
            }

            ctx.fill();

        }
    }

}

function isTerminalNode(board) {
    return checkWin(board, BLACK_PIECE) || checkWin(board, RED_PIECE) || getValidLocations(board).length == 0;
}

function positionScore(board, player) {
    let score = 0;
    for (let x = 0; x < COLUMN_COUNT; x++) {
        for (let y = 0; y < ROW_COUNT; y++) {
            for (let n = 1; n < min(COLUMN_COUNT, ROW_COUNT); n++) {
                if (board[y][x] == player && ((y + n) < ROW_COUNT) && ((x + n) < COLUMN_COUNT)) {
                    score += evaluateSquare([board[y][x], board[y][x + n], board[y + n][x], board[y + n][x + n]], player);
                }
            }
        }
    }
    return score;
}

function evaluateSquare(corners, player) {
    let score = 0;
    let numPlayer = 0;
    let numOpposing = 0;

    let oppPlayer = player;
    if (player == BLACK_PIECE) {
        oppPlayer = RED_PIECE;
    } else {
        oppPlayer = BLACK_PIECE;
    }
    for (let i = 0; i < corners.length; i++) {
        if (corners[i] == player) {
            numPlayer++;
        }
        if (corners[i] == oppPlayer) {
            numOpposing++;
        }
    }
    if (numPlayer == 4) {
        score += 100
    } else if (numPlayer == 3 && numOpposing == 0) {
        score += 5
    } else if (numPlayer == 2 && numOpposing == 0) {
        score += 2
    }
    if (numOpposing == 3 && numPlayer == 0) {
        score -= 4
    }

    return score
}

function checkDraw(board) {
    for (let x = 0; x < COLUMN_COUNT; x++) {
        for (let y = 0; y < ROW_COUNT; y++) {
            if (board[y][x] == 0) {
                return false;
            }
        }
    }
    return true;
}

function checkWin(board, player) {
    for (let x = 0; x < COLUMN_COUNT; x++) {
        for (let y = 0; y < ROW_COUNT; y++) {
            for (let n = 1; n < min(COLUMN_COUNT, ROW_COUNT); n++) {
                if (board[y][x] == player && ((y + n) < ROW_COUNT) && ((x + n) < COLUMN_COUNT)) {
                    if (board[y][x] == player && board[y][x] == board[y + n][x] && board[y][x] == board[y][x + n] && board[y][x] == board[y + n][x + n]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}









function playoutValue(board, currentPlayer) {
    let opposingPlayer = currentPlayer == BLACK_PIECE ? RED_PIECE : BLACK_PIECE;

    //other player just went, check if they won or drew
    if (checkWin(board, opposingPlayer)) {
        return -1;
    }
    if (checkDraw(board)) {
        return 0;
    }

    let validLocations = getValidLocations(board);

    let col = validLocations[Math.floor(Math.random() * validLocations.length)];

    board = makeMove(board, col, currentPlayer);

    value = -playoutValue(board, opposingPlayer);

    board = undoMove(board, col);

    return value
}

function monteCarloValue(board, currentPlayer, N) {
    scores = [];
    for (let i = 0; i < N; i++) {
        scores.push(playoutValue(board, currentPlayer));
    }
    return scores.reduce((a, b) => a + b) / N;
}

function MCBestMove(board, currentPlayer, N) {
    let validLocations = getValidLocations(board);
    let opposingPlayer = currentPlayer == BLACK_PIECE ? RED_PIECE : BLACK_PIECE;


    action_dict = {}
    for (let i = 0; i < validLocations.length; i++) {
        let col = validLocations[i];
        board = makeMove(board, col, currentPlayer);
        action_dict[validLocations[i]] = -monteCarloValue(board, opposingPlayer, N);
        board = undoMove(board, col);
    }

    console.log(action_dict);

    mm = -Infinity;
    mv = [];
    for (const [key, value] of Object.entries(action_dict)) {
        if (value > mm) {
            mm = value;
            mv = key;
        }
    }
    return mv;
}










function minimax(b, depth, maximizingPlayer) {
    let validLocations = getValidLocations(b);
    let isTerminal = isTerminalNode(b);

    if (isTerminal) {
        if (checkWin(b, RED_PIECE)) {
            return [0, 100000000000000];
        } else if (checkWin(b, BLACK_PIECE)) {
            return [0, -10000000000000];
        } else {
            return [0, 0];
        }
    }

    if (depth == 0) {
        return [0, positionScore(b, RED_PIECE)];
    }

    if (maximizingPlayer) {
        let value = -Infinity;
        let column = validLocations[Math.floor(Math.random() * validLocations.length)];
        for (let i = 0; i < validLocations.length; i++) {
            let c = validLocations[i];
            board = makeMove(board, c, RED_PIECE);
            let new_score = minimax(board, depth - 1, false)[1];
            board = undoMove(board, c);
            if (new_score > value) {
                value = new_score;
                column = c;
            }
        }
        return [column, value]
    } else {
        let value = Infinity;
        let column = validLocations[Math.floor(Math.random() * validLocations.length)];
        for (let i = 0; i < validLocations.length; i++) {
            let c = validLocations[i];
            board = makeMove(board, c, BLACK_PIECE);
            let new_score = minimax(board, depth - 1, true)[1];
            board = undoMove(board, c);
            if (new_score < value) {
                value = new_score;
                column = c;
            }
        }
        return [column, value];
    }
}

function oncliq(event) {

    let canvasLeft = canvas.offsetLeft;
    //let canvasTop = canvas.offsetTop;

    let x = event.pageX - canvasLeft;
    //let y = event.pageY - canvasTop;

    let col = Math.trunc((x - CIRCLE_SIZE / 2) / CIRCLE_SIZE);

    doMove1Player(col);
}

resetGame();
// Add event listener for `click` events.
canvas.addEventListener('click', oncliq, false);