class Character {
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  updateSprite() {
    // Update the character's sprite based on its current position
  }
}