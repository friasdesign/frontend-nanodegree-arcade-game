// Used Addy Osmani's pattern from his book:
// https://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript

/**
 * A `GameObjectInstanciator` is used to create a unique instance of GameObject,
 * if called more than once, the same instance is returned.
 *
 * @class GameObjectInstanciator
 * @static
 */
var GameObject = (function gameObjectInstanciator(){
  /**
   * Instance of `GameObject` to be returned.
   *
   * @property instance
   * @type Object
   */
  var instance;

  /**
   * A `GameObject` object is used to deal with game related actions, such as
   * restarting game, score system, difficulty and levelling.
   * 
   * @class GameObject
   * @static
   */
  function GameObject() {
    /**
     * Holds the current score.
     * 
     * @property score
     * @type Integer
     * @default 0
     * @private
     */
    var score = 0;
    /**
     * Holds the score text to be displayed in the GUI.
     * 
     * @property scoreText
     * @type String
     * @default 'Score: 0'
     * @private
     */
    var scoreText = 'Score: ' + score;
    /**
     * Holds the current level.
     * 
     * @property level
     * @type Integer
     * @default 1
     * @private
     */
    var level = 1;
    /**
     * Holds the level text to be displayed in the GUI.
     * 
     * @property levelText
     * @type String
     * @default 'Level: 1'
     * @private
     */
    var levelText = 'Level: ' + level;
    /**
     * Whether the game is over or not.
     * 
     * @property gameover
     * @type Boolean
     * @default false
     * @private
     */
    var gameover = false;

    /**
     * Updates `scoreText`.
     * 
     * @method updateScoreText
     * @private
     */
    function updateScoreText() {
      scoreText = 'Score: ' + score;
    }

    /**
     * Updates `levelText`.
     * 
     * @method updateLevelText
     * @private
     */
    function updateLevelText() {
      levelText = 'Level: ' + level;
    }

    /**
     * It draws gameover screen if `gameover` is true. Gameover screen shows a 
     * _GAMEOVER_ message and ask the use to press __R__ key to restart.
     * 
     * @method drawGameOverScreen
     * @private
     */
    function drawGameOverScreen() {
      if(gameover) {
        let width = ctx.canvas.clientWidth,
            height = ctx.canvas.clientHeight;

        // Draw full canvas transparent background for game over screen
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, width, height);

        // Draw Game Over text
        ctx.fillStyle = '#fff';
        ctx.font = '48px Sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', width/2, height/2);

        // Draw press R to restart, text
        ctx.font = '18px Sans-serif';
        ctx.fillText('Press R to restart', width/2, (height/2) + 40);
      }
    }

    /**
     * It draws GUI elements on the canvas.
     * 
     * @method drawGUI
     * @private
     */
    function drawGUI() {
      // Draw Level Text
      ctx.fillStyle = '#fff';
      ctx.font = '20px Sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(levelText, 20, 30);

      // Draw Score Text
      ctx.font = '20px Sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(scoreText, ctx.canvas.clientWidth-20, 30);      
    }

    /**
     * It performs all the actions needed for levelling up, including adding
     * obstacles and increasing `level` variable.
     * 
     * @method levelUp
     * @private
     */
    function levelUp() {
      if(level < 5) {
        level += 1;
        updateLevelText();

        switch(level) {
          case 3: obstacles.push(new Obstacle(3,4));
            break;
          case 4: obstacles.push(new Obstacle(1,3));
                  obstacles.push(new Obstacle(3,2));
            break;
          case 5: obstacles.push(new Obstacle(1,1));
                  obstacles.push(new Obstacle(3,0));
        }
      }
    }

    return {
      /**
       * It updates the `score` property, each 50 points fo score, `level` is
       * raised.
       * 
       * @method updateScore
       */
      updateScore: function updateScore() {
        score += 25;
        updateScoreText();
        if(score % 50 === 0) {
            levelUp();
        }
      },
      /**
       * This method kills the player and tells the `GameObject` that the game
       * is over.
       * 
       * @method gameOver
       */
      gameOver: function gameOver() {
        player.kill();
        gameover = true;
      },
      // TODO change docs entry
      /**
       * It returns `true` if game is over.
       * 
       * @method isGameOver
       * @return {Boolean} `gameOver` private property's value.
       */
      get isGameOver() {
        return gameover;
      },
      set isGameOver(val) {
        throw new TypeError('gameover property is private.');
      },
      /**
       * It takes all the steps needed for restarting the game, after the player
       * press the __R__ key to restart. It respawns the player, clear obstacles,
       * and resets level and score.
       * 
       * @method restart
       */
      restart: function restart(){
        player.spawn();
        
        gameover = false;

        obstacles = [];

        score = 0;
        updateScoreText();
        level = 1;
        updateLevelText();
      },
      /**
       * This `Render` method is called each rendering phase from `engine.js`.
       * It draws the _GUI_ and _gameover screen_.
       * 
       * @method render
       */
      render: function renderScreen() {
        drawGameOverScreen();
        drawGUI();
      },
      // TODO change docs entry
      /**
       * It returns the value of the private property `level`, which represents
       * the current level.
       * 
       * @method getLevel
       * @return {Integer} The value of `level` property.
       */
      get level() {
        return level;
      },
      set level(val) {
        throw new TypeError('level property is private.');
      }
    };
  }

  return {
    /**
     * It returns a new instance of `GameObject` if no instance exists, if
     * already instanciated, a reference to that instance is returned instead.
     *
     * @method getInstance
     * @for GameObjectInstanciator
     * @return {Object} A reference to a new or already existing instance of
     * `GameObject`.
     */
    getInstance: function getInstance() {
      if(!instance) {
        instance = GameObject();
      }
      return instance;
    }
  };
})();

