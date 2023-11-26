import { Resources } from "./resources.js";
import { ctx } from "./engine.js";
import { app, player } from "./app.js";

/**
 *  Define Enemy class and corresponding prototype methods.
 *  This function is called at the end of app.js using the 'new' keyword to
 *  instantiate enemy objects.
 *  Using the Enemy class ensures encapsulation of properties and prototype
 *  functions.
 *  The yCoords array is used to fit objects within background tiles along the y-axis.
 *
 */
export class Enemy {
  constructor() {
    this.sprite = "images/enemy-bug.png";
    this.minXCoord = -100;
    this.maxXCoord = 505;
    this.yCoords = [-23, 60, 143, 226, 309, 392];
    this.width = 101;
  }
  /**
   *  Reset an enemy object by placing it left off screen and assigning a random
   *  y-axis and random speed and resetting its collisionFlag for player-collisions to false.
   *  This function is called by the enemy.update() method in
   *  app.js and the reset() function in engine.js.
   */
  reset() {
    this.x = this.minXCoord;
    this.y = this.yCoords[app.random_number(1, 3)];
    this.speed = app.random_number(100, 400);
    this.collisionFlag = false;
  }
  /**
   *  Check if the enemy object is onscreen and if yes increase the x-coordinate
   *  by speed * time-delta (dt). Time-delta ensures a constant speed across various
   *  devices. If the enemy object has left the screen on the right it will be
   *  reset by calling the enemy.reset() method.
   *  If there is a collision with the player, the enemy gets reset and the player
   *  gets placed at its starting x,y-position and loses a life.
   *  This function is called by the updateEntities() function in engine.js.
   */
  update(dt) {
    if (this.x < this.maxXCoord) {
      this.x = this.x + this.speed * dt;
    } else {
      this.reset();
    }
    if (this.collisionFlag === true) {
      player.x = player.xOrigin;
      player.y = player.yOrigin;
      player.lives--;
      this.reset();
    }
  }
  /**
   *  Render an enemy object on the canvas.
   *  'ctx' is the 2D rendering context of the canvas defined in engine.js.
   *  Resources is the object containing global functions defined in resources.js.
   *  This function is called by the renderEntities() function in engine.js.
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}
