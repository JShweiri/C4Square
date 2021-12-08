let canvas = document.getElementById("gc");

let ctx = canvas.getContext("2d");

const CIRCLE_SIZE = 90;

canvas.width = CIRCLE_SIZE*8;
canvas.height = CIRCLE_SIZE * 7;

let board = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
];

//0 is clear
//1 is black 
//2 is red
player = 1;

ROW_COUNT = 6;
COLUMN_COUNT = 7;

function createBoard(rows, cols) {
    return Array.from({
      // generate array of length m
      length: rows
      // inside map function generate array of size n
      // and fill it with `0`
    }, () => new Array(cols).fill(0));
  };

function resetGame() {
    board = createBoard(ROW_COUNT, COLUMN_COUNT);
    drawBoard();
}

function isValidLocation(board, col) {
    return board[0][col] == 0
}

function getValidLocations(board) {
    locations = [];
    for (let col = 0; col < COLUMN_COUNT; col++) {
        if (isValidLocation(board, col)) {
            locations.push(col);
        }
    }
    return locations;
}

function drop_piece(col) {
    //get the row
    let row = getColHeight(board, col);

    if (y < 0) {
        console.log("Invalid move");
        return;
    }

    //set the piece
    board[row][col] = player;
    //draw the piece
    drawBoard();
}

function getColHeight(board, x) {
    let y;
    for (y = 5; y >=0 && board[y][x]; y--);
    return y;
}

function doMove1Player(x) {
    
    drop_piece(x);

    if(checkWin(board, player)){
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Player " + player +" wins!", CIRCLE_SIZE*4 - 100, 24);
        return;
    }

    player = player == 1 ? 2 : 1;
    
    let col = AIMove(board);
    drop_piece(col);


    if(checkWin(board, player)){
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Player " + player +" wins!", CIRCLE_SIZE*4 - 100, 24);
        return;
    }

    player = player == 1 ? 2 : 1;

}

function doMove2Player(x) {
    
    let y = getColHeight(board, x);

    if (y < 0) {
        console.log("Invalid move");
        return;
    }

    board[y][x] = player;
    
    drawBoard();

    if(checkWin(board, player)){
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Player " + player +" wins!", CIRCLE_SIZE*4 - 100, 24);
    }

    player = player == 1 ? 2 : 1;
}

function drawBoard() {
    ctx.fillStyle = "lightblue";
    ctx.rect(0, 0, CIRCLE_SIZE*8, CIRCLE_SIZE*7);
    ctx.fill();
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
           
            ctx.beginPath();
            ctx.arc((j+1)*CIRCLE_SIZE, (i+1)*CIRCLE_SIZE, CIRCLE_SIZE/2, 0, 2 * Math.PI);

            if(board[i][j] == 0){
                ctx.fillStyle = "gray";
            }
            
            if(board[i][j] == 1){
                ctx.fillStyle = "black";
            }

            if(board[i][j] == 2){
                ctx.fillStyle = "red";
            }

            ctx.fill();
            
        }
    }

}

function isTerminalNode(board){
    return winning_move(board, PLAYER_PIECE) || winning_move(board, AI_PIECE) || len(get_valid_locations(board)) == 0;
}

function positionScore(board, player) {
    let score = 0;
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            for (let n = 1; n < 6; n++) {
                if (board[y][x] == player && ((y + n) < 6) && ((x + n) < 7)) {
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
    oppPlayer = player == 1 ? 2 : 1;
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
    } else if (numOpposing == 3 && numPlayer == 0) {
        score -= 4
    }

return score
}

function checkWin(board, player){
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            for (let n = 1; n < 6; n++){
                if (board[y][x] == player && ((y + n) < 6) && ((x + n) < 7)){
                    if (board[y][x] == player && board[y][x] == board[y + n][x] && board[y][x] == board[y][x + n] && board[y][x] == board[y + n][x + n]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}





function oncliq(event) {

    let canvasLeft = canvas.offsetLeft;
    //let canvasTop = canvas.offsetTop;

    let x = event.pageX - canvasLeft;
    //let y = event.pageY - canvasTop;

    let col = Math.trunc((x - CIRCLE_SIZE / 2) / CIRCLE_SIZE);

    // doMove1Player(col);
    doMove2Player(col);
}


// Add event listener for `click` events.
canvas.addEventListener('click', oncliq, false);

drawBoard();
