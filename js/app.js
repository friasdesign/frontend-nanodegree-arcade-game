// TODO: Add out of bounds validation
//       Add score system and game over text
//       Add obstacles, when score gets higher
//       Refactor code

// Grid Singletone, added in order to keep all related functions under the same
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
      if(x > colToX(maxCol) || y > rowToY(maxRow)) {
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
  this.speed;
  this.setSpeed();

  // Setting collider
  this.collider.setCollider({
    originY: grid.boxHeight * 0.9,
    height: grid.boxHeight * 0.9
  });
};

classify(Enemy, PhysicalObject);

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
  this.speed = getRandomIntInclusive(100, 300);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  
  // If outbounds, then go back to the left!
  if(this.x >= 500){
    let randCol = getRandomIntInclusive(-4, -1);
    this.x = grid.colToX(randCol);

    // Reset speed, to make things a little more interesting
    this.setSpeed();
  }
  this.x = this.x + (this.speed * dt);

  if(this.collider.collision(player.collider)) {
    player.spawn();
  }
  // console.log('Enemy Updated');
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  this.collider.render();
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player() {
  var image = 'images/char-boy.png';

  PhysicalObject.call(this, image);

  // Setting collider
  this.collider.setCollider({
    originY: grid.boxHeight,
    originX: 10,
    height: grid.boxHeight * 0.7,
    width: grid.boxWidth * 0.85
  });
}

classify(Player, PhysicalObject);

Player.prototype.update = function update() {
  if(grid.inWater(this.y)){
    this.spawn();
  }
};
Player.prototype.render = function render() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  this.collider.render();
};
Player.prototype.handleInput = function handleInput(input) {
  var currentX = this.x,
    currentY = this.y,
    newPosition = 0;
  switch(input) {
    case 'down': this.y = grid.displaceRows(currentY, 1);
      break;
    case 'up': this.y = grid.displaceRows(currentY, -1);
      break;
    case 'right': this.x = grid.displaceCols(currentX, 1);
      break;
    case 'left': this.x = grid.displaceCols(currentX, -1);
  }
};

// This Object represents all Physical Objects that can be placed in the grid.
function PhysicalObject(image) {
  this.sprite = image;
  this.collider = new Collider(this);
  this.spawn();
}

PhysicalObject.prototype.spawn = function spawn() {
  this.x = grid.colToX(2);
  this.y = grid.rowToY(5);
}

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

  ctx.fillStyle = 'rgba(0,0,0,0)';
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemiesNumber = 5,
  grid = Grid.getInstance(),
  allEnemies = [], 
  player = new Player();



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
    40: 'down'
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
function classify(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}