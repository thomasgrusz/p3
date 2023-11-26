// This script checks if the screen is large enough and no touchscreen
// and loads the game. Otherwise informs the user that he cannot play on
// his device.

export default startGame;
startGame();

function startGame() {
  // Messages
  const touchScreenMsg =
    "Sorry, this game cannot be played on a touchscreen. 😔";
  const screenTooSmallMsg =
    "Sorry, this game needs a larger screen for playing. 😔";

  // Check screen
  let isTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints;
  let isSmallScreen =
    window.matchMedia("(max-width: 519px)").matches ||
    window.matchMedia("(max-height: 769px)").matches;

  // Render messages OR start the game by loading 'engine.js'
  if (isTouchScreen) {
    renderMsg(touchScreenMsg);
  } else if (isSmallScreen) {
    renderMsg(screenTooSmallMsg);
  } else loadGameEngine();

  function renderMsg(message) {
    // empty the footer
    const myFooter = document.querySelector("footer");
    myFooter.style.padding = "4rem";
    //write message into footer
    myFooter.textContent = message;
    // fade in the html body
    document.body.classList.remove("fade");
  }

  async function loadGameEngine() {
    const gameEngine = await import("./engine.js");
    gameEngine.loadResources();
  }
}
