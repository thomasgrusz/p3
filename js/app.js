/*
 *  Define Enemy class and corresponding prototype methods.
 *  This function is called at the bottom of app.js using the 'new' keyword to
 *  instantiate enemy objects.
 *  Using the Enemy class ensures encapsulation of properties and prototype
 *  functions.
 *  The yCoords array is used to fit objects within background tiles along
 *  the y-axis.
 */
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.yCoords = [-23, 60, 143, 226, 309, 392];
    this.width = 101;
};

/*  Reset an enemy object by placing it left off screen and assigning a random
 *  y-axis and random speed and reseting the collisionFlag for
 *  player-collisions to false.
 *  This function is called from the enemy.update() prototype function in
 *  app.js and the reset() function in engine.js.
 */
Enemy.prototype.reset = function() {
    this.x = -100;
    this.y = this.yCoords[random_number(1, 3)];
    this.speed = random_number(100, 400);
    this.collisionFlag = false;
};

/*
 *  Check if the enemy object is oncreen and if yes increase the x-coordinate
 *  by speed * time-delta (dt). Time-delta ensures a constant speed over various
 *  devices. If the enemy object has left the screen on the richt it will be
 *  reset by calling the enemy.reset() prototype function.
 *  If there is a collision with the player, the enemy gets reset and the player
 *  gets placed at its starting x,y-position and loses a life.
 *  This function is called from the updateEntities() function in engine.js.
 */
Enemy.prototype.update = function(dt) {
    if (this.x < 505) {
        this.x = this.x + (this.speed * dt);
    } else {
        this.reset();
    }
    if (this.collisionFlag === true) {
        player.x = player.xOrigin;
        player.y = player.yOrigin;
        player.lives--;
        this.reset();
    }
};

/*  Render an enemy object on the canvas.
 *  This function is called from the renderEntities() function in engine.js.
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 *  Define Player class and corresponding prototype methods.
 *  This function is called at the bottom of app.js using the 'new' keyword to
 *  instantiate a player object.
 *  The xCoords and yCoords arrays are used to fit the player object within
 *  background tiles. emptyPixelOffset defines the number of empty pixels to
 *  the left and right of the player sprite. The characters-array holds the
 *  various player images that can be chosen from at the beginning of the
 *  game. CharacterSelectedFlag is set to false as no player image has
 *  been chosen yet. StartScreenDisplay is set to true and startFirstGame to
 *  false, so that the startscreen info panel will be displayed.
 *  The selectorBoxXCoords array contains the x-coords for the lightgreen
 *  box drawn around the selected character image at the beginning the game.
 */
var Player = function() {
    this.xCoords = [1, 101, 201, 301, 401];
    this.yCoords = [-11, 72, 155, 238, 321, 404];
    this.xOrigin = this.xCoords[2];
    this.yOrigin = this.yCoords[5];
    this.leftBorder = this.xCoords[0];
    this.rightBorder = this.xCoords[4];
    this.upperBorder = this.yCoords[0];
    this.lowerBorder = this.yCoords[5];
    this.waterBorder = 72;
    this.width = 101;
    this.emptyPixelOffset = 17;
    this.characters = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];
    this.characterSelectedFlag = false;
    this.startScreenDisplay = true;
    this.startFirstGame = false;
    this.selectorBoxXCoords = [40, 130, 215, 310, 400];
};

/*  Reset the player object by placing it to its starting position, assigning
 *  3 lives and setting the score to 0.
 *  The x-coordinate for the lightgreen selector box is set to be drawn around
 *  the first player image in the the player.characters array.
 *  This function is called from the reset() function in engine.js.
 */
Player.prototype.reset = function() {
    this.x = player.xOrigin;
    this.y = player.yOrigin;
    this.lives = 3;
    this.alive = true;
    this.score = 0;
    this.selectorBox = 0;
    this.anotherGameFlag = false;
    this.gameWon = false;
};

