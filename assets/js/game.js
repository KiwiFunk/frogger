const GRID_UNIT = 50;
const GAME_HEIGHT = 800;
const GAME_WIDTH = 600;

//Add canvas variables and use these in HTML to set canvas size
//Logic will also need to be implmented in constructor for obstacles.

// Link Canvas from HTML
const canvas = document.getElementById('game-canvas');
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
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

const OBSTACLE_MAX = 3;
const MAX_SPEED = 4;
const obstacles = [];
// Sets are like lists, however will not allow storing of duplicate values.
const usedY = new Set();

function getUniqueGridPos() {

  // Prevent an infinite loop
  let attempts = 0;
  while (attempts < 100) {
    const xIndex = Math.floor(Math.random() * 10 + 1) * GRID_UNIT;;
    const yIndex = Math.floor(Math.random() * 10 + 1) * GRID_UNIT;;

    if (!usedY.has(yIndex)) {
      usedY.add(yIndex);
      return {
        x: xIndex,
        y: yIndex
      };
    }
    attempts++;
  }
  throw new Error("Unable to find unique height position");
}

for (let i = 0; i < OBSTACLE_MAX; i++) {
  // Use object deconstructing to get the x and y position from getUniqueGridPos
  const { x, y } = getUniqueGridPos();
  const speed = Math.floor(Math.random() * MAX_SPEED) + 1;

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
