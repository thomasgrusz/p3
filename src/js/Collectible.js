import { Resources } from "./resources.js";
import { ctx } from "./engine.js";
import { app, player } from "./app.js";

/**
 *  Define Collectible class and corresponding prototype methods.
 *  This function is called at the end of app.js using the 'new' keyword to
 *  instantiate collectible objects.
 *  The xCoords and yCoords arrays are used to fit the collectible object within
 *  background tiles. The collectibles-array holds the various collectibles
 *  images that can appear during a game.
 */
export class Collectible {
  constructor() {
    this.xCoords = [27, 127, 227, 327, 427];
    this.yCoords = [34, 117, 200, 283, 366, 449];
    this.width = 50;
    this.height = 85;
    this.collectibles = [
      "images/Gem Blue.png",
      "images/Gem Green.png",
      "images/Gem Orange.png",
    ];
  }
  /**
   *  Reset a collectible object by placing it randomly on the screen except for
   *  the player's start position and set its collisionFlag to false.
   *  The function also checks for already placed collectibles in the
   *  global 'app.allCollectibles' array and avoids overlap by calling app.overlap().
   *  The collectible image is randomly chosen from the collectible.collectibles array.
   *  collisionFlag is tested against in enemy.update() and collectibles.update() methods.
   *  This function is called by the reset() function in engine.js.
   */
  reset() {
    do {
      this.x = this.xCoords[app.random_number(0, 4)];
      this.y = this.yCoords[app.random_number(1, 5)];
    } while (
      (this.x === 227 && this.y === 449) ||
      app.overlap(app.allCollectibles, app.allCollectibles.indexOf(this))
    );
    this.randomCollectible = this.collectibles[app.random_number(0, 2)];
    this.collisionFlag = false;
  }
  /**
   *  Check for collision between a collectible object and the player and if
   *  true, place the collectible offscreen.
   *  The function also checks which type of collectible (blue, green, orange)
   *  has been collected and updates the score accordingly, i.e. blue gems yield
   *  80 points, green gems 50 points and orange gems 30 points.
   *  collisionFlag is also tested against in the enemy.update() method.
   *  This function is called by the updateEntities() function in engine.js.
   */
  update() {
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
  }
  /**
   *  Render a collectible object on the canvas.
   *  'ctx' is the 2D rendering context of the canvas defined in engine.js.
   *  'Resources' is the object containing global functions defined in resources.js.
   *  This function is called by the renderEntities() function in engine.js.
   */
  render() {
    ctx.drawImage(
      Resources.get(this.randomCollectible),
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
