class Character {
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  updateSprite() {
    // No sprite yet, but you could animate here
  }
}