/*  Update the player object by checking the remaining number of lives and if
 *  there are no lives left the player.alive property is set to false, i.e.
 *  the player dies. Check if the player has reached the water and if yes,
 *  place the player to its starting position and increase the score by 10
 *  points.
 *  This function is called from the updateEntities() function in engine.js.
 */
Player.prototype.update = function() {
    if (this.lives <= 0) {
        this.alive = false;
    }
    if (this.y < player.waterBorder) {
        this.x = player.xOrigin;
        this.y = player.yOrigin;
        player.score += 10;
    }
};

/* Render the player object and heart icons on canvas, representing player
 *  lives.
 *  This function is called from the renderEntities() function in engine.js.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    for (var i = 1; i <= this.lives; i++) {
        ctx.drawImage(Resources.get('images/Heart.png'), -30+i*40, 525);
    }
};

/*  Detect collision between collisionObject and player.
 *  The collisionObject can be an enemy or collectible (gem).
 *  The for-loop makes sure that all 6 y-coordinates stored in the object array
 *  'yCoords' of the collisionObject and the player are compared.
 *  If the yCoords indices match, the xCoords indices of the collisionObject and player
 *  object are compared.
 *  If the xCoords indices of both collisionObject and player overlap, the
 *  collisionFlag for the collisionObject is set to true.
 *  This function is called from the checkCollisions() funtion in engine.js.
 */
Player.prototype.collisionDetect = function(collisionObject) {
    for (var j = 0; j<= 5; j++) {
        if (collisionObject.y === collisionObject.yCoords[j] && player.y === this.yCoords[j]) {
            if (collisionObject.x > this.x) {
                if ((this.x + this.width -this.emptyPixelOffset) > collisionObject.x) {
                    collisionObject.collisionFlag = true;
                }
            }
            if (this.x > collisionObject.x) {
                if ((collisionObject.x + collisionObject.width) > (this.x + this.emptyPixelOffset)) {
                    collisionObject.collisionFlag = true;
                }
            }
        }
    }
};

/*  Render score on canvas.
 *  The score is displayed in green on a lightgreen background panel at the
 *  lower right corner of the canvas.
 *  This function is called by the renderEntities() and gameOver() functions
 *  in engine.js.
 */
Player.prototype.renderScore = function() {
    displayPanel(290, 545, 190, 20, 'lightgreen');
    ctx.font = '32pt Lobster';
    ctx.fillStyle = 'green';
    ctx.fillText('Score: ', 290, 580);
    ctx.fillText(player.score, 400, 580);
};

/*  Handle input from keyboard.
 *  This function is called by the addEventListener() function at the bottom of
 *  app.js.
 */
