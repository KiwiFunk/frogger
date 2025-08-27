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
    player.move(0, -20);
  } else if (keyMap.down.includes(key)) {
    player.move(0, 20);
  } else if (keyMap.left.includes(key)) {
    player.move(-20, 0);
  } else if (keyMap.right.includes(key)) {
    player.move(20, 0);
  }
});

const obstacles = [
    new Obstacle(0, 300, 60, 40, 2),
    new Obstacle(200, 200, 60, 40, 3),
    new Obstacle(400, 100, 60, 40, 1.5)
];

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
