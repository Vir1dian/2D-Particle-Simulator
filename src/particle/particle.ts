interface Vector2D {
  x: number;
  y: number;
}

class Particle {
  static instance_count = 0;

  id: number;
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
    this.id = Particle.instance_count;

    this.mass = mass;
    this.radius = radius;
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;

    Particle.instance_count++;
  }

  collide_elastic(container: BoxSpace) {
    if (this.position.x + this.radius > container.x_max) {  // collision with right (totally elastic)
      this.velocity.x = -this.velocity.x;
      this.position.x = container.x_max - this.radius;
    }
    else if (this.position.x - this.radius < container.x_min) {  // collision with left (totally elastic)
      this.velocity.x = -this.velocity.x;
      this.position.x = container.x_min + this.radius;
    }
    if (this.position.y + this.radius > container.y_max) {  // collision with top (totally elastic)
      this.velocity.y = -this.velocity.y;
      this.position.y = container.y_max - this.radius;
    }
    else if (this.position.y - this.radius < container.y_min) {  // collision with bottom (totally elastic)
      this.velocity.y = -this.velocity.y;
      this.position.y = container.y_min + this.radius;
    }
  }

  move() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  /**
   * Sets a new position in a 2D space for a particle
   * 
   * @param {number | 'random'} a Either the position of the particle in the x-axis, or the setting for randomizing the particle position
   * @param {number} b Either the position of the particle in the y-axis, or the set range (-max to +max) that the particle position can be randomized
   */
  setPosition(a: number | 'random' = 0, b: number = 0) {
    if (a === 'random') {
      let max = b === 0 ? 1 : b;
      this.position.x = -max + Math.random() * 2 * max;
      this.position.y = -max + Math.random() * 2 * max;
    }
    else {
      this.position.x = a;
      this.position.y = b;
    }
  }

  /**
   * Sets a new velocity in a 2D space for a particle
   * 
   * @param {number | 'random'} a Either the velocity of the particle in the x-axis, or the setting for randomizing the particle velocity
   * @param {number} b Either the velocity of the particle in the y-axis, or the set range (-max to +max) that the particle velocity can be randomized
   */
  setVelocity(a: number | 'random' = 0, b: number = 0) {
    if (a === 'random') {
      let max = b === 0 ? 1 : b;
      this.velocity.x = -max + Math.random() * 2 * max;
      this.velocity.y = -max + Math.random() * 2 * max;
    }
    else {
      this.velocity.x = a;
      this.velocity.y = b;
    }
  }

}

const simulation_particles: Particle[] = [];

function createParticle() {
  const new_particle: Particle = new Particle();
  simulation_particles.push(new_particle);
}