/**
 * A `GridInstanciator` is used to create a unique instance of `Grid`,
 * if called more than once, the same instance is returned.
 *
 * @class GridInstanciator
 * @static
 */
var Grid = (function GridInstanciator(){
  /**
   * Instance of `Grid` to be returned.
   *
   * @property instance
   * @type Object
   */
  var instance;

  /**
   * A `Grid` object holds all methods necessary to implement a grid system on
   * the game.
   * 
   * @class Grid
   * @static
   */
  function Grid() {

  /**
   * `Origin` has the coordinates (x, y) the corresponds to Row:0, Col:0.
   * 
   * @property origin
   * @type Object
   * @default { x: 0, y: -20 }
   * @private
   */
  var origin = {
    x: 0,
    y: -20
  };

  /**
   * `maxRow` holds the number of the row at the bottom of the grid.
   * 
   * @property maxRow
   * @type Integer
   * @default 5
   * @private
   */
  var maxRow = 5;

  /**
   * `maxCol` holds the number of the row at the far right of the grid.
   * 
   * @property maxCol
   * @type Integer
   * @default 4
   * @private
   */
  var maxCol = 4;

  /**
   * It holds the value for the __width__ of a Box in the __grid__.
   * 
   * @property boxWidth
   * @type Integer
   * @default 100
   * @private
   */
  var boxWidth = 100;

  /**
   * It holds the value for the __height__ of a Box in the __grid__.
   * 
   * @property boxHeight
   * @type Integer
   * @default 83
   * @private
   */
  var boxHeight = 83;

  return {
      // TODO change docs
      /**
       * A getter for `boxWidth` property which holds the width of a single box
       * of the grid.
       * 
       * @method getBoxWidth
       * @return {Integer} The value of `boxWidth` property.
       */
      get boxWidth() {
        return boxWidth;
      },
      set boxWidth(val) {
        throw new TypeError('boxWidth property is private.');
      },
      /**
       * A getter for `boxHeight` property which holds the height of a single box
       * of the grid.
       * 
       * @method getBoxHeight
       * @return {Integer} The value of `boxHeight` property.
       */
      get boxHeight() {
        return boxHeight;
      },
      set boxHeight(val) {
        throw new TypeError('boxHeight property is private.');
      },
      /**
       * Transforms a row number value to a y value in the canvas.
       * 
       * @method rowToY
       * @param row {Integer} A row number.
       * @return {Float} A value for y in the canvas.
       */
      rowToY: function rowToY(row) {
        var y = 0;

        if(row === 0) {
          y = origin.y;
        }else {
          // It's necessary to use origin.y as offset
          // variable because the value for row 0 is
          // different from  y = 0.
          y = (row * boxHeight) + origin.y;
        }

        return y;
      },
      /**
       * Transforms a column number value to an x value in the canvas.
       * 
       * @method colToX
       * @param col {Integer} A column number.
       * @return {Float} A value for x in the canvas.
       */
      colToX: function colToX(col) {
        var x = 0;
        x = col * boxWidth;
        return x
      },
      /**
       * Displace the given y position up or down a `number` rows.
       * 
       * @method displaceRows
       * @param y {Float} The current position relative to __Y__ axis.
       * @param number {Integer} The number of rows to move. A negative number
       * moves up, a positive one down.
       * @return {Float} A new value for __Y__.
       */
      displaceRows: function displaceRows(y, number) {
        return y + (number * boxHeight);
      },
      /**
       * Displace the given x position right or left a `number` columns.
       * 
       * @method displaceCols
       * @param x {Float} The current position relative to __X__ axis.
       * @param number {Integer} The number of cols to move. A negative number
       * moves to the left, a positive one to the right.
       * @return {Float} A new value for __X__.
       */
      displaceCols: function displaceCols(x, number) {
        return x + (number * boxWidth);
      },
      /**
       * It checks whether the current __Y__ position touches the water or not.
       * 
       * @method inWater
       * @param y {Float} The current position relative to __Y__ axis.
       * @return {Boolean} `true` if the current position is _in water_, `false`
       * if not.
       */
      inWater: function inWater(y) {
        if(y === origin.y) {
          return true;
        }
        return false;
      },
      /**
       * It checks whether the current __X__, __Y__ position is inside the
       * boundaries.
       * 
       * @method inBound
       * @param y {Float} The current position relative to __X__ axis.
       * @param y {Float} The current position relative to __Y__ axis.
       * @return {Boolean} `true` if the current position is _inside the
       * boundaries_, `false` if not.
       */
      inBound: function inBound(x, y) {
        // It takes origin as default value, so you can omit one param.
        x = x || origin.x;
        y = y || origin.y;

        if(x > this.colToX(maxCol) || y > this.rowToY(maxRow) ||
           y < origin.y || x < origin.x) {
          return false;
        }
        return true;
      }
    };
  };

  return {
    /**
     * It returns a new instance of `Grid` if no instance exists, if
     * already instanciated, a reference to that instance is returned instead.
     *
     * @method getInstance
     * @for GridInstanciator
     * @return {Object} A reference to a new or already existing instance of
     * `Grid`.
     */
    getInstance: function getInstance() {
      if(!instance) {
        instance = Grid();
      }
      return instance;
    }
  };
})();

