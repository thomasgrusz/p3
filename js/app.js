/*
 *
 *   Define Enemy class and corresponding prototype methods
 *
 */
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
};

/* Update the x,y coordinates of an enemy and check for
 * collision with player
 */
Enemy.prototype.update = function(dt) {

    /* Check if enemy leaves the window and if yes, start again at
     * random y-axis and random speed
     */
    if (this.x < enemyXMax) {
        this.x = this.x + (this.speed * dt);
    } else {
        this.init();
    }
};

/* Render one enemy
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.init = function() {
    this.x = enemyXOrigin;
    this.y = enemyYCoords[random_number(0, 2)];
    this.speed = random_number(enemyMinSpeed, enemyMaxSpeed);
};

/*
 *
 *   Define Player class and corresponding prototype methods
 *
 */
var Player = function() {
    this.x = playerXOrigin;
    this.y = playerYOrigin;
    this.lives = livesStart;
    this.alive = true;
    this.sprite = 'images/char-boy.png';
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
        if (enemy.y === enemyYCoords[j] && player.y === playerYCollisionCcoords[j]) {
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
    ctx.fillStyle = 'lightgreen'
    ctx.beginPath();
    ctx.moveTo(290, 545);
    ctx.lineTo(480,545);
    ctx.quadraticCurveTo(490, 545, 490, 555);
    ctx.lineTo(490, 575);
    ctx.quadraticCurveTo(490, 585, 480, 585);
    ctx.lineTo(290, 585);
    ctx.quadraticCurveTo(280, 585, 280, 575);
    ctx.lineTo(280, 555);
    ctx.quadraticCurveTo(280, 545, 290, 545);
    ctx.fill();
    ctx.font = '32pt Lobster';
    ctx.fillStyle = 'green';
    ctx.fillText('Score: ', 290, 580);
    ctx.fillText(score, 400, 580);
    ctx.lineWidth = 3;
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

var enemyNumber = 3;
var enemyXOrigin = -100;
var enemyXMax = 505;
var enemyMinSpeed = 100;
var enemyMaxSpeed = 400;
var enemyWidth = 98;
var allEnemies = [];
var enemyYCoords = [60, 143, 226];

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
for (var i = 1; i <= enemyNumber; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player;

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