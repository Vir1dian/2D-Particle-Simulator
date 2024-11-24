
class Vector2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  
  add(otherVector: Vector2D): Vector2D {
    return new Vector2D(this.x + otherVector.x, this.y + otherVector.y);
  }

  dot_product(otherVector: Vector2D): number {
    return (this.x * otherVector.x) + (this.y * otherVector.y);
  }

  randomize(max: number = 1, min?: number) {
    if (min === undefined) {
      min = -max;
    }
    this.x = Math.floor(Math.random() * (max - min + 1) + min);
    this.y = Math.floor(Math.random() * (max - min + 1) + min);
  }
}

const simulation_particles: Particle[] = [];

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
    position: Vector2D = new Vector2D(), 
    velocity: Vector2D = new Vector2D(), 
    acceleration: Vector2D = new Vector2D(),
  ) {
    Particle.instance_count++;
    this.id = Particle.instance_count;

    this.mass = mass;
    this.radius = radius;
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;

    simulation_particles.push(this);
  }

  collide_container_elastic(container: BoxSpace) {
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

  collide_particle_elastic(otherParticle: Particle, elasticity: number = 1) {
    const distance: number = Math.sqrt(Math.pow(this.position.x - otherParticle.position.x, 2) + Math.pow(this.position.x - otherParticle.position.y, 2));
    if (distance < this.radius + otherParticle.radius) {
      
      const impulse: number = -(1 + elasticity);
      
    }
  }

  move() {
    this.velocity = this.velocity.add(this.acceleration);
    this.position = this.position.add(this.velocity)
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
      this.position.randomize(max);
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
      this.velocity.randomize(max);
    }
    else {
      this.velocity.x = a;
      this.velocity.y = b;
    }
  }

}