/**
 * It represents an element that should be displayed in canvas. This is the most
 * abstract type of object.
 *
 * @class InCanvasObject
 * @constructor
 */
function InCanvasObject(x, y) {
  /**
   * The position of the element relative to __X__ axis.
   *
   * @property x
   * @type Float
   * @default 0
   */
  this.x = x || 0;
  /**
   * The position of the element relative to __Y__ axis.
   *
   * @property y
   * @type Float
   * @default 0
   */
  this.y = y || 0;
}

/**
 * It represents an element that has _'physical presence'_ in the game. It has a
 * `collider` and a `sprite` to be rendered. All Physical Objects can be placed
 * in the grid.
 *
 * @class PhysicalObject
 * @constructor
 * @extends InCanvasObject
 * @param image {String} The URL of an image
 */
function PhysicalObject(image) {
  InCanvasObject.call(this);

  /**
   * The sprite (image) to be drawn on the canvas.
   *
   * @property sprite
   * @type String
   */
  this.sprite = image;

  /**
   * The collider of the object, which allows collision detection.
   *
   * @property collider
   * @type Collider
   */
  this.collider = new Collider(this);
}

inherit(PhysicalObject, InCanvasObject);

/**
 * This method spawns the object on a default position in the grid.
 *
 * @method spawn
 * @for PhysicalObject
 */
