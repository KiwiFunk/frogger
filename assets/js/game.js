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

// Init Camera
const camera = new Camera(GAME_WIDTH, GAME_HEIGHT);

// Initialize the main character
const player = new Character('Frog', GAME_WIDTH / 2, GAME_HEIGHT - 100);

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

   // Keep player within screen bounds horizontally
  player.x = Math.max(0, Math.min(GAME_WIDTH - player.width, player.x));
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

    // Update camera to follow player
    camera.follow(player);

    // Draw obstacles (only visible ones for performance)
    obstacles.forEach(ob => {
        if (camera.isVisible(ob)) {
            const screenPos = camera.worldToScreen(ob.x, ob.y);
            ctx.fillStyle = 'red';
            ctx.fillRect(screenPos.x, screenPos.y, ob.width, ob.height);
        }
    });

    // Draw the player
    const playerScreenPos = camera.worldToScreen(player.x, player.y);
    ctx.fillStyle = 'green';
    ctx.fillRect(playerScreenPos.x, playerScreenPos.y, player.width, player.height);
    
    // Draw world coordinate debug info
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`Player Y: ${Math.round(player.y)}`, 10, 30);
    ctx.fillText(`Camera Y: ${Math.round(camera.y)}`, 10, 50);
}

// Game loop
function gameLoop() {
    player.updateSprite();

    // Update obstacles
    obstacles.forEach(ob => ob.updatePosition());

    // Respawn obstacles that have moved off screen
    obstacles.forEach(ob => {
        if (ob.x > GAME_WIDTH + 100) {
            ob.x = -ob.width - 50;
            // Optionally randomize Y position when respawning
            if (Math.random() < 0.1) { // 10% chance to change lanes
                ob.y = camera.y + Math.random() * GAME_HEIGHT;
            }
        }
    });

    // Check collisions
    obstacles.forEach(ob => {
        if (ob.checkCollision(player)) {
            // Reset player position on collision
            player.x = GAME_WIDTH / 2;
            player.y = Math.max(player.y, camera.y + GAME_HEIGHT - 100);
        }
    });

    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
