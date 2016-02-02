/*
 *
 *   Define Enemy class and corresponding prototype methods
 *
 */
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.init();
};

/* Initialize or reset an enemy object by placing it left off screen
 * and assigning a random y-axis and speed
 */
Enemy.prototype.init = function() {
    this.x = -100;
    this.y = ENEMY_Y_COORDS[random_number(0, 2)];
    this.speed = random_number(100, 400);
};

/* Update the x,y coordinates of an enemy.
 * Check whether enemy leaves the window on the right
 * and if yes, reset enemy by calling the init() function.
 */
Enemy.prototype.update = function(dt) {
    if (this.x < 505) {
        this.x = this.x + (this.speed * dt);
    } else {
        this.init();
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
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.lives = 3;
    this.alive = true;
    this.score = 0;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.reset = function() {
    this.x = 201;
    this.y = 404;
    this.lives = 3;
    this.alive = true;
    this.score = 0;

};

/* Update player by checking number of lives,
 * adjusting lives, checking if player reached
 * water and resetting player coordinates.
 */
Player.prototype.update = function() {
    if (collisionFlagEnemy === true) {
        this.x = playerXOrigin;
        this.y = playerYOrigin;
        this.lives--
        collisionFlagEnemy = false;
    }
    if (this.lives === 0) {
        this.alive = false;
    }
    if (this.y < waterBorder) {
        this.x = playerXOrigin;
        this.y = playerYOrigin;
        waterReachedFlag = true;
    }
};

/* Render player
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    for (var i = 1; i <= this.lives; i++) {
        ctx.drawImage(Resources.get('images/Heart.png'), -30+i*40, 525);
    }
};

/* Handle player input from keyboard
 */
Player.prototype.handleInput = function(keyInput) {
    /* Checks if left or right keys have been pressed at
     * the startscreen and moves the lightgreen selectorbox
     * from character to character. Also check for spacebar
      *to pause game.
     */
    if (keyInput === 'left' && selectorBoxX > 0) {
        selectorBoxX = selectorBoxX - 1;
    } else if (keyInput === 'left' && selectorBoxX === 0) {
        selectorBoxX = 4;
    }
    if (keyInput === 'right' && selectorBoxX < 4) {
        selectorBoxX = selectorBoxX + 1;
    } else if (keyInput === 'right' && selectorBoxX === 4) {
        selectorBoxX = 0;
    }
    if (keyInput === 'return' && selectPlayerFlag === false) {
        selectPlayerFlag = true;
        player.sprite = playerImages[selectorBoxX];
    }
    if (keyInput === 'return' && player.alive === false) {
        anotherGameFlag = true;
    }
    if (keyInput === 'space' && selectPlayerFlag === true) {
        pauseFlag = !pauseFlag;
    }

    /* Check for keyboard input during game and move character
     * accordingly.
     */
    if (selectPlayerFlag === true && pauseFlag === false) {
        if (keyInput === 'left' && this.x > playerLeftBorder) {
            this.x = this.x - playerXStep;
        } else if (keyInput === 'right' && this.x < playerRightBorder) {
            this.x = this.x + playerXStep;
        } else if (keyInput === 'down' && this.y < playerLowerBorder) {
            this.y = this.y + playerYStep;
        } else if (keyInput === 'up' && this.y > playerUpperBorder) {
            this.y = this.y - playerYStep;
        }
    }
};

/*
 *
 *   Helper Methods
 *
 */

/* Detect collision between enemy and player
 */
function collisionEnemyDetect(enemy) {
    for (var j = 0; j<= 2; j++) {
        if (enemy.y === ENEMY_Y_COORDS[j] && player.y === playerYCollisionCcoords[j]) {
            if (enemy.x > player.x) {
                if (enemy.x < (player.x + enemyWidth)) {
                    collisionFlagEnemy = true;
                }
            }
            if (player.x > enemy.x) {
                if (player.x < (enemy.x + charWidth)) {
                    collisionFlagEnemy = true;
                }
            }
        }
    }
}

/* Create random numbers between 'lower' and 'upper'
 */
function random_number(lower, upper) {
    upper += 1;
    return lower + Math.floor((Math.random() * upper));
}

/* Update score
 */
function updateScore() {
    if (waterReachedFlag === true) {
        score = score + 10;
        waterReachedFlag = false;
    }
}

/* Render score
 */
function renderScore() {
    displayPanel(290, 545, 190, 20, 'lightgreen', 'lightgreen');
    ctx.font = '32pt Lobster';
    ctx.fillStyle = 'green';
    ctx.fillText('Score: ', 290, 580);
    ctx.fillText(score, 400, 580);
}

/* Display panels with rounded corners
 */
function displayPanel(x,y,width,height,outlineColor,fillColor) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = outlineColor;
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

/* This function is called by the selectPlayer() function and
 * draws a lightgreen selector outline around characters, that
 * can be moved laterally with the arrow key.
 */
function drawSelectorBox(x,y,width,height,outlineColor) {
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
 *   Define all global controll variables
 *
 */
var collisionFlagEnemy = false;
var pauseFlag = false;
var waterReachedFlag = false;
var selectPlayerFlag = false;
var anotherGameFlag = false;

var ENEMY_Y_COORDS = [60, 143, 226];
var allEnemies = [];
var enemyWidth = 98;

var playerXOrigin = 201;
var playerYOrigin = 404;
var playerXStep = 100;
var playerYStep = 83;
var playerLeftBorder = 1;
var playerRightBorder = 401;
var playerUpperBorder = -11;
var playerLowerBorder = 404;
var charWidth = 67;
var livesStart = 3;
var playerYCollisionCcoords = [72, 155, 238];
var playerImages = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

var waterBorder = 72;
var score = 0;
var selectorBoxX = 0;
var selectorBox = [40, 130, 215, 310, 400];

/*
 *   Instantiate entities by
 *   - placing all enemies into an array called 'allEnemies' and
 *   - placeing player object into a variable called 'player'
 */
for (var i = 1; i <= 3; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player(201, 404);

/*
 *
 *  Listen for key strokes and send keys to Player.handleInput() method.
 *
 */
document.addEventListener('keyup', function(e) {
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