PhysicalObject.prototype.spawn = function spawn() {
  this.x = grid.colToX(2);
  this.y = grid.rowToY(5);
};

/**
 * This method is executed each rendering phase in `engine.js`, drawing the
 * sprite in the canvas. It also draws the collider.
 *
 * @method render
 * @for PhysicalObject
 */
PhysicalObject.prototype.render = function render() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  this.collider.render();
};

/**
 * This method is executed each updating phase in `engine.js`. It deals with
 * actions such as movement and collision detection.
 *
 * @method update
 * @param dt {Float} Delta time for better rendering.
 * @for PhysicalObject
 */
PhysicalObject.prototype.update = function(dt) {};

/**
 * It's a dummy for the physical form of an object which allows collision
 * detection.
 *
 * @class Collider
 * @constructor
 * @param obj {Object} The object that owns the collider.
 * @param [originX=0] {Float} A position relative to __X__ axis.
 * @param [originY=0] {Float} A position relative to __Y__ axis.
 * @param [width=grid.getBoxWidth] {Float} The width of the collider's rectangle, 
 * this value defaults to the height of a grid's box.
 * @param [height=grid.boxHeight] {Float} The height of the collider's rectangle,
 * this value defaults to the width of a grid's box.
 */
function Collider(obj, originX, originY, width, height) {
  // Defaulting
  originX = typeof originX === 'number' ? originX : 0;
  originY = typeof originY === 'number' ? originY : 0;
  height = typeof height === 'number' ? height : grid.boxHeight;
  width = typeof width === 'number' ? width : grid.boxWidth;

  /**
   * It's a reference to the object that owns this collider.
   *
   * @property obj
   * @type Object
   */
  this.obj = obj;

  // Origin represents the position in canvas that collider has relative to
  // the origin point of its containing object (i.e. Player, Enemy, etc.)
  /**
   * The origin point of the collider relative to
   * __X__ axis. This value represents position of the collider relative to the
   * position of the owning object.
   *
   * @property originX
   * @type Float
   */
  this.originX = originX;

  /**
   * The same as `originX` but relative to __Y__ axis.
   *
   * @property originY
   * @type Float
   */
  this.originY = originY;

  /**
   * The width of the collider's rectangle.
   *
   * @property width
   * @type Float
   */
  this.width = width;

  /**
   * The height of the collider's rectangle.
   *
   * @property height
   * @type Float
   */
  this.height = height;
}

/**
 * This method is executed each rendering phase in `engine.js`, drawing the
 * sprite in the canvas.
 *
 * @method render
 * @for Collider
 */
Collider.prototype.render = function render() {
  var position = this.getPosition();

  ctx.fillStyle = 'rgba(0,0,0,0)'; // Change alpha to 1 for testing
  ctx.fillRect(position.x, position.y, this.width, this.height);
};

/**
 * It returns the current position of the collider. Which is the position of
 * the upper left corner of the rectangle.
 *
 * @method getPosition
 * @return {Object} The position of the collider.
 * @for Collider
 */
Collider.prototype.getPosition = function getPosition() {
  return {
    x: this.obj.x + this.originX,
    y: this.obj.y + this.originY
  }
}

/**
 * This method sets the collider's properties based on values passed in a
 * _configuration object_. Here is an example of usage, this example since
 * no value has been passed to `originX`, it uses the default value:
 *  ``` javascript
 *  this.collider.setCollider({
 *    originY: grid.getBoxHeight(),
 *    height: grid.getBoxHeight() * 0.7,
 *    width: grid.getBoxWidth() * 0.85
 *  });
 *  ```
 *
 * @method setCollider
 * @param confObj {Object} The configuration object. It holds the properties: 
 * `originX`, `originY`, `width`, `height`. These properties are optional and
 * default to the current value for `this`.
 * @for Collider
 */
