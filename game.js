let canvas = document.getElementById("gc");

let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

let board = [
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
];

const SIZE = 90;

player = 1;

//0 is clear
//1 is black 
//2 is red

function doMove(player, x){

    let y;
    for(y = 5; board[x][y]; y--);

    board[x][y] = player;
    drawBoard();

    if(checkWin(player, x, y)){
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Player " + player +" wins!", SIZE*4 - 100, 24);
    }
}

function drawBoard(){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
           
            ctx.beginPath();
            ctx.arc((i+1)*SIZE, (j+1)*SIZE, SIZE/2, 0, 2 * Math.PI);

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

function checkWin(player, x, y){
    for(let i = 1; i < 6; i++){
         if(x+i <= 6 && y+i <= 5){
            if(board[x+i][y] == player && board[x][y+i] == player && board[x+i][y+i] == player){
                //console.log(x, y, i)
                return true;
            }
        }

        // if(x+i <= 6 && y-i >= 0){
        //     if(board[x+i][y] == player && board[x][y-i] == player && board[x+i][y-i] == player){
        //         console.log(x, y, i)
        //         return true;
        //     }
        // }

        if(x-i >= 0 && y+i <= 5){
            if(board[x-i][y] == player && board[x][y+i] == player && board[x-i][y+i] == player){
                //console.log(x, y, i)
                return true;
            }
        }

        // if(x-i >= 0 && y-i >= 0){
        //     if(board[x-i][y] == player && board[x][y-i] == player && board[x-i][y-i] == player){
        //         console.log(x, y, -i)
        //         return true;
        //     }
        // }
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
