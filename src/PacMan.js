import MovingDirection from "./MovingDirection.js";
import TileMap from "./TileMap.js";

export default class Pacman {
    constructor(x, y, tileSize, velocity, tileMap) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap;

        this.currentMovingDirection = null;
        this.requestedMovingDirection = null;

        this.pacmanAnimationTimerDefault = 10;
        this.pacmanAnimationTimer = null;

        document.addEventListener("keydown", this.#keydown);

        this.pacmanRotation = this.Rotation.right;
        this.wakaSound = new Audio("../sounds/waka.wav");
        
        this.powerDotSound = new Audio("../sounds/power_dot.wav");
        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
        this.timers = [];

        this.#loadPacmanImages();
        this.madeFirstMove = false;
        
    }

    Rotation = {
        right:0,
        down:1,
        left:2,
        up:3
    }

    draw(ctx) {
        
        this.#move();
        this.#animate(this.tileMap);
        this.#eatDot();
        this.#eatPowerDot();
        //ctx.drawImage(this.pacmanImages[this.pacmanImageIndex], this.x, this.y, this.tileSize, this.tileSize);
        
        const size = this.tileSize/2;
        ctx.save();
        ctx.translate(this.x + size, this.y + size);
        ctx.rotate((this.pacmanRotation * 90 * Math.PI)/180);
        ctx.drawImage(this.pacmanImages[this.pacmanImageIndex], -size, -size, this.tileSize, this.tileSize);
        
        ctx.restore();
    }
    

    #loadPacmanImages() {
        const pacmanImage1 = new Image();
        pacmanImage1.src = "../images/pac0.png";

        const pacmanImage2 = new Image();
        pacmanImage2.src = "../images/pac1.png";

        const pacmanImage3 = new Image();
        pacmanImage3.src = "../images/pac2.png";

        const pacmanImage4 = new Image();
        pacmanImage4.src = "../images/pac1.png";

        this.pacmanImages = [pacmanImage1, pacmanImage2, pacmanImage3, pacmanImage4];
        this.pacmanImageIndex = 1;
    }

    #keydown = (event) => {
        switch (event.keyCode) {
            case 38: // Up arrow
                this.requestedMovingDirection = MovingDirection.up;
                this.pacmanRotation = this.Rotation.up;
                this.madeFirstMove = true;
                break;
            case 40: // Down arrow
                this.requestedMovingDirection = MovingDirection.down;
                this.pacmanRotation = this.Rotation.down;
                this.madeFirstMove = true;
                break;
            case 37: // Left arrow
                this.requestedMovingDirection = MovingDirection.left;
                this.pacmanRotation = this.Rotation.left;
                this.madeFirstMove = true;
                break;
            case 39: // Right arrow
                this.requestedMovingDirection = MovingDirection.right;
                this.pacmanRotation = this.Rotation.right;
                this.madeFirstMove = true;
                break;
        }
    };

    #move() {
        if (Number.isInteger(this.x / this.tileSize) && Number.isInteger(this.y / this.tileSize)) {
            if(!this.tileMap.didCollideWithEnvironment(this.x,this.y,this.requestedMovingDirection)){
                
                this.currentMovingDirection = this.requestedMovingDirection;
            } 
        }
        if(this.tileMap.didCollideWithEnvironment(this.x,this.y,this.currentMovingDirection)){
            return;
        }else if( this.currentMovingDirection != null && this.pacmanAnimationTimer == null){
            this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
        }
        switch (this.currentMovingDirection) {
            case MovingDirection.up:
                this.y -= this.velocity;
                break;
            case MovingDirection.down:
                this.y += this.velocity;
                break;
            case MovingDirection.left:
                this.x -= this.velocity;
                break;
            case MovingDirection.right:
                this.x += this.velocity;
                break;
        }
    }
    #animate(){
        if(this.pacmanAnimationTimer == null){
            return;
        }
        this.pacmanAnimationTimer--;
        if(this.pacmanAnimationTimer == 0){
            this.pacmanImageIndex++;
            this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
            
        }
        if(this.pacmanImageIndex == this.pacmanImages.length){
            this.pacmanImageIndex = 0;
        }
    }
    #eatDot(){
        //console.log(this.tileMap.eatDot(this.x, this.y))
        if(this.tileMap.eatDot(this.x, this.y)){
            //console.log("play");
            //this.wakaSound.play();
        }
    }
    #eatPowerDot(){
        if(this.tileMap.eatPowerDot(this.x,this.y)){
            //console.log("eaten");
            this.powerDotSound.play();
            this.powerDotActive = true;
            this.powerDotAboutToExpire = false;
            this.timers.forEach((timer) => clearTimeout(timer));
            this.timers = [];
            
            let powerDotTimer = setTimeout(()=>{
                this.powerDotActive = false;
                this.pacmanAnimationTimerDefault = false;
            },1000*6)
            
            

            this.timers.push(powerDotTimer);

            let powerDotAboutToExpireTimer = setTimeout(()=>{
                this.powerDotAboutToExpire = true;
            },1000*3);

            this.timers.push(powerDotAboutToExpireTimer);
        }
         
    }

}
