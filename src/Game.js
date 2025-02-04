import MovingDirection from "./MovingDirection.js";
import TileMap from "./TileMap.js";



const tileSize = 32;
const velocity = 2;







const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');
const tileMap = new TileMap(tileSize);

randomize(10,10,3);//tiles,ghosts,powerdots
console.log(tileMap);

const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);





let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio("../sounds/gameOver.wav");
const gameWinSound = new Audio("../sounds/gameWin.wav");

function gameLoop() {
    tileMap.draw(ctx);
    drawGameEnd();
    pacman.draw(ctx,pause(),enemies);
    enemies.forEach((enemy) => enemy.draw(ctx,pause(), pacman));
    checkGameOver();
    checkGameWin();
}
function checkGameOver(){
    if(!gameOver){
        gameOver = isGameOver();
        if(gameOver){
            gameOverSound.play();
        }
    }
}
function checkGameWin(){
    if(!gameWin){
        gameWin = tileMap.didWin();
        if(gameWin){
            gameWinSound.play();
        }
    }  
}
function isGameOver(){
    return enemies.some(enemy => !pacman.powerDotActive && enemy.collideWith(pacman))
}
function pause(){
    return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd(){
    if(gameOver || gameWin){
        let text = "You Win!";
        if(gameOver) {
            text = "Game Over";
        }
        ctx.fillStyle = "black";
        ctx.fillRect(0,canvas.height/3.2,canvas.clientWidth,80 );
        ctx.font = "80px comic sans";
        ctx.fillStyle = "white";
        ctx.fillText(text,10,canvas.height/2);
    }
}
    //1 = wall
    //0 = dot
    //6 = ghost
    //4 = pacman
    //5 = empty space
    //7 = power dot
function randomize(numWall,numGhosts,numPowerDot){
    
    let row;
    let column;
    let pacmanPlaced = false
    while(numWall > 0){
        row = Math.floor(Math.random() * (tileMap.map.length));
        column = Math.floor(Math.random() * (tileMap.map[0].length));
        if(tileMap.map[row][column] == 0){
            tileMap.map[row][column] = 1
            numWall --;
        }
    }
    while(numGhosts > 0){
        row = Math.floor(Math.random() * (tileMap.map.length));
        column = Math.floor(Math.random() * (tileMap.map.length));
        if(tileMap.map[row][column] == 0){
            tileMap.map[row][column] = 6;
            numGhosts --;
        }
    }
    while(numPowerDot > 0){
        row = Math.floor(Math.random() * (tileMap.map.length));
        column = Math.floor(Math.random() * (tileMap.map.length));
        if(tileMap.map[row][column] == 0){
            tileMap.map[row][column] = 7;
            numPowerDot --;
        }
    }
    console.log("function passed");
    // for(let i = 0; i<tileMap.map.length;i++){
    //     for(let j = 0; j< tileMap.map[i].length;j++){
    //         console.log(tileMap.map[i][j]);
    //     }
    // }
    while(!pacmanPlaced){
        row = Math.floor(Math.random() * (tileMap.map.length));
        column = Math.floor(Math.random() * (tileMap.map.length));
        if(tileMap.map[row][column] == 0){
            tileMap.map[row][column] = 4;
            pacmanPlaced = true;
        }
    }

}
tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 10);
