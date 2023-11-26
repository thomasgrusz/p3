import { ctx } from "./engine.js";
import { Enemy } from "./Enemy.js";
import { Player } from "./Player.js";
import { Collectible } from "./Collectible.js";
import { Rock } from "./Rock.js";
import { Timer } from "./Timer.js";

/**
 *   Define app object
 */
export const app = {};
app.pauseFlag;
app.allEnemies = [];
app.allCollectibles = [];
app.allRocks = [];

/*
 *   Helper functions
 */

/**
 *  Return a random number between the 'lower' and 'upper' parameters.
 */
app.random_number = function (lower, upper) {
  if (lower === 0) {
    return Math.floor(Math.random() * (upper + 1));
  } else {
    return lower + Math.floor(Math.random() * upper);
  }
};

/**
 *  Display a panel with rounded corners on the canvas.
 */
app.displayPanel = function (x, y, width, height, fillColor) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.quadraticCurveTo(x + width + 10, y, x + width + 10, y + 10);
  ctx.lineTo(x + width + 10, y + height + 10);
  ctx.quadraticCurveTo(
    x + width + 10,
    y + height + 20,
    x + width,
    y + height + 20
  );
  ctx.lineTo(x, y + height + 20);
  ctx.quadraticCurveTo(x - 10, y + height + 20, x - 10, y + height + 10);
  ctx.lineTo(x - 10, y + 10);
  ctx.quadraticCurveTo(x - 10, y, x, y);
  ctx.fill();
};

/**
 *  Display a panel-outline with rounded corners on the canvas.
 */
app.displayPanelOutline = function (x, y, width, height, outlineColor) {
  ctx.lineWidth = 5;
  ctx.strokeStyle = outlineColor;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.quadraticCurveTo(x + width + 10, y, x + width + 10, y + 10);
  ctx.lineTo(x + width + 10, y + height + 10);
  ctx.quadraticCurveTo(
    x + width + 10,
    y + height + 20,
    x + width,
    y + height + 20
  );
  ctx.lineTo(x, y + height + 20);
  ctx.quadraticCurveTo(x - 10, y + height + 20, x - 10, y + height + 10);
  ctx.lineTo(x - 10, y + 10);
  ctx.quadraticCurveTo(x - 10, y, x, y);
  ctx.stroke();
};

/**
 *  Check if there is a rock left, right, down or up of player's current position.
 *  The function returns an array containing 4 boolean variables that indicate
 *  the presence of a rock left, right, down or up in that order.
 *  The function is called by the player.handleInput() method in app.js.
 */
app.isRock = function (playerXIndex, playerYIndex) {
  var isRockLRDU = [false, false, false, false];
  app.allRocks.forEach(function (rock) {
    if (
      playerXIndex - 1 === rock.xCoords.indexOf(rock.x) &&
      playerYIndex === rock.yCoords.indexOf(rock.y)
    ) {
      isRockLRDU[0] = true;
    }
    if (
      playerXIndex + 1 === rock.xCoords.indexOf(rock.x) &&
      playerYIndex === rock.yCoords.indexOf(rock.y)
    ) {
      isRockLRDU[1] = true;
    }
    if (
      playerXIndex === rock.xCoords.indexOf(rock.x) &&
      playerYIndex + 1 === rock.yCoords.indexOf(rock.y)
    ) {
      isRockLRDU[2] = true;
    }
    if (
      playerXIndex === rock.xCoords.indexOf(rock.x) &&
      playerYIndex - 1 === rock.yCoords.indexOf(rock.y)
    ) {
      isRockLRDU[3] = true;
    }
  });
  return isRockLRDU;
};

/**
 *  Check if there is an overlap between an array's object and the other elements
 *  in the same array and return a boolean value.
 *  This function is called by the rock.reset() method.
 */
app.overlap = function (array, objectIndex) {
  if (objectIndex > 0) {
    for (var i = 0; i < objectIndex; i++) {
      if (
        array[objectIndex].x === array[i].x &&
        array[objectIndex].y === array[i].y
      ) {
        return true;
      }
    }
  }
  return false;
};

/**
 *  Check if there is an overlap between a rock that wants to be placed and
 *  all existing collectibles on the screen (app.allCollectibles array).
 *  The function returns the value true if there is an overlap.
 *  This function is called by the rock.reset() method in app.js.
 */
app.isGem = function (objectIndex) {
  var returnValue = false;
  app.allCollectibles.forEach(function (collectible) {
    if (
      app.allRocks[objectIndex].xCoords.indexOf(app.allRocks[objectIndex].x) ===
        collectible.xCoords.indexOf(collectible.x) &&
      app.allRocks[objectIndex].yCoords.indexOf(app.allRocks[objectIndex].y) ===
        collectible.yCoords.indexOf(collectible.y)
    ) {
      returnValue = true;
    }
  });
  return returnValue;
};

/**
 *   Instantiate entities by placing
 *   - all enemies into an array called 'app.allEnemies',
 *   - all collectibles into an array called 'app.allCollectibles',
 *   - all rocks into an array called 'app.allRocks',
 *   - the player object into a variable called 'player'
 *   - the timer object into a variable called 'timer'
 */
for (var i = 1; i <= 3; i++) {
  app.allEnemies.push(new Enemy());
}
for (i = 1; i <= 2; i++) {
  app.allCollectibles.push(new Collectible());
}
for (i = 1; i <= 2; i++) {
  app.allRocks.push(new Rock());
}
export const player = new Player();
export const timer = new Timer();

/**
 *  Listen for key strokes and send keys to player.handleInput() prototype method.
 */
document.addEventListener("keydown", function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    32: "space",
    13: "return",
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