Player.prototype.handleInput = function(keyInput) {
    /*  Check if the return key has been pressed at the startscreen with the
     *  game info panel and if yes set the starFirstGame flag to true.
     */
    if (this.startScreenDisplay === true && keyInput === 'return') {
        this.startFirstGame = true;
    }

    /*  Check if left or right keys have been pressed at the player character
     *  selector screen and move the lightgreen selectorbox from character to
     *  character. The selectorBox property contains the index for the array
     *  containing the x-coordinates of the actual lightgreen selectorbox.
     *  If the return key is pressed, the character with the lightgreen
     *  selectorbox around it is chosen for the game and characterSelectedFlag
     *  is set to true, so the game can start.
     */
    if (player.characterSelectedFlag === false && player.startScreenDisplay === false) {
        if (keyInput === 'left' && player.selectorBox > 0) {
            player.selectorBox = player.selectorBox - 1;
        } else if (keyInput === 'left' && player.selectorBox === 0) {
            player.selectorBox = 4;
        }
        if (keyInput === 'right' && player.selectorBox < 4) {
            player.selectorBox = player.selectorBox + 1;
        } else if (keyInput === 'right' && player.selectorBox === 4) {
            player.selectorBox = 0;
        }
        if (keyInput === 'return') {
            player.characterSelectedFlag = true;
            player.sprite = player.characters[player.selectorBox];
        }
    }

    /*  Check for return-key at the Game-Over or Game-Won screens to start a new game.
     */
    if (keyInput === 'return' && (player.alive === false || player.gameWon === true)) {
        player.anotherGameFlag = true;
    }

    /*  Check if spacebar is pressed to pause an active game.
     */
    if (keyInput === 'space' &&
        player.characterSelectedFlag === true &&
        player.alive === true &&
        player.gameWon === false) {
        pauseFlag = !pauseFlag;
    }

    /*  Check for left, right, up, down arrow keys during active unpaused game
     *  and move player object accordingly accross canvas. The function also
     *  checks if there are rocks around the player which prevent movement.
     */
    if (player.characterSelectedFlag === true && pauseFlag === false) {
        /*  The isRockLRDU array contains 4 boolean variables indicating if
         *  there are rocks on the Left, Right, Down and Up of the player in
         *  that order.
         */
        var isRockLRDU = isRock(this.xCoords.indexOf(this.x), this.yCoords.indexOf(this.y));


        if (keyInput === 'left' && this.x > player.leftBorder && !isRockLRDU[0]) {
            this.x = this.xCoords[this.xCoords.indexOf(this.x) - 1];
        } else if (keyInput === 'right' && this.x < player.rightBorder && !isRockLRDU[1]) {
            this.x = this.xCoords[this.xCoords.indexOf(this.x) + 1];
        } else if (keyInput === 'down' && this.y < player.lowerBorder && !isRockLRDU[2]) {
            this.y = this.yCoords[this.yCoords.indexOf(this.y) + 1];
        } else if (keyInput === 'up' && this.y > player.upperBorder && !isRockLRDU[3]) {
            this.y = this.yCoords[this.yCoords.indexOf(this.y) - 1];
        }
    }
};

/*
 *  Define Collectible class and corresponding prototype methods.
 *  This function is called at the bottom of app.js using the 'new' keyword to
 *  instantiate collectible objects.
 *  The xCoords and yCoords arrays are used to fit the collectible object within
 *  background tiles. The collectibles-array holds the various collectibles
 *  images that can appear during a game.
 */
var Collectible = function() {
    this.xCoords = [27, 127, 227, 327, 427];
    this.yCoords = [34, 117, 200, 283, 366, 449];
    this.width = 50;
    this.height = 85;
    this.collectibles = [
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
    ];
};

/*  Reset a collectible object by placing it randomly on the screen except for
 *  the player's start position and set its collisionFlag to false.
 *  The function also checks for already placed collectibles in the
 *  global 'allCollectibles' array and avoids overlap.
 *  This function is called from the reset() function in engine.js.
 */
Collectible.prototype.reset = function() {
    do {
        this.x = this.xCoords[random_number(0, 4)];
        this.y = this.yCoords[random_number(1, 5)];
    }
    while (this.x === 227 && this.y === 449 || overlap(allCollectibles, allCollectibles.indexOf(this)));
    this.randomCollectible = this.collectibles[random_number(0, 2)];
    this.collisionFlag = false;
};

/*  Check for collision between a collectible object and the player and if
 *  true, place the collectible offscreen.
 *  The function also checks which type of collectible (blue, green, orange)
 *  has been collected and updates the score accordingly, i.e. blue gems yield
 *  80 points, green gems 50 points and orange gems 30 points.
 *  This function is called by the updateEntities() function in engine.js.
 */
Collectible.prototype.update = function() {
    if (this.collisionFlag === true) {
        this.collisionFlag = false;
        this.x = -100;
        if (this.randomCollectible === this.collectibles[0]) {
            player.score += 80;
        }
        if (this.randomCollectible === this.collectibles[1]) {
            player.score += 50;
        }
        if (this.randomCollectible === this.collectibles[2]) {
            player.score += 30;
        }
    }
};

/*  Render a collectile object on the canvas.
 *  This function is called from the renderEntities() function in engine.js.
 */
Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.randomCollectible), this.x, this.y, this.width, this.height);
};

/*
 *  Define Rock class and corresponding prototype methods.
 *  This function is called at the bottom of app.js using the 'new' keyword to
 *  instantiate rock objects.
 *  The xCoords and yCoords arrays are used to fit the rock object within
 *  background tiles.
 */
