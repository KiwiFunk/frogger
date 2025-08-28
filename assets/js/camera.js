class Camera {
    constructor(gameWidth, gameHeight) {
        this.x = 0;
        this.y = 0;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.followOffset = gameHeight * 0.3; // Keep player 30% from top
    }

    follow(target) {
        // Follow target's Y position with an offset
        this.y = Math.max(0, target.y - this.followOffset);
    }

    // Convert world coordinates to screen coordinates
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    // Check if an object is visible on screen (with buffer for smooth transitions)
    isVisible(object, buffer = 100) {
        return object.y + object.height >= this.y - buffer &&
               object.y <= this.y + this.gameHeight + buffer &&
               object.x + object.width >= this.x - buffer &&
               object.x <= this.x + this.gameWidth + buffer;
    }

    // Get the current view bounds
    getViewBounds() {
        return {
            left: this.x,
            right: this.x + this.gameWidth,
            top: this.y,
            bottom: this.y + this.gameHeight
        };
    }
}