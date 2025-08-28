const GRID_UNIT = 50;

//Add canvas variables and use these in HTML to set canvas size
//Logic will also need to be implmented in constructor for obstacles.

// Link Canvas from HTML
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Initialize the main character
const player = new Character('Frog', 100, 400);

// Listen for keyboard input to move the character
const keyMap = {
  up: ['ArrowUp', 'w', 'W'],
  down: ['ArrowDown', 's', 'S'],
  left: ['ArrowLeft', 'a', 'A'],
  right: ['ArrowRight', 'd', 'D']
};

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (keyMap.up.includes(key)) {
    player.move(0, -GRID_UNIT);
  } else if (keyMap.down.includes(key)) {
    player.move(0, GRID_UNIT);
  } else if (keyMap.left.includes(key)) {
    player.move(-GRID_UNIT, 0);
  } else if (keyMap.right.includes(key)) {
    player.move(GRID_UNIT, 0);
  }
});

const OBSTACTLE_MAX = 3;
const MAX_SPEED = 4;
const obstacles = [];

// These should only be multiples of the GRID_UNIT. Automate these values using Random + GRID_UNIT
for (i = 1; i <= OBSTACTLE_MAX; i++){

  // Generate a random int that's a multiple of GRID_UNIT for x/y pos
  let x = Math.floor(Math.random() * 10 + 1) * GRID_UNIT;
  let y = Math.floor(Math.random() * 10 + 1) * GRID_UNIT;

  // Speed will eventually dependent on overall playtime since we're aiming for an endless runner.\
  let speed = Math.min((Math.floor(Math.random() * 10 + 1)), MAX_SPEED);

  obstacles.push(new Obstacle(x, y, speed));

}

// Draw the game state
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw obstacles
    obstacles.forEach(ob => ob.draw(ctx));

    // Draw the player as a green rectangle
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
    player.updateSprite();

    // Update obstacles
    obstacles.forEach(ob => ob.updatePosition());

    // Check collisions
    obstacles.forEach(ob => {
        if (ob.checkCollision(player)) {
            // Handle collision
            player.takeDamage(ob.damage);
            // Reset player position on collision
            player.x = 100;
            player.y = 400;
        }
    });

    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
