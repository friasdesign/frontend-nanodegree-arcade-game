// TODO: 
//       Refactor code
//       Create API

// GameObject Singleton
var GameObject = (function GameObject(){
  var instance;

  function init() {
    var score = 0,
        scoreText = 'Score: ' + score,
        level = 1,
        levelText = 'Level: ' + level,
        gameover = false;

    function updateScoreText() {
      scoreText = 'Score: ' + score;
    }

    function updateLevelText() {
      levelText = 'Level: ' + level;
    }

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
      updateScore: function updateScore() {
        score += 50;
        updateScoreText();
        if(score % 50 === 0) {
            levelUp();
        }
      },
      gameOver: function gameOver() {
        player.kill();

        gameover = true;
      },
      isGameOver: function isGameOver() {
        return gameOver;
      },
      restart: function restart(){
        player.spawn();
        
        gameover = false;

        obstacles = [];

        score = 0;
        updateScoreText();
        level = 1;
        updateLevelText();
      },
      render: function renderScreen() {
        drawGameOverScreen();
        drawGUI();
      },
      getLevel: function getLevel() {
        return level;
      }
    };
  }

  return {
    getInstance: function getInstance() {
      if(!instance) {
        instance = init();
      }
      return instance;
    }
  };
})();

// Grid Singleton, added in order to keep all related functions under the same
// namespace. Used Addy Osmani's pattern from his book:
// https://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript
var Grid = (function Grid(){
  var instance;

  function init() {
  // Origin has the coordinates (x, y) that corresponds to Row:0, Col:0
  var origin = {
    x: 0,
    y: -20
  },
    maxRow = 5,
    maxCol = 4;
  return {
    // The height and width of a box in the grid
    boxWidth: 100,
    boxHeight: 83,
    // Returns (x, y) position for the given coordinate of the grid
    posBox: function posBox(row, col) {
    var position = {};

    // Sets position.x
    position.x = this.colToX(col);

    // Sets position.y
    position.y = this.rowToY(row);

    return position;
    },
    // Returns x position in canvas for the given row number
    rowToY: function rowToY(row) {
      var y = 0;

      if(row === 0) {
        y = origin.y;
      }else {
        // It's necessary to use origin.y as offset
        // variable because the value for row 0 is
        // different from  y = 0.
        y = (row * this.boxHeight) + origin.y;
      }

      return y;
    },
    // Displace the given number of rows from the given y position.
    displaceRows: function displaceRows(y, number) {
      return y + (number * this.boxHeight);
    },
    // Displace the given number of cols from the given x position.
    displaceCols: function displaceCols(x, number) {
      return x + (number * this.boxWidth);
    },
    // Return y position in canvas for the given col number.
    colToX: function colToX(col) {
      var x = 0;
      x = col * this.boxWidth;
      return x
    },
    // Returns true if the given y position is in the water
    inWater: function inWater(y) {
      if(y === origin.y) {
        return true;
      }
      return false;
    },
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
  getInstance: function getInstance() {
    if(!instance) {
      instance = init();
    }
    return instance;
  }
  };
})();

// This Object represents an element that should be displayed in canvas. This is
// the most abstract type of object
function InCanvasObject(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

// This Object represents all Physical Objects that can be placed in the grid.
function PhysicalObject(image) {
  InCanvasObject.call(this);
  this.sprite = image;
  this.collider = new Collider(this);
}

inherit(PhysicalObject, InCanvasObject);

PhysicalObject.prototype.spawn = function spawn() {
  this.x = grid.colToX(2);
  this.y = grid.rowToY(5);
};

PhysicalObject.prototype.render = function render() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  this.collider.render();
};

PhysicalObject.prototype.update = function(dt) {};

// A collider allows collision detection. obj reference the object related to
// the collider (i.e. Player, Enemy, etc.)
function Collider(obj, originX, originY, width, height) {
  // Defaulting
  originX = typeof originX === 'number' ? originX : 0;
  originY = typeof originY === 'number' ? originY : 0;
  height = typeof height === 'number' ? height : grid.boxHeight;
  width = typeof width === 'number' ? width : grid.boxWidth;

  this.obj = obj;

  // Origin represents the position in canvas that collider has relative to
  // the origin point of its containing object (i.e. Player, Enemy, etc.)
  this.originX = originX;
  this.originY = originY;

  this.width = width;
  this.height = height;
}

// Renders a collider
Collider.prototype.render = function render() {
  var position = this.getPosition();

  ctx.fillStyle = 'rgba(0,0,0,0)'; // Change alpha to 1 for testing
  ctx.fillRect(position.x, position.y, this.width, this.height);
};

// Returns an object with the position of the collider
Collider.prototype.getPosition = function getPosition() {
  return {
    x: this.obj.x + this.originX,
    y: this.obj.y + this.originY
  }
}

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

// Enemies our player must avoid
function Enemy() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  var image = 'images/enemy-bug.png';
  PhysicalObject.call(this, image);

  // Although no value assigned here, I declare speed property here for better
  // readability, instead of simply letting setSpeed method define it.
  this.speed = 0;

  // Setting collider
  this.collider.setCollider({
    originY: grid.boxHeight * 0.9,
    height: grid.boxHeight * 0.9
  });
};

inherit(Enemy, PhysicalObject);

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

Enemy.prototype.setSpeed = function setSpeed() {
  // Difficulty multiplies enemy speed up to 2 times
  var level = gameObject.getLevel(),
      difficulty = level <= 3 ? level : 3; 

  this.speed = getRandomIntInclusive(100, 250) * difficulty/2;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
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
    console.log('collision');
    gameObject.gameOver();
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player() {
  var image = 'images/char-boy.png';
  PhysicalObject.call(this, image);

  // Last position
  this.lastX = this.x;
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

Player.prototype.update = function update() {
  if(grid.inWater(this.y)){
    gameObject.updateScore();
    this.spawn();
  }
};

Player.prototype.bounce = function bounce() {
  this.x = this.lastX;
  this.y = this.lastY;
};

Player.prototype.kill = function kill() {
  this.x = -200;
  this.y = -200;
};

Player.prototype.recordLastPosition = function record() {
  this.lastY = this.y;
  this.lastX = this.x;
};

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

// Obstacles
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

Obstacle.prototype.update = function update() {
  if(this.collider.collision(player.collider)) {
    player.bounce();
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemiesNumber = 5,
  grid = Grid.getInstance(),
  allEnemies = [], 
  player = new Player(),
  gameObject = GameObject.getInstance(),
  obstacles = [];

for(let i=0; i < enemiesNumber; i++) {
  allEnemies.push(new Enemy());
}

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

// HELPER FUNCTIONS ________________________________________

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