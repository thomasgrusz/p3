import { ctx } from "./engine.js";
import { timer, player, app } from "./app.js";

/**
 *  Define Timer class and corresponding prototype methods.
 *  This function is called at the end of app.js using the 'new' keyword to
 *  instantiate a timer object.
 *  The function also defines the dimensions of the timer display panel and the
 *  x/y-coordinates of the timer text and time elapsed.
 *
 */
export class Timer {
  constructor() {
    this.xPanel = 10;
    this.yPanel = 50;
    this.width = 190;
    this.height = 20;
    this.xText = 10;
    this.yText = 85;
    this.xTime = 125;
    this.yTime = 85;
  }
  /**
   *  Reset the timer object by setting it to 60 seconds and clear a potentially
   *  existing setInterval() function for timer.myTimer. Then use the setInterval() function to call
   *  the timer.update() method every second (1000 milliseconds).
   *  This function is called by the reset() function in engine.js.
   */
  reset() {
    this.time = 60;
    clearInterval(timer.myTimer);
    this.myTimer = setInterval(timer.update, 1000);
  }
  /**  Decrease the timer by 1 if the game is active and the timer is greater than 0.
   *  If the timer has reached 0 and the player has not yet gathered 200 points,
   *  the player dies and the game is over (player.alive = false).
   *  If the score has reached 200 and the timer has not reached 0 the game is
   *  won and the clearInterval function is called to stop the timer.
   *  player.alive and player.gameWon are tested against in the main() game-loop function in
   *  engine.js.
   *  This function is called by setting the setInterval() function in the
   *  timer.reset() method.
   */
  update() {
    if (
      player.characterSelectedFlag &&
      player.alive &&
      app.pauseFlag === false &&
      timer.time > 0
    ) {
      timer.time--;
    }
    if (timer.time <= 0 && player.score < 200) {
      player.alive = false;
    }
    if (player.score >= 200) {
      player.gameWon = true;
      clearInterval(timer.myTimer);
    }
  }
  /**
   *  Render the timer on a lightblue panel in the upper left corner of the canvas.
   *  'ctx' is the 2D rendering context of the canvas defined in engine.js.
   *  This function is called by the renderEntities() function in engine.js.
   */
  render() {
    app.displayPanel(
      this.xPanel,
      this.yPanel,
      this.width,
      this.height,
      "lightblue"
    );
    ctx.font = "32pt Lobster";
    ctx.fillStyle = "blue";
    ctx.fillText("Timer: ", this.xText, this.yText);
    ctx.fillText(timer.time, this.xTime, this.yTime);
  }
}