Collider.prototype.setCollider = function set(confObj) {

  // Defaulting and assign.
  // If no valid value is passed or no property present,
  // then take the current value.
  for(parameter in this) {
    if(this.hasOwnProperty(parameter)) {
      if(confObj.hasOwnProperty(parameter) && typeof confObj[parameter] === 'number') {
        this[parameter] = confObj[parameter];
      }
    }
  }
};

// Snippet from:
// stackoverflow.com/questions/20846944/check-if-two-items-overlap-on-a-canvas-using-javascript
/**
 * This method detects whether a collision exist between this collider and any
 * other instance of `Collider`, passed as an argument.
 *
 * @method collision
 * @param collider {Collider} A `Collider` instance.
 * @return {Boolean} Returns `true` if a collision exists, `false` if not.
 * @for Collider
 */
Collider.prototype.collision = function intersects(collider) {
  // thisPosition, and colliderPosition store the values of the actual position
  // those colliders have in the canvas.
  var thisPos = this.getPosition(),
      colliderPos = collider.getPosition();

  return !( thisPos.x > (colliderPos.x + collider.width)  ||
            (thisPos.x + this.width) < colliderPos.x  ||
            thisPos.y > (colliderPos.y + collider.height) ||
            (thisPos.y + this.height) < colliderPos.y);
}

/**
 * This class represents all enemies (bugs).
 *
 * @class Enemy
 * @constructor
 * @extends PhysicalObject
 */
function Enemy() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  var image = 'images/enemy-bug.png';
  PhysicalObject.call(this, image);

  /**
   * The speed the enemy moves around the grid.
   *
   * @property speed
   * @type Float
   * @default 0
   */
  this.speed = 0;

  // Setting collider
  this.collider.setCollider({
    originY: grid.boxHeight * 0.9,
    height: grid.boxHeight * 0.9
  });
};

inherit(Enemy, PhysicalObject);

/**
 * This method sets the `speed` property based on the current difficult level
 * in `gameObject`.
 *
 * @method setSpeed
 * @for Enemy
 */
Enemy.prototype.setSpeed = function setSpeed() {
  // Difficulty multiplies enemy speed up to 2 times
  var level = gameObject.level,
      difficulty = level <= 3 ? level : 3; 

  this.speed = getRandomIntInclusive(100, 250) * difficulty/2;
}

// OVERRIDDEN METHODS

Enemy.prototype.spawn = function spawn() {
  var randRow = 0,
      randCol = 0;

  // This code generates a random int number between 1 and 3 representing a
  // row in which the enemies will spawn.
  randRow = getRandomIntInclusive(1, 3);

  // This code generates a random int as previous one, in this case we want
  // some enemies to spawn off screen.
  randCol = getRandomIntInclusive(-2, 0);
  
  this.x = grid.colToX(randCol);
  this.y = grid.rowToY(randRow);
}

Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  
  // If outbounds, then go back to the left!
  if(this.x >= 500){
    let randCol = getRandomIntInclusive(-4, -1),
        randRow = getRandomIntInclusive(1, 3);
    this.x = grid.colToX(randCol);

    // Reset speed and row, to make things a little more interesting
    this.setSpeed();
    this.y = grid.rowToY(randRow);
  }
  this.x = this.x + (this.speed * dt);

  if(this.collider.collision(player.collider)) {
    gameObject.gameOver();
  }
};


/**
 * This class represents the player itself.
 *
 * @class Player
 * @constructor
 * @extends PhysicalObject
 */
