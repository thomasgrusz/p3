/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

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

        /* Check whether the game is paused and if not call our update/render
         * functions, pass along the time delta to our update function since
         * it may be used for smooth animation.
         */
        if (pauseFlag === false && selectPlayerFlag === true) {
            update(dt);
            render();
        } else if (selectPlayerFlag === false) {
            selectPlayer();
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
        allEnemies.forEach(function(enemy) {
            enemy.init;
        });
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        updateScore();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        player.update();
    }

    function checkCollisions() {
        
        /* Check collisions between player and all enemies
         */
        allEnemies.forEach(function(enemy) {
            collisionEnemyDetect(enemy);
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
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
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
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
        renderScore();
    }

    /* This function does nothing but it could have been a good place to.lineTo(, 555);
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* This function is called by the main() function and first draws a white
     * rounded square, displaying all player-characters to choose from.
     * The player can be highlighted via arrow keys and selected by hitting return
     */

function selectPlayer() {
    renderBackground();

    /* Draw white background panel with green outline
     */
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green'
    ctx.fillStyle = 'white';

    ctx.beginPath();
    ctx.moveTo(30, 200);
    ctx.lineTo(475,200);
    ctx.quadraticCurveTo(485, 200, 485, 210);
    ctx.lineTo(485, 410);
    ctx.quadraticCurveTo(485, 420, 475, 420);
    ctx.lineTo(30, 420);
    ctx.quadraticCurveTo(20, 420, 20, 410);
    ctx.lineTo(20, 210);
    ctx.quadraticCurveTo(20, 200, 30, 200);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(30, 200);
    ctx.lineTo(475,200);
    ctx.quadraticCurveTo(485, 200, 485, 210);
    ctx.lineTo(485, 410);
    ctx.quadraticCurveTo(485, 420, 475, 420);
    ctx.lineTo(30, 420);
    ctx.quadraticCurveTo(20, 420, 20, 410);
    ctx.lineTo(20, 210);
    ctx.quadraticCurveTo(20, 200, 30, 200);
    ctx.stroke();


    /* Draw player characters
     */
    var playerImages = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];
    for (var i = 0; i < playerImages.length; i++) {
        ctx.drawImage(Resources.get(playerImages[i]), 20+i*90, 180);
    }

    ctx.font = '20pt Lobster';
    ctx.fillStyle = 'green';
    ctx.fillText('select your hero and press ENTER!', 75, 400);

    drawSelectorBox(selectorBox[selectorBoxX]);
}

    /* This function is called by the selectPlayer() function and
     * draws a lightgreen selector outline around characters, that
     * can be moved laterally with the arrow key.
     */
    function drawSelectorBox(x) {
        ctx.strokeStyle = 'lightgreen';
        ctx.beginPath();
        ctx.moveTo(x, 220);
        ctx.lineTo(x+63,220);
        ctx.quadraticCurveTo(x+73, 220, x+73, 230);
        ctx.lineTo(x+73, 340);
        ctx.quadraticCurveTo(x+73, 350, x+63, 350);
        ctx.lineTo(x, 350);
        ctx.quadraticCurveTo(x-10, 350, x-10, 340);
        ctx.lineTo(x-10, 230);
        ctx.quadraticCurveTo(x-10, 220, x, 220);
        ctx.stroke();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
