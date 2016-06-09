// TODO: Add out of bounds validation.
//       Add collision.

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
            // It represents the distance from one row to another, that is
            // applied to Y axis in order to change row.
            rowDistance = 80,
            // The same as rowDistance but with columns, it's applied to X axis.
            colDistance = 100,
            maxRow = 5,
            maxCol = 4;
        return {
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
                    y = (row*rowDistance) + origin.y;
                }

                return y;
            },
            // Displace the given number of rows from the given y position.
            displaceRows: function displaceRows(y, number) {
                return y + (number * rowDistance);
            },
            // Displace the given number of cols from the given x position.
            displaceCols: function displaceCols(x, number) {
                return x + (number * colDistance);
            },
            // Return y position in canvas for the given col number.
            colToX: function colToX(col) {
                var x = 0;
                x = col * colDistance;
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
    GameObject.call(this, image);

    this.setSpeed();
};

classify(Enemy, GameObject);

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
    // console.log('Enemy Updated');
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player() {
    var image = 'images/char-boy.png';
    GameObject.call(this, image);
}

classify(Player, GameObject);

Player.prototype.update = function update() {
    if(grid.inWater(this.y)){
        this.spawn();
    }
};
Player.prototype.render = function render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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

function GameObject(image) {
    this.sprite = image;
    this.spawn();
}

GameObject.prototype.spawn = function spawn() {
    this.x = grid.colToX(2);
    this.y = grid.rowToY(5);
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