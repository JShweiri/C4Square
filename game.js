let canvas = document.getElementById("gc");

let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

let board = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
];

const SIZE = 90;

player = 1;

//0 is clear
//1 is black 
//2 is red

function getColHeight(x) {
    let y;
    for (y = 5; board[y][x]; y--);
    return y;
}

function doMove(player, x) {
    
    let y = getColHeight(x);

    board[y][x] = player;
    drawBoard();

    if(checkWin(board, player)){
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Player " + player +" wins!", SIZE*4 - 100, 24);
    }
}

function drawBoard(){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
           
            ctx.beginPath();
            ctx.arc((j+1)*SIZE, (i+1)*SIZE, SIZE/2, 0, 2 * Math.PI);

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


    doMove(player, Math.trunc((x-SIZE/2)/SIZE));

    //switch
    player+=1;
    player = (player%3)+Math.trunc(player/3)
}


// Add event listener for `click` events.
canvas.addEventListener('click', oncliq, false);

drawBoard();
