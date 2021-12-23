let canvas = document.getElementById("gc");

let ctx = canvas.getContext("2d");

const CIRCLE_SIZE = 90;

const DEPTH = 4;

//0 is clear
//1 is black (human)
//2 is red (AI)
const PLAYER_PIECE = 1;
const AI_PIECE = 2;

player = PLAYER_PIECE;

const ROW_COUNT = 6;
const COLUMN_COUNT = 7;

canvas.width = CIRCLE_SIZE*(COLUMN_COUNT+1);
canvas.height = CIRCLE_SIZE * (ROW_COUNT+1);

let board = createBoard(ROW_COUNT, COLUMN_COUNT);

function createBoard(rows, cols) {
    return Array.from({length: rows}, () => new Array(cols).fill(0));
  };

function resetGame() {
    board = createBoard(ROW_COUNT, COLUMN_COUNT);
    drawBoard();
}

function isValidLocation(b, col) {
    return (b[0][col] == 0);
}

function getValidLocations(b) {
    locations = [];
    for (let col = 0; col < COLUMN_COUNT; col++) {
        // if (col == 0) { console.log("hi: ", board); }
        if (isValidLocation(b, col)) {
            locations.push(col);
        }
    }
    return locations;
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
    for (y = ROW_COUNT-1; y >= 0 && board[y][x]; y--);
    return y;
}

function doMove1Player(x) {
    
    board = drop_piece(board, x, player);

    if(checkWin(board, player)){
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Player " + player +" wins!", CIRCLE_SIZE*4, 30);
        return;
    }

    player = player == 1 ? 2 : 1;
    
  console.log(board);
  
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Thinking..", CIRCLE_SIZE * 4, CIRCLE_SIZE * 6.5 + 30);

  setTimeout(() => {

    let [col, minimax_score] = minimax(board, DEPTH, true);

    board = drop_piece(board, col, player);


    if(checkWin(board, player)){
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Player " + player +" wins!", CIRCLE_SIZE*4, 30);
        return;
    }

    player = player == 1 ? 2 : 1;

  }, 10);


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
    return checkWin(board, PLAYER_PIECE) || checkWin(board, AI_PIECE) || getValidLocations(board).length == 0;
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
  
  let oppPlayer = player;
  if (player == PLAYER_PIECE) {
     oppPlayer = AI_PIECE;
  } else {
    oppPlayer = PLAYER_PIECE;
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


function minimax(b, depth, maximizingPlayer) {
  let validLocations = getValidLocations(b);
  console.log(validLocations);
    let isTerminal = isTerminalNode(b);

    if (isTerminal){
        if (checkWin(b, AI_PIECE)){
            return [0, 100000000000000];
        } else if (checkWin(b, PLAYER_PIECE)) {
            return [0, -10000000000000];
        } else {
            return [0, 0];
        }
    }

    if (depth == 0) {
        return [0, positionScore(b, AI_PIECE)];
    }

    if (maximizingPlayer) {
      value = -Infinity;
      column = validLocations[Math.floor(Math.random()*validLocations.length)];
      for (let i = 0; i < validLocations.length; i++) {
        c = validLocations[i];
        let b_copy = JSON.parse(JSON.stringify(b));
            // console.log(JSON.stringify(board));
            b_copy = drop_piece(b_copy, c, AI_PIECE);
            new_score = minimax(b_copy, depth - 1, false)[1];
            if (new_score > value) {
                value = new_score;
                column = c;
            }
        }
        return [column, value]
    } else {
        value = Infinity;
        column = validLocations[Math.floor(Math.random()*validLocations.length)];
      for (let i = 0; i < validLocations.length; i++) {
          c = validLocations[i];
          let b_copy = JSON.parse(JSON.stringify(b));
            b_copy = drop_piece(b_copy, c, PLAYER_PIECE);
            new_score = minimax(b_copy, depth - 1, true)[1];
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
    // doMove2Player(col);
}


// Add event listener for `click` events.
canvas.addEventListener('click', oncliq, false);

drawBoard();