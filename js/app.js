/*
 *
 *   Define Enemy class and corresponding prototype methods
 *
 */
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.yCoords = [-23, 60, 143, 226, 309, 392];
    this.width = 101;
};

/* Reset an enemy object by placing it left off screen
 * and assigning a random y-axis and speed
 */
Enemy.prototype.reset = function() {
    this.x = -100;
    this.y = this.yCoords[random_number(1, 3)];
    this.speed = random_number(100, 400);
    this.collisionFlag = false;
};

/* Update the x,y coordinates of an enemy.
 * Check whether enemy leaves the window on the right
 * and if yes, reset enemy by calling the enemy.reset() function.
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
        this.collisionFlag = false;
    }

};

/* Render an enemy object
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 *
 *   Define Player class and corresponding prototype methods
 *
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
    this.selectorBoxXCoords = [40, 130, 215, 310, 400];
};

Player.prototype.reset = function() {
    this.x = player.xOrigin;
    this.y = player.yOrigin;
    this.lives = 3;
    this.alive = true;
    this.score = 0;
    this.waterReachedFlag = false;
    this.selectorBox = 0;
    this.anotherGameFlag = false;
};

/* Update player by checking number of lives,
 * adjusting lives, checking if player reached
 * water and resetting player coordinates.
 */
Player.prototype.update = function() {
    if (this.lives === 0) {
        this.alive = false;
    }
    if (this.y < player.waterBorder) {
        this.x = player.xOrigin;
        this.y = player.yOrigin;
        player.waterReachedFlag = true;
    }
};

/* Render player and heart icons, representing lives
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    for (var i = 1; i <= this.lives; i++) {
        ctx.drawImage(Resources.get('images/Heart.png'), -30+i*40, 525);
    }
};

/* Detect collision between collisionObject and player
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

/* Update score
 */
Player.prototype.updateScore = function() {
    if (player.waterReachedFlag === true) {
        player.score = player.score + 10;
        player.waterReachedFlag = false;
    }
};

/* Render score
 */
Player.prototype.renderScore = function() {
    displayPanel(290, 545, 190, 20, 'lightgreen');
    ctx.font = '32pt Lobster';
    ctx.fillStyle = 'green';
    ctx.fillText('Score: ', 290, 580);
    ctx.fillText(player.score, 400, 580);
};

/* Handle player input from keyboard
 */
Player.prototype.handleInput = function(keyInput) {
    /* Check if left or right keys have been pressed at
     * the startscreen and move the lightgreen selectorbox
     * from character to character.
     */
    if (player.characterSelectedFlag === false) {
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

    /* Check for return-key at the Game Over screen to start
     * new game.
     */
    if (keyInput === 'return' && player.alive === false) {
        player.anotherGameFlag = true;
    }

    /* Check for spacebar to pause game.
     */
    if (keyInput === 'space' && player.characterSelectedFlag === true) {
        pauseFlag = !pauseFlag;
    }

    /* Check for keyboard input during game and move character
     * accordingly.
     */
    if (player.characterSelectedFlag === true && pauseFlag === false) {
        if (keyInput === 'left' && this.x > player.leftBorder) {
            this.x = this.xCoords[this.xCoords.indexOf(this.x) - 1];
        } else if (keyInput === 'right' && this.x < player.rightBorder) {
            this.x = this.xCoords[this.xCoords.indexOf(this.x) + 1];
        } else if (keyInput === 'down' && this.y < player.lowerBorder) {
            this.y = this.yCoords[this.yCoords.indexOf(this.y) + 1];
        } else if (keyInput === 'up' && this.y > player.upperBorder) {
            this.y = this.yCoords[this.yCoords.indexOf(this.y) - 1];
        }
    }
};

/*
 *
 *   Define Collectibles class and corresponding prototype methods
 *
 */
var Collectible = function() {
    this.xCoords = [27, 127, 227, 327, 427];
    this.yCoords = [117, 200, 283, 366, 449];
    this.width = 50;
    this.height = 85;
    this.collectibles = [
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
    ];
};

Collectible.prototype.reset = function() {
    var x, y;
    do {
        x = random_number(0, 4);
        y = random_number(0, 4);
        this.x = this.xCoords[x];
        this.y = this.yCoords[y];
    }
    while (this.x === 227 && this.y === 449);
    this.randomCollectible = this.collectibles[random_number(0, 2)];
};

Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.randomCollectible), this.x, this.y, this.width, this.height);
};

/*
 *
 *   Helper Methods
 *
 */

/* Create random numbers between 'lower' and 'upper'
 */
function random_number(lower, upper) {
    if (lower === 0){
        return Math.floor(Math.random() * (upper + 1));
    }
    else {
        return lower + Math.floor(Math.random() * upper);
    }
}

/* Display panel with rounded corners
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

/* Display panel-outline with rounded corners
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

/*
 *
 *   Define global variables
 *
 */
var pauseFlag;

/*
 *   Instantiate entities by
 *   - placing all enemies into an array called 'allEnemies' and
 *   - placeing player object into a variable called 'player'
 */
var allEnemies = [];
for (var i = 1; i <= 3; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player();
var collectible = new Collectible();

/*
 *
 *  Listen for key strokes and send keys to Player.handleInput() method.
 *
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