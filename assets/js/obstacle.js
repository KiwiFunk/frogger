class Obstacle {
    constructor(x, y, speed, width = 60, height = 50) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    updatePosition() {
        this.x += this.speed;
        if (this.x > 500) this.x = -this.width; // Loop obstacle
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(character) {
        return (
            character.x < this.x + this.width &&
            character.x + character.width > this.x &&
            character.y < this.y + this.height &&
            character.y + character.height > this.y
        );
    }
}