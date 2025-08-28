const GRID_UNIT = 50;
const GAME_HEIGHT = 800;
const GAME_WIDTH = 600;

// Link Canvas element from HTML
const canvas = document.getElementById('game-canvas');
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
const ctx = canvas.getContext('2d');

// Init Camera and Player
const camera = new Camera(GAME_WIDTH, GAME_HEIGHT);
const player = new Character('Frog', GAME_WIDTH / 2 - 25, GAME_HEIGHT - 100);

// Game state
let gameRunning = true;
let score = 0;

// Input listeners
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    const key = e.key;
    let moved = false;

    if (['ArrowUp', 'w', 'W'].includes(key)) {
        player.move(0, -GRID_UNIT);
        moved = true;
    } else if (['ArrowDown', 's', 'S'].includes(key)) {
        player.move(0, GRID_UNIT);
        moved = true;
    } else if (['ArrowLeft', 'a', 'A'].includes(key)) {
        player.move(-GRID_UNIT, 0);
        moved = true;
    } else if (['ArrowRight', 'd', 'D'].includes(key)) {
        player.move(GRID_UNIT, 0);
        moved = true;
    }

    if (moved) {
        // Keep player within screen bounds horizontally
        player.x = Math.max(0, Math.min(GAME_WIDTH - player.width, player.x));
        
        // Don't let player go below starting area
        player.y = Math.max(player.y, -2000); // Allow going up infinitely
        
        // Update score based on forward progress
        const newScore = Math.max(0, Math.floor((GAME_HEIGHT - 100 - player.y) / GRID_UNIT));
        if (newScore > score) {
            score = newScore;
            document.getElementById('score-value').textContent = score;
        }
    }
});

// Obstacle management
const obstacles = [];
const OBSTACLE_ROWS = new Map(); // Track which rows have obstacles

// Spawn objects with difficulty scaling
function spawnObstacleRow(rowY) {
    // Don't spawn if row already has obstacles
    if (OBSTACLE_ROWS.has(rowY)) return;
    
    // Base chance to spawn obstacles (starts at 30%, increases with score)
    const baseChance = 0.3;
    const difficultyMultiplier = Math.min(score / 50, 0.4); // Max 40% increase at score 50
    const spawnChance = baseChance + difficultyMultiplier;
    
    if (Math.random() > spawnChance) return;
    
    // Determine direction and speed for this row
    const direction = Math.random() < 0.5 ? 1 : -1;
    
    // Speed increases slightly with score
    const baseSpeed = 0.5 + (score / 100); // Starts at 0.5, increases slowly
    const speed = (baseSpeed + Math.random() * 1) * direction;
    
    // Number of obstacles increases with difficulty
    let numObstacles;
    if (score < 10) {
        numObstacles = Math.floor(Math.random() * 2) + 1; // 1-2 obstacles
    } else if (score < 25) {
        numObstacles = Math.floor(Math.random() * 3) + 1; // 1-3 obstacles
    } else if (score < 50) {
        numObstacles = Math.floor(Math.random() * 3) + 2; // 2-4 obstacles
    } else {
        numObstacles = Math.floor(Math.random() * 4) + 2; // 2-5 obstacles
    }
    
    // Gap size decreases with difficulty
    let gapSize = 150; // Starting gap
    if (score > 20) gapSize = 130;
    if (score > 40) gapSize = 110;
    if (score > 60) gapSize = 100;
    
    // Fix the starting position logic
    let startX;
    if (direction > 0) {
        startX = -200;
    } else {
        startX = GAME_WIDTH + 200;
    }
    
    for (let i = 0; i < numObstacles; i++) {
        const x = startX + (i * gapSize * direction);
        obstacles.push(new Obstacle(x, rowY, speed));
    }
    
    OBSTACLE_ROWS.set(rowY, true);
}

// Update obstacles and clean up
function updateObstacles() {
    // Update positions
    obstacles.forEach(obs => obs.updatePosition());
    
    // Clean up obstacles that are too far off screen
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        if (obs.x < -300 || obs.x > GAME_WIDTH + 300) {
            obstacles.splice(i, 1);
        }
    }
    
    // Clean up old rows from tracking
    const cameraY = camera.y;
    const rowsToDelete = [];
    OBSTACLE_ROWS.forEach((value, rowY) => {
        if (rowY > cameraY + GAME_HEIGHT + 200) {
            rowsToDelete.push(rowY);
        }
    });
    rowsToDelete.forEach(rowY => OBSTACLE_ROWS.delete(rowY));
}

// Spawn obstacles ahead of player
function spawnObstaclesAhead() {
    const cameraY = camera.y;
    const rowsAhead = 20; // Spawn obstacles 20 rows ahead
    
    for (let i = 0; i < rowsAhead; i++) {
        const rowY = Math.floor((cameraY - i * GRID_UNIT) / GRID_UNIT) * GRID_UNIT;
        spawnObstacleRow(rowY);
    }
}

// Check collisions
function checkCollisions() {
    obstacles.forEach(obs => {
        if (obs.checkCollision(player)) {
            resetGame();
        }
    });
}

// Reset game on collision
function resetGame() {
    player.x = GAME_WIDTH / 2 - 25;
    player.y = GAME_HEIGHT - 100;
    score = 0;
    document.getElementById('score-value').textContent = score;
    
    // Clear all obstacles
    obstacles.length = 0;
    OBSTACLE_ROWS.clear();
}

// Draw everything
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update camera to follow player
    camera.follow(player);

    // Draw grid lines for reference (optional)
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let i = 0; i < GAME_HEIGHT / GRID_UNIT; i++) {
        const screenY = (i * GRID_UNIT) - (camera.y % GRID_UNIT);
        if (screenY >= -GRID_UNIT && screenY <= GAME_HEIGHT) {
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(GAME_WIDTH, screenY);
            ctx.stroke();
        }
    }

    // Draw obstacles
    obstacles.forEach(obs => {
        if (camera.isVisible(obs)) {
            const screenPos = camera.worldToScreen(obs.x, obs.y);
            ctx.fillStyle = 'red';
            ctx.fillRect(screenPos.x, screenPos.y, obs.width, obs.height);
        }
    });

    // Draw player
    const playerScreenPos = camera.worldToScreen(player.x, player.y);
    ctx.fillStyle = 'lime';
    ctx.fillRect(playerScreenPos.x, playerScreenPos.y, player.width, player.height);
    
    // Draw simple border around player for visibility
    ctx.strokeStyle = 'darkgreen';
    ctx.lineWidth = 2;
    ctx.strokeRect(playerScreenPos.x, playerScreenPos.y, player.width, player.height);
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Update game systems
    updateObstacles();
    spawnObstaclesAhead();
    checkCollisions();
    
    // Draw everything
    drawGame();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start the game
resetGame(); // Initialize
gameLoop();