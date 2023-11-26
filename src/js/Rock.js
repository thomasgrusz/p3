import { Resources } from "./resources.js";
import { ctx } from "./engine.js";
import { app } from "./app.js";

/**
 *  Define Rock class and corresponding prototype methods.
 *  This function is called at the end of app.js using the 'new' keyword to
 *  instantiate rock objects.
 *  The xCoords and yCoords arrays are used to fit the rock object within
 *  background tiles.
 */
export class Rock {
  constructor() {
    this.width = 101;
    this.xCoords = [1, 101, 201, 301, 401];
    this.yCoords = [-23, 60, 143, 226, 309, 392];
    this.sprite = "images/Rock.png";
  }
  /**
   *  Reset a rock object by placing it randomly on the screen except for
   *  the player's start position.
   *  The function also checks for already placed rocks and gems in the global
   *  'app.allRocks' and 'app.allCollectibles' arrays and avoids overlap by calling app.overlap() and app.isGem().
   *  This function is called by the reset() function in engine.js.
   */
  reset() {
    do {
      this.x = this.xCoords[app.random_number(0, 4)];
      this.y = this.yCoords[app.random_number(1, 5)];
    } while (
      (this.x === 201 && this.y === 392) ||
      app.overlap(app.allRocks, app.allRocks.indexOf(this)) ||
      app.isGem(app.allRocks.indexOf(this))
    );
  }
  /**
   *  Render a rock object on the canvas.
   *  'ctx' is the 2D rendering context of the canvas defined in engine.js.
   *  'Resources' is the object containing global functions defined in resources.js.
   *  This function is called by the renderEntities() function in engine.js.
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}
