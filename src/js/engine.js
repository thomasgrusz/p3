import { Resources } from "./resources.js";
import { app, player, timer } from "./app.js";

/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on the player and other objects as defined in app.js.
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flip book you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

/* Predefine the variables we'll be using within this scope,
 * create the canvas element, grab the 2D context for that canvas
 * set the canvas elements height/width and add it to the DOM.
 */
var doc = document;
var win = window;
var canvas = doc.createElement("canvas");
export let ctx = canvas.getContext("2d");
var lastTime;

canvas.width = 505;
canvas.height = 606;
doc.querySelector("#gameCanvas").appendChild(canvas);

/* This function serves as the kickoff point for the game loop itself
 * and handles properly calling the update and render methods.
 */
function main() {
  /* Get our time delta information which is required if your game
   * requires smooth animation. Because everyone's computer processes
   * instructions at different speeds we need a constant value that
   * would be the same for everyone (regardless of how fast their
   * computer is) - hurray time!
   */
  var now = Date.now(),
    dt = (now - lastTime) / 1000.0;

  /* Check the game state and call the appropriate function.
   * If the startScreenDisplay flag is set to true, call the startScreen()
   * function in engine.js to display the general game info-panel.
   * After the start screen, check whether the player character has been
   * chosen or not (characterSelectedFlag = true) and if not call the
   * selectPlayer() function in engine.js.
   * If the player character has been chosen and the game is not paused
   * (pauseFlag = false) call our update/render functions and pass along
   * the time delta to our update function since it may be used for smooth
   * animation.
   * If the time is up or the player has lost all lives (player.alive = false)
   * call the gameOver function in engine.js.
   * If the player has gathered 200 points before the time is up
   * (player.gameWon = true) call the gameWon() function in engine.js.
   */
  if (player.startScreenDisplay) {
    startScreen();
  }

  if (!player.characterSelectedFlag && !player.startScreenDisplay) {
    selectPlayer();
  }

  if (
    !app.pauseFlag &&
    player.characterSelectedFlag &&
    player.alive &&
    !player.gameWon
  ) {
    update(dt);
    render();
  }

  if (!player.alive) {
    gameOver();
  }

  if (player.gameWon) {
    gameWon();
  }

  /* Set our lastTime variable which is used to determine the time delta
   * for the next time this function is called.
   */
  lastTime = now;

  /* Use the browser's requestAnimationFrame function to call this
   * function again as soon as the browser is able to draw another frame.
   */
  win.requestAnimationFrame(main);
}

/* This function does some initial setup that should only occur once,
 * particularly setting the lastTime variable that is required for the
 * game loop. Further, it initializes all enemies' x,y-coordinates, and
 * and speed. It also calls the selectPlacer function.
 */
function init() {
  reset();
  lastTime = Date.now();
  main();
}

/* This function is called by main (our game loop) and itself calls all
 * of the functions which may need to update entity's data.
 * The function also calls the checkCollision() function to check for any
 * collision between the player and collectibles or enemies.
 */
function update(dt) {
  updateEntities(dt);
  checkCollisions();
}

/* This is called by the update function and loops through all of the
 * objects within the entities arrays as defined in app.js and calls
 * their update() methods. It will then call the update function for the
 * player object.
 */
function updateEntities(dt) {
  app.allEnemies.forEach((enemy) => {
    enemy.update(dt);
  });
  app.allCollectibles.forEach((collectible) => {
    collectible.update();
  });
  player.update();
}

function checkCollisions() {
  /* Check collisions between player and all enemies and collectibles.
   */
  app.allEnemies.forEach((enemy) => {
    player.collisionDetect(enemy);
  });
  app.allCollectibles.forEach((collectible) => {
    player.collisionDetect(collectible);
  });
}

/* This function initially calls the background render function,
 * it will then call the renderEntities function.
 */
function render() {
  renderBackground();
  renderEntities();
}

/* This function is called by the render function and
 * draws the background.
 */
function renderBackground() {
  /* This array holds the relative URL to the image used
   * for that particular row of the game level.
   */
  const rowImages = [
    "images/water-block.png", // Top row is water
    "images/stone-block.png", // Row 1 of 3 of stone
    "images/stone-block.png", // Row 2 of 3 of stone
    "images/stone-block.png", // Row 3 of 3 of stone
    "images/grass-block.png", // Row 1 of 2 of grass
    "images/grass-block.png", // Row 2 of 2 of grass
  ];
  const numRows = 6;
  const numCols = 5;

  /* Loop through the number of rows and columns we've defined above
   * and, using the rowImages array, draw the correct image for that
   * portion of the "grid"
   */
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      /* The drawImage function of the canvas' context element
       * requires 3 parameters: the image to draw, the x coordinate
       * to start drawing and the y coordinate to start drawing.
       * We're using our Resources helpers to refer to our images
       * so that we get the benefits of caching these images, since
       * we're using them over and over.
       */
      ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
    }
  }
}

/* This function is called by the render function and is called on each game
 * tick. Its purpose is to then call the render functions defined in app.js
 * for collectibles, rocks, enemies, score and timer.
 */
function renderEntities() {
  /* Loop through all of the objects within the app.allEnemies array and call
   * the render function you have defined.
   */
  app.allCollectibles.forEach((collectible) => {
    collectible.render();
  });
  app.allRocks.forEach((rock) => {
    rock.render();
  });
  app.allEnemies.forEach((enemy) => {
    enemy.render();
  });
  player.render();
  player.renderScore();
  timer.render();
}

/* This function resets all entities defined in app.js before a (new) game.
 * It's called at the beginning after the player character has been
 * selected and then after each won or lost game, when the return key
 * has been pressed (in app.js player.handleInput method).
 */
function reset() {
  app.allEnemies.forEach((enemy) => {
    enemy.reset();
  });
  app.allCollectibles.forEach((collectible) => {
    collectible.reset();
  });
  app.allRocks.forEach((rock) => {
    rock.reset();
  });
  player.reset();
  timer.reset();
  app.pauseFlag = false;
}

/* This function is called only once by the main() function and draws a
 * white rounded square with a green outline, displaying all
 * player-characters to choose from. The player is highlighted by a
 * lightgreen selector-box around it which can be moved across the various
 * characters via arrow keys. Hitting the return key choses the currently
 * highlighted character for the game and sets the characterSelectedFlag
 * to true (this is done in app.js in the player.handleInput method).
 */
function selectPlayer() {
  renderBackground();
  /* Draw white background panel with green outline
   */
  app.displayPanel(30, 200, 445, 210, "white");
  app.displayPanelOutline(30, 200, 445, 210, "green");
  /* Draw player characters
   */
  for (var i = 0; i < player.characters.length; i++) {
    ctx.drawImage(Resources.get(player.characters[i]), 20 + i * 90, 180);
  }
  /* Display character selection message and draw lightgreen selector box
   */
  ctx.font = "20pt Lobster";
  ctx.fillStyle = "green";
  ctx.fillText("select your hero and press ENTER!", 75, 400);
  app.displayPanelOutline(
    player.selectorBoxXCoords[player.selectorBox],
    220,
    63,
    110,
    "lightgreen"
  );
}

/* This function is called by the main() function only once and displays
 * the start-screen with the general game-info panel. After hitting return
 * (checked for in app.js/ player.handleInput method) the init() function
 * is called and the 'press space to pause game' message is displayed on the
 * html document.
 */
function startScreen() {
  renderBackground();
  app.displayPanel(30, 120, 445, 380, "white");
  app.displayPanelOutline(30, 120, 445, 380, "green");
  ctx.font = "32pt Lobster";
  ctx.fillStyle = "green";
  ctx.fillText("GAME INFO", 140, 200);
  ctx.font = "20pt Lobster";
  ctx.fillText("get 200 points in 60 seconds", 100, 270);
  ctx.fillText("- reach water = 10 points", 120, 330);
  ctx.fillText("- blue gem = 80 points", 120, 360);
  ctx.fillText("- green gem = 50 points", 120, 390);
  ctx.fillText("- orange gem = 30 points", 120, 420);
  ctx.fillStyle = "red";
  ctx.fillText("press return to start!", 150, 480);
  if (player.startFirstGame === true) {
    player.startScreenDisplay = false;
    const footer = doc.querySelector("footer");
    footer.innerHTML = "";
    const node = doc.createElement("h4");
    const textnode = doc.createTextNode("press SPACE to pause game");
    node.appendChild(textnode);
    footer.appendChild(node);
    init();
  }
}

/* This function is called by the main() function when the player.alive
 * property is set to false. After hitting return (checked for in
 * app.js/ player.handleInput method) the init() function is called to
 * restart the game.
 */
function gameOver() {
  renderBackground();
  player.renderScore();
  app.displayPanel(30, 200, 445, 210, "white");
  app.displayPanelOutline(30, 200, 445, 210, "green");
  ctx.font = "30pt Lobster";
  ctx.fillStyle = "green";
  ctx.fillText("GAME OVER!", 140, 300);
  ctx.font = "20pt Lobster";
  ctx.fillStyle = "green";
  ctx.fillText("press return for another game!", 90, 350);
  if (player.anotherGameFlag === true) {
    player.anotherGameFlag = false;
    init();
  }
}

/* This function is called by the main() function when the player.gameWon
 * property is set to true. After hitting return (checked for in
 * app.js/ player.handleInput method) the init() function is called to
 * restart the game.
 */
function gameWon() {
  renderBackground();
  timer.render();
  app.displayPanel(30, 200, 445, 210, "white");
  app.displayPanelOutline(30, 200, 445, 210, "green");
  ctx.font = "30pt Lobster";
  ctx.fillStyle = "red";
  ctx.fillText("YOU ARE A WINNER!", 70, 300);
  ctx.font = "20pt Lobster";
  ctx.fillStyle = "green";
  ctx.fillText("press return for another game!", 90, 350);
  if (player.anotherGameFlag === true) {
    player.anotherGameFlag = false;
    init();
  }
}

/* Load all of the images needed for the game. Then set init as the
 * callback method, so that when all of these images are properly
 * loaded the game will start.
 */
Resources.load([
  "images/stone-block.png",
  "images/water-block.png",
  "images/grass-block.png",
  "images/enemy-bug.png",
  "images/char-boy.png",
  "images/char-cat-girl.png",
  "images/char-horn-girl.png",
  "images/char-pink-girl.png",
  "images/char-princess-girl.png",
  "images/Heart.png",
  "images/Gem Blue.png",
  "images/Gem Green.png",
  "images/Gem Orange.png",
  "images/Rock.png",
]);
Resources.onReady(init);
