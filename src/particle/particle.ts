interface Vector2D {
  x: number;
  y: number;
}

class Particle {
  mass: number;
  radius: number;
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;

  constructor(
    mass: number = 1,
    radius: number = 5,
    position: Vector2D = { x: 0, y: 0}, 
    velocity: Vector2D = { x: 0, y: 0}, 
    acceleration: Vector2D = { x: 0, y: 0},
  ) {
    this.mass = mass;
    this.radius = radius;
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
  }

  collide() {
    
  }

  move() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

}