var Rock = function() {
    this.width = 101;
    this.xCoords = [1, 101, 201, 301, 401];
    this.yCoords = [-23, 60, 143, 226, 309, 392];
    this.sprite = 'images/Rock.png';
};

/*  Reset a rock object by placing it randomly on the screen except for
 *  the player's start position.
 *  The function also checks for already placed rocks and gems in the global
 *  'allRocks' and 'allCollectibles' arrays and avoids overlap.
 *  This function is called from the reset() function in engine.js.
 */
Rock.prototype.reset = function() {
    do {
        this.x = this.xCoords[random_number(0, 4)];
        this.y = this.yCoords[random_number(1, 5)];
    }
    while (this.x === 201 && this.y === 392 || overlap(allRocks, allRocks.indexOf(this)) || isGem(allRocks.indexOf(this)));
};

/*  Render a rock object on the canvas.
 *  This function is called from the renderEntities() function in engine.js.
 */
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 *  Define Timer class and corresponding prototype methods.
 *  This function is called at the bottom of app.js using the 'new' keyword to
 *  instantiate a timer object.
 *  The function also defines the dimensions of the timer display panel and the
 *  x/y-coordinates of the timer text and time elapsed.
 *
 */
var Timer = function() {
    this.xPanel = 10;
    this.yPanel = 50;
    this.width = 190;
    this.height = 20;
    this.xText = 10;
    this.yText = 85;
    this.xTime = 125;
    this.yTime = 85;
};

/*  Reset the timer object by setting it to 60 seconds and clear a potentially
 *  existing setInveral() function. Then use the setInterval() function to call
 *  the timer.update() prototype function every second (1000 milliseconds).
 *  This function is called from the reset() function in engine.js.
 */
Timer.prototype.reset = function() {
    this.time = 60;
    clearInterval(timer.myTimer);
    this.myTimer = setInterval(timer.update, 1000);
};

/*  Reduce the timer by 1 if the game is active and the timer is greater than 0.
 *  If the timer has reached 0 and the player has not yet gathered 200 points
 *  the player dies and the game is over (player.alive = false).
 *  If the score has reached 200 and the timer has not reached 0 the game is
 *  won and the clearInterval function is called to stop the timer.
 *  This function is called by setting the setInterval() function in the
 *  timer.reset() prototype function in app.js.
 */
Timer.prototype.update = function() {
    if (player.characterSelectedFlag && player.alive && timer.time > 0) {
    timer.time--;
    }
    if (timer.time <= 0 && player.score < 200) {
        player.alive = false;
    }
    if (player.score >= 200) {
        player.gameWon = true;
        clearInterval(timer.myTimer);
    }
};

/*  Render the timer on a lightblue panel in the upper left corner of the canvas.
 *  This function is called by the renderEntities() function in engine.js.
 */
Timer.prototype.render = function() {
    displayPanel(this.xPanel, this.yPanel, this.width, this.height, 'lightblue');
    ctx.font = '32pt Lobster';
    ctx.fillStyle = 'blue';
    ctx.fillText('Timer: ', this.xText, this.yText);
    ctx.fillText(timer.time, this.xTime, this.yTime);
};

/*
 *
 *   Helper functions
 *
 */

/*  Return a random number between the 'lower' and 'upper' parameters.
 */
function random_number(lower, upper) {
    if (lower === 0){
        return Math.floor(Math.random() * (upper + 1));
    }
    else {
        return lower + Math.floor(Math.random() * upper);
    }
}

/*  Display a panel with rounded corners on the canvas.
 */
function displayPanel(x,y,width,height,fillColor) {
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x+width,y);
    ctx.quadraticCurveTo(x+width+10, y, x+width+10, y+10);
    ctx.lineTo(x+width+10, y+height+10);
    ctx.quadraticCurveTo(x+width+10, y+height+20, x+width, y+height+20);
    ctx.lineTo(x, y+height+20);
    ctx.quadraticCurveTo(x-10, y+height+20, x-10, y+height+10);
    ctx.lineTo(x-10, y+10);
    ctx.quadraticCurveTo(x-10, y, x, y);
    ctx.fill();
}