function Player() {

  var image = 'images/char-boy.png';
  PhysicalObject.call(this, image);

  /**
   * This property holds the value of the last position relative to __X__ axis.
   *
   * @property lastX
   * @type Float
   * @default The initial position of the player relative to __X__
   * axis.
   */
  this.lastX = this.x;

  /**
   * This property holds the value of the last position relative to __Y__ axis.
   *
   * @property lastX
   * @type Float
   * @default The initial position of the player relative to __Y__
   * axis.
   */
  this.lastY = this.y;

  // Setting collider
  this.collider.setCollider({
    originY: grid.boxHeight,
    originX: 10,
    height: grid.boxHeight * 0.7,
    width: grid.boxWidth * 0.85
  });
}

inherit(Player, PhysicalObject);

/**
 * This method sets the current position of `player` to the last position held
 * in both `lastX` and `lastY` properties.
 *
 * @method bounce
 * @for Player
 */
Player.prototype.bounce = function bounce() {
  this.x = this.lastX;
  this.y = this.lastY;
};

/**
 * This method _kills_ `player`, by setting a position for `player` out of the
 * boundaries.
 *
 * @method kill
 * @for Player
 */
Player.prototype.kill = function kill() {
  this.x = -200;
  this.y = -200;
};

/**
 * This method sets the current position of `player` as the last position. This
 * method is called just before the player moves to a new position.
 *
 * @method recordLastPosition.
 * @for Player
 */
Player.prototype.recordLastPosition = function record() {
  this.lastY = this.y;
  this.lastX = this.x;
};

/**
 * This method has all the implementations for handling player keyboard input,
 * that is moving `player` object or restarting game.
 *
 * @method handleInput
 * @for Player
 */
Player.prototype.handleInput = function handleInput(input) {
  var current = {
        x: this.x,
        y: this.y
      },
      axis = '',
      distance = 0,
      nextPos = 0;

  switch(input) {
    case 'down': axis = 'y'; distance = 1;
      break;
    case 'up': axis = 'y'; distance = -1;
      break;
    case 'right': axis = 'x'; distance = 1;
      break;
    case 'left': axis = 'x'; distance = -1;
      break;
    case 'r': if(gameObject.isGameOver) gameObject.restart();
  }

  // In fact, it can be done better, with a different approach,
  // but for now it's OK!
  if(axis === 'y') {
    nextPos = grid.displaceRows(current[axis], distance);
    if(grid.inBound(null, nextPos)) {
      this.recordLastPosition();
      this.y = nextPos;
    }
  }
  if(axis === 'x') {
    nextPos = grid.displaceCols(current[axis], distance);
    if(grid.inBound(nextPos, null)) {
      this.recordLastPosition();
      this.x = nextPos;
    }
  }
};

// OVERRIDEN METHODS

Player.prototype.update = function update() {
  if(grid.inWater(this.y)){
    gameObject.updateScore();
    this.spawn();
  }
};

/**
 * This class represents all obstacles (rocks) on the player's way.
 *
 * @class Obstacle
 * @constructor
 * @extends PhysicalObject
 */
function Obstacle(row, col) {
  var image = 'images/Rock.png';
  PhysicalObject.call(this, image);

  this.x = grid.colToX(col);
  this.y = grid.rowToY(row);

  // Setting collider
  this.collider.setCollider({
    originY: grid.boxHeight * 0.9,
    height: grid.boxHeight * 0.9
  });  
}

inherit(Obstacle, PhysicalObject);

// OVERRIDEN METHODS

Obstacle.prototype.update = function update() {
  if(this.collider.collision(player.collider)) {
    player.bounce();
  }
};


// MAIN ________________________________________________________________________

// Here in MAIN, we declare and instanciate needed globals that will be used in
// engine.js, or throughout the application.
var enemiesNumber = 5,
  grid = Grid.getInstance(),
  allEnemies = [], 
  player = new Player(),
  gameObject = GameObject.getInstance(),
  obstacles = [];

for(let i=0; i < enemiesNumber; i++) {
  allEnemies.push(new Enemy());
};


// LISTENERS ___________________________________________________________________

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    82: 'r'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});


// HELPER FUNCTIONS ____________________________________________________________

// Returns a random integer between min (included) and max (included)
// developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Used for inheritance
function inherit(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}
