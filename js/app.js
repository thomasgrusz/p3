// Define Enemy class and prototype methods
var Enemy = function(name) {
    this.name = name;
    this.x = 0;
    this.y = enemy_y_coords[random_number(1, 3)];
    this.speed = random_number(100, 400);
    this.sprite = 'images/enemy-bug.png';
};

var enemy_y_coords =
    {
        1: 60,
        2: 143,
        3: 226
    };

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {                         // eslint-disable-line
// Check if bug left the window and if yes start again at random y-axis and random speed
    if (this.x < 505) {
        this.x = this.x + (this.speed * dt);
    } else {
        this.x = -100;
        this.y = enemy_y_coords[random_number(1, 3)];
        this.speed = random_number(100, 400);
    }

// Check if bug and player collide, if yes place player to origin and restart bug
    collision_detect(this);
    if (collision_flag === true) {
        player.x = 201;
        player.y = 404;
        this.x = - 100;
        this.y = enemy_y_coords[random_number(1, 3)];
        this.speed = random_number(100, 400);
        collision_flag = false;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);  // eslint-disable-line
};

// Create random numbers between bottom and top 
function random_number(bottom, top) {
    return bottom + Math.floor((Math.random() * top));
}

function collision_detect(enemy) {
    if (enemy.y === 60 && player.y === 72) {
        if (enemy.x > player.x) {
            if (enemy.x < (player.x + 70)) {
                collision_flag = true;
            }
        }
        if (player.x > enemy.x) {
            if (player.x < (enemy.x + 70)) {
                collision_flag = true;
            }
        }
    }
    if (enemy.y === 143 && player.y === 155) {
        if (enemy.x > player.x) {
            if (enemy.x < (player.x + 70)) {
                collision_flag = true;
            }
        }
        if (player.x > enemy.x) {
            if (player.x < (enemy.x + 70)) {
                collision_flag = true;
            }
        }
    }
    if (enemy.y === 226 && player.y === 238) {
        if (enemy.x > player.x) {
            if (enemy.x < (player.x + 70)) {
                collision_flag = true;
            }
        }
        if (player.x > enemy.x) {
            if (player.x < (enemy.x + 70)) {
                collision_flag = true;
            }
        }
    }
}


// Define Player class and prototype methods
var Player = function() {
    this.x = 201;
    this.y = 404;
    this.speed = 20;
    this.sprite = 'images/char-boy.png';
};
Player.prototype.update = function() {
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);  // eslint-disable-line
};
Player.prototype.handleInput = function(direction) {
    if (direction === 'left' && this.x > 1) {
        this.x = this.x - 100;
    } else if (direction === 'right' && this.x < 401) {
        this.x = this.x + 100;
    } else if (direction === 'down' && this.y < 404) {
        this.y = this.y + 83;
    } else if (direction === 'up' && this.y > - 11) {
        this.y = this.y - 83;
        if (this.y < 72) {
            this.x = 201;
            this.y = 404;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemyNumber = 3;
var allEnemies = [];
for (var i = 1; i <= enemyNumber; i++) {
    allEnemies.push(new Enemy(i));
}
var player = new Player;

var collision_flag = false;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