/*  Display a panel-outline with rounded corners on the canvas.
 */
function displayPanelOutline(x,y,width,height,outlineColor) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = outlineColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x+width,y);
    ctx.quadraticCurveTo(x+width+10, y, x+width+10, y+10);
    ctx.lineTo(x+width+10, y+height+10);
    ctx.quadraticCurveTo(x+width+10, y+height+20, x+width, y+height+20);
    ctx.lineTo(x, y+height+20);
    ctx.quadraticCurveTo(x-10, y+height+20, x-10, y+height+10);
    ctx.lineTo(x-10, y+10);
    ctx.quadraticCurveTo(x-10, y, x, y);
    ctx.stroke();
}

/*  Check if there is a rock left, right, down or up of player's current position.
 *  The function returns an array containing 4 boolean variables that indicate
 *  the presence of a rock left, right, down or up in that order.
 *  The function is called by the player.handleInput() prototype functin in app.js.
 */
function isRock(playerXIndex, playerYIndex) {
    var isRockLRDU = [false, false, false, false];
    allRocks.forEach(function(rock) {
        if (playerXIndex - 1 === rock.xCoords.indexOf(rock.x) && playerYIndex === rock.yCoords.indexOf(rock.y)) {
            isRockLRDU[0] = true;
        }
        if (playerXIndex + 1 === rock.xCoords.indexOf(rock.x) && playerYIndex === rock.yCoords.indexOf(rock.y)) {
            isRockLRDU[1] = true;
        }
        if (playerXIndex === rock.xCoords.indexOf(rock.x) && playerYIndex + 1 === rock.yCoords.indexOf(rock.y)) {
            isRockLRDU[2] = true;
        }
        if (playerXIndex === rock.xCoords.indexOf(rock.x) && playerYIndex - 1 === rock.yCoords.indexOf(rock.y)) {
            isRockLRDU[3] = true;
        }
    });
    return isRockLRDU;
}

/*  Check if there is an overlap between an array's object and the other elements
 *  in the same array and return a boolean value.
 */
function overlap(array, objectIndex) {
    if (objectIndex > 0) {
        for (var i = 0; i < objectIndex; i++) {
            if (array[objectIndex].x === array[i].x && array[objectIndex].y === array[i].y) {
                return true;
            }
        }
    }
    return false;
}

/*  Check if there is an overlap between a rock that wants to be placed and
 *  all existing collectibles on the screen (allCollectibles array).
 *  The function returns the value true if there is an overlap.
 *  This function is called by the rock.reset() prototype function in app.js.
 */
function isGem(objectIndex) {
    var returnValue = false;
    allCollectibles.forEach(function(collectible) {
        if (allRocks[objectIndex].xCoords.indexOf(allRocks[objectIndex].x) === collectible.xCoords.indexOf(collectible.x) &&
            allRocks[objectIndex].yCoords.indexOf(allRocks[objectIndex].y) === collectible.yCoords.indexOf(collectible.y)) {
            returnValue = true;
        }
    });
    return returnValue;
}

/*
 *
 *   Define global variables
 *
 */
var pauseFlag;
var allEnemies = [];
var allCollectibles = [];
var allRocks = [];

/*
 *   Instantiate entities by placing
 *   - all enemies into an array called 'allEnemies',
 *   - all collectibles into an array called 'allCollectibles',
 *   - all rocks into an array called 'allRocks',
 *   - the player object into a variable called 'player'
 *   - the timer object into a variable called 'timer'
 */
for (var i = 1; i <= 3; i++) {
    allEnemies.push(new Enemy());
}
for (i = 1; i <= 2; i++) {
    allCollectibles.push(new Collectible);
}
for (i = 1; i <= 2; i++) {
    allRocks.push(new Rock);
}
var player = new Player();
var timer = new Timer();

/*
 *  Listen for key strokes and send keys to player.handleInput() prototype method.
 */
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space',
        13: 'return'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});