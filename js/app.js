// Enemies our player must avoid
function Enemy() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    var image = 'images/enemy-bug.png',
        position = randomPos();

    GameObject.call(this, image, position.x, position.y);
};

Enemy.prototype = Object.create(GameObject.prototype);
Enemy.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player() {
    var image = 'images/char-boy.png',
        position = {
            x: ctx.canvas.clientWidth / 2,
            y: ctx.canvas.height - 200
        };
    GameObject.call(this, image, position.x, position.y);
}

Player.prototype = Object.create(GameObject.prototype);
Player.constructor = Player;

Player.prototype.update = function() {

};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function() {

};

function GameObject(image, posX, posY) {
    this.sprite = image;
    this.x = posX;
    this.y = posY;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy()];

var player = new Player();


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
function randomPos() {
    var position = {};

    position.x = 40;
    position.y = getRandomIntInclusive(100, 200);

    return position;
}

// Returns a random integer between min (included) and max (included)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}