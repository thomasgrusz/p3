import { Resources } from "./resources.js";
import { ctx } from "./engine.js";
import { app, player } from "./app.js";

/**
 *  Define Player class and corresponding prototype methods.
 *  This function is called at the bottom of app.js using the 'new' keyword to
 *  instantiate a player object.
 *  The xCoords and yCoords arrays are used to fit the player object within
 *  background tiles. emptyPixelOffset defines the number of empty pixels to
 *  the left and right of the player sprite. The characters-array holds the
 *  various player images that can be chosen from at the beginning of the
 *  game. CharacterSelectedFlag is set to false as no player image has
 *  been chosen yet. StartScreenDisplay is set to true and startFirstGame to
 *  false, so that the start screen info panel will be displayed at the beginning of game.
 *  The selectorBoxXCoords array contains the x-coords for the lightgreen
 *  box drawn around the selected character image at the beginning the game.
 */
export class Player {
  constructor() {
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
      "images/char-boy.png",
      "images/char-cat-girl.png",
      "images/char-horn-girl.png",
      "images/char-pink-girl.png",
      "images/char-princess-girl.png",
    ];
    this.characterSelectedFlag = false;
    this.startScreenDisplay = true;
    this.startFirstGame = false;
    this.selectorBoxXCoords = [40, 130, 215, 310, 400];
  }
  /**
   *  Reset the player object by placing it to its starting position, assigning
   *  3 lives and setting the score to 0.
   *  The x-coordinate for the lightgreen selector box is set to be drawn around
   *  the first player image in the the player.characters array.
   *  This function is called by the reset() function in engine.js.
   */
  reset() {
    this.x = this.xOrigin;
    this.y = this.yOrigin;
    this.lives = 3;
    this.alive = true;
    this.score = 0;
    this.selectorBox = 0;
    this.anotherGameFlag = false;
    this.gameWon = false;
  }
  /**
   *  Update the player object by checking the remaining number of lives and if
   *  there are no lives left the player.alive property is set to false, i.e.
   *  the player dies. Check if the player has reached the water and if yes,
   *  place the player to its starting position and increase the score by 10
   *  points.
   *  This function is called by the updateEntities() function in engine.js.
   */
  update() {
    if (this.lives <= 0) {
      this.alive = false;
    }
    if (this.y < this.waterBorder) {
      this.x = this.xOrigin;
      this.y = this.yOrigin;
      this.score += 10;
    }
  }
  /**
   *  Render the player object and heart icons on canvas, representing player lives.
   *  'ctx' is the 2D rendering context of the canvas defined in engine.js.
   *  'Resources' is the object containing global functions defined in resources.js.
   *  This function is called by the renderEntities() function in engine.js.
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    for (let i = 1; i <= this.lives; i++) {
      ctx.drawImage(Resources.get("images/Heart.png"), -30 + i * 40, 525);
    }
  }
  /**
   *  Detect collision between collisionObject and player.
   *  The collisionObject can be an enemy or collectible (gem).
   *  The for-loop makes sure that all 6 y-coordinates stored in the object array
   *  'yCoords' of the collisionObject and the player are compared.
   *  If the yCoords indices match, the xCoords indices of the collisionObject and player
   *  object are compared.
   *  If the xCoords indices of both collisionObject and player overlap, the
   *  collisionFlag for the collisionObject is set to true.
   *  The collisionFlag will be tested for in enemy.update() and collectibles.update() methods.
   *  This function is called by the checkCollisions() function in engine.js.
   */
  collisionDetect(collisionObject) {
    for (let j = 0; j <= 5; j++) {
      if (
        collisionObject.y === collisionObject.yCoords[j] &&
        this.y === this.yCoords[j]
      ) {
        if (collisionObject.x > this.x) {
          if (this.x + this.width - this.emptyPixelOffset > collisionObject.x) {
            collisionObject.collisionFlag = true;
          }
        }
        if (this.x > collisionObject.x) {
          if (
            collisionObject.x + collisionObject.width >
            this.x + this.emptyPixelOffset
          ) {
            collisionObject.collisionFlag = true;
          }
        }
      }
    }
  }
  /**
   *  Render score on canvas.
   *  The score is displayed in green on a lightgreen background panel at the
   *  lower right corner of the canvas by calling displayPanel().
   *  'ctx' is the 2D rendering context of the canvas defined in engine.js.
   *  This function is called by the renderEntities() and gameOver() functions
   *  in engine.js.
   */
  renderScore() {
    app.displayPanel(290, 545, 190, 20, "lightgreen");
    ctx.font = "32pt Lobster";
    ctx.fillStyle = "green";
    ctx.fillText("Score: ", 290, 580);
    ctx.fillText(player.score, 400, 580);
  }
  /**
   *  Handle input from keyboard.
   *  This function is called by the addEventListener() function at the end of
   *  app.js.
   */
  handleInput(keyInput) {
    /**
     *  Check if the return key has been pressed at the start screen with the
     *  game info-panel and if yes set the starFirstGame flag to true.
     *  The startFirstGame flag is tested for in the main() game-loop in engine.js.
     */
    if (this.startScreenDisplay === true && keyInput === "return") {
      this.startFirstGame = true;
    }

    /**
     *  Check if left or right keys have been pressed at the player character-
     *  selector screen and move the lightgreen selector-box from character to
     *  character. The selectorBox property contains the index for the array
     *  which itself contains the x-coordinates of the actual lightgreen selector-box.
     *  If the return key is pressed, the character with the lightgreen
     *  selector-box around it is chosen for the game and characterSelectedFlag
     *  is set to true, so the game can start. characterSelectedFlag is also tested for
     *  in the main() game-loop in engin.js.
     */
    if (
      this.characterSelectedFlag === false &&
      this.startScreenDisplay === false
    ) {
      if (keyInput === "left" && this.selectorBox > 0) {
        this.selectorBox = this.selectorBox - 1;
      } else if (keyInput === "left" && this.selectorBox === 0) {
        this.selectorBox = 4;
      }
      if (keyInput === "right" && this.selectorBox < 4) {
        this.selectorBox = this.selectorBox + 1;
      } else if (keyInput === "right" && this.selectorBox === 4) {
        this.selectorBox = 0;
      }
      if (keyInput === "return") {
        this.characterSelectedFlag = true;
        this.sprite = this.characters[this.selectorBox];
      }
    }

    /**
     *  Check for return-key at the Game-Over or Game-Won screens to start a new game.
     *  anotherGameFlag is tested for in the gameOver() and gameWon() functions in engine.js.
     */
    if (
      keyInput === "return" &&
      (this.alive === false || this.gameWon === true)
    ) {
      this.anotherGameFlag = true;
    }

    /**
     *  Check if space bar is pressed to pause an active game.
     */
    if (
      keyInput === "space" &&
      this.characterSelectedFlag === true &&
      this.alive === true &&
      this.gameWon === false
    ) {
      app.pauseFlag = !app.pauseFlag;
    }

    /**
     *  Check for left, right, up and down arrow keys during an active, unpaused game
     *  and move player object accordingly across canvas. The function also
     *  checks if there are rocks around the player which prevent movement.
     */
    if (this.characterSelectedFlag === true && app.pauseFlag === false) {
      /**
       *  The isRockLRDU array contains 4 boolean variables indicating if
       *  there are rocks on the Left, Right, Down and Up of the player in
       *  that order. The array is loaded by calling app.isRock().
       */
      let isRockLRDU = app.isRock(
        this.xCoords.indexOf(this.x),
        this.yCoords.indexOf(this.y)
      );

      /**
       *  The player is moved by increasing or decreasing the index pointing to the actual
       *  x- and y-coordinates in the player.xCoords and player.yCoords array.
       */
      if (keyInput === "left" && this.x > this.leftBorder && !isRockLRDU[0]) {
        this.x = this.xCoords[this.xCoords.indexOf(this.x) - 1];
      } else if (
        keyInput === "right" &&
        this.x < this.rightBorder &&
        !isRockLRDU[1]
      ) {
        this.x = this.xCoords[this.xCoords.indexOf(this.x) + 1];
      } else if (
        keyInput === "down" &&
        this.y < this.lowerBorder &&
        !isRockLRDU[2]
      ) {
        this.y = this.yCoords[this.yCoords.indexOf(this.y) + 1];
      } else if (
        keyInput === "up" &&
        this.y > this.upperBorder &&
        !isRockLRDU[3]
      ) {
        this.y = this.yCoords[this.yCoords.indexOf(this.y) - 1];
      }
    }
  }
}
