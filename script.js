window.onload = function () {
    var playerName = ""
    var canvas = document.getElementById("track");
    ctx = canvas.getContext("2d")
    var frameCounter = 0;
    var asteroidsArray = [];
    var bulletsArray = [];
    var bulletsEnemyArray = []
    var posY = 160;
    var posX = 110;
    var tipPosX;
    var tipPosY;
    var points = 0;
    var background = new Image()
    background.src = 'background-static.png'
    var asteroidImage = new Image()
    asteroidImage.src = "asteroid.png"
    spaceShipImage = new Image()
    spaceShipImage.src = "enemy.png"
    var enemyShipImage = new Image();
    enemyShipImage.src = 'enemy.png'
    var enemiesArray = []
    var highscore = []
    var soundShoot;
    var soundAsteroid
    soundShoot = new Audio("shoot.wav")
    asteroidDestroyed = new Audio("asteroid.wav")

    var backgroundImage = {
        img: background,
        x: 0,
        speed: -1,

        move: function () {
            this.x += this.speed;
            this.x %= canvas.width;
        },

        draw: function () {
            ctx.drawImage(this.img, this.x, 0);
            if (this.speed < 0) {
                ctx.drawImage(this.img, this.x + canvas.width, 0);
            } else {
                ctx.drawImage(this.img, this.x - this.img.width, 0);
            }
        }
    }
    function drawSpaceShip() {
        tipPosX = posX + 20
        tipPosY = posY + 25
        ctx.drawImage(spaceShipImage, tipPosX - 40, tipPosY - 25, 50, 50)
    }

    var gameOver = false;

    function updateCanvas() {
        if (gameOver) return;
        frameCounter++;
        backgroundImage.move()

        ctx.clearRect(0, 0, 690, 380)
        backgroundImage.draw()
        drawSpaceShip()

        if (frameCounter % 150 === 0) {
            var randomPosition = Math.floor(Math.random() * 360)
            asteroidsArray.push({ posX: 680, posY: randomPosition })
        

        }

        for (var i = 0; i < asteroidsArray.length; i++) {
            randomPositionAsteroid = Math.floor(Math.random() * 2)
            if (asteroidsArray[i].level2) {
                asteroidsArray[i].posX -= 2
                if (asteroidsArray[i].direction === "up") {
                    asteroidsArray[i].posY -= 0.7;
                } else {
                    asteroidsArray[i].posY += 0.7;
                }
            } else {
                asteroidsArray[i].posX -= 2;
            }
            if (!asteroidsArray[i].level2) {
                ctx.drawImage(asteroidImage, asteroidsArray[i].posX, asteroidsArray[i].posY, 25, 25);
            } else {
                ctx.drawImage(asteroidImage, asteroidsArray[i].posX, asteroidsArray[i].posY, 22, 22);
            }

            if (
                intersect(
                    { x: asteroidsArray[i].posX, y: asteroidsArray[i].posY, height: 15, width: 15 },
                    { x: posX, y: posY, width: 20, height: 50 }
                )

            ) {
                $(".grid-container").append("<h1 class='game-over'>GAME OVER</h1>");
                gameOver = true;
                setTimeout(function(){                    
                    location.reload()
                },2000)
              
            }
            console.log(asteroidsArray[i].posX)
        }
        if (shooting) {
            if (frameCounter % 10 === 0) {
                bulletsArray.push({ posX: tipPosX + 2, posY: tipPosY })
                soundShoot.play()
            }
        }
        if (movingForward) {
            if(posX>659){
                posX = 659;
            }
            posX += 3;
        }

        if (movingBack) {
            if(posX<23){
                posX = 23;
            }
            posX -= 3;
        }

        if (movingUp) {
            if (posY < 10) {
                posY = 10;
            }
            posY -= 3;
        }

        if (movingDown) {
            if (posY > 320) {
                posY = 320;
            }
            posY += 3;
        }
        for (var i = 0; i < bulletsArray.length; i++) {
            bulletsArray[i].posX += 9;
            ctx.fillStyle = "#C3BF47"
            ctx.fillRect(bulletsArray[i].posX, bulletsArray[i].posY, 3, 3);
             for (var j = 0; j < asteroidsArray.length; j++) {
                let inter = intersect(
                    { x: bulletsArray[i].posX, y: bulletsArray[i].posY, height: 3, width: 3 },
                    { x: asteroidsArray[j].posX, y: asteroidsArray[j].posY, height: 15, width: 15 }
                )   
                if (inter) {
                    asteroidDestroyed.play()

                    if (!asteroidsArray[j].level2) {
                        asteroidsArray.push({ posX: asteroidsArray[j].posX, posY: asteroidsArray[j].posY - 25, level2: true, direction: "up" })
                        asteroidsArray.push({ posX: asteroidsArray[j].posX, posY: asteroidsArray[j].posY + 25, level2: true, direction: "down" })

                    }
                    bulletsArray.splice(i, 1)
                    asteroidsArray.splice(j, 1)
                    asteroidDestroyed.play()
                    points += 1;
                    $("#sum-points").html(points)
                    break;
                }

            }
            deleteBullet()
            deleteAsteroid()
        }
    
        //deleteBullet()

        
        window.requestAnimationFrame(updateCanvas);
    }
    var shooting = false;
    var movingUp = false;
    var movingDown = false;
    var movingForward = false;
    var movingBack = false;

    document.onkeydown = function (event) {
        var key = event.keyCode;
        switch (key) {
            case 38:
                movingUp = true;
                break;
            case 40:
                movingDown = true;
                break;
            case 39:
                movingForward = true;
                break;
            case 37:
                movingBack = true;
                console.log(posX)
                break;
            case 32:
                shooting = true;
                break
        }
    }
    document.onkeyup = function (event) {
        var key = event.keyCode;
        switch (key) {
            case 38:
                movingUp = false;
                break;
            case 40:
                movingDown = false;
                break;
            case 39:
                movingForward = false;
                break;
            case 37:
                movingBack = false;
                break;
            case 32:
                shooting = false;
                break;
        }
    }
    var gameStarted = false
    document.getElementById("start-button").onclick = function () {
        playerName = $("#name").val().toUpperCase()
        $("#player-name").html(playerName)
        $("#name").val("")
        if (gameStarted) return;
        drawSpaceShip()
        updateCanvas()
        gameStarted = true;
    }

    function intersect(rect1, rect2) {
        rect1left = rect1.x;
        rect1top = rect1.y;
        rect1right = rect1.x + rect1.width;
        rect1bottom = rect1.y + rect1.height;
        rect2left = rect2.x;
        rect2top = rect2.y;
        rect2right = rect2.x + rect2.width;
        rect2bottom = rect2.y + rect2.height;
        return !(
            rect1left > rect2right ||
            rect1right < rect2left ||
            rect1top > rect2bottom ||
            rect1bottom < rect2top
        );
    }   
    
   
    console.log(highscore)

    function storeLocalstorage(){
        name = highscore.push(playerName)
        localStorage.setItem("Name", name)
        console.log(highscore)
        
    }

    function readLocalstorage(){
        var nameR = localStorage.getItem("Name")
        document.getElementById("test").innerHTML = nameR
    }

    function deleteBullet(){
        for(var i = 0;i<bulletsArray.length;i++){
            if(bulletsArray[i].posX>691){
                bulletsArray.splice(bulletsArray[i],1)
            }
        }
    }

    function deleteAsteroid(){
        for(var i = 0;i<asteroidsArray.length;i++){
            if(asteroidsArray[i]<20){
                asteroidsArray.splice(asteroidsArray[i],1)
            }
        }
    }

    

}
