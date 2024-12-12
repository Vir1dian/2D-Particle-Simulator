const simulation_particles: Particle[] = [];
const particle_colors: string[] = ['black', 'gray', 'blue', 'red', 'pink', 'green', 'yellow', 'orange', 'violet', 'purple', 'white', 'brown'];

class Particle {
  static instance_count = 0;
  id: number;
  mass: number;
  radius: number;
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  oscillation: Vector2D;
  color: string;
  trajectory: boolean;

  constructor(
    mass: number | 'random' = 1,
    radius: number | 'random' = 5,
    position: Vector2D | 'random' = new Vector2D(), 
    velocity: Vector2D | 'random' = new Vector2D(), 
    acceleration: Vector2D | 'random' = new Vector2D(),
    oscillation: Vector2D | 'random' = new Vector2D(),
    color: string | 'random' = 'black',
    trajectory: boolean = false
  ) {
    Particle.instance_count++;
    this.id = Particle.instance_count;
    if (mass === 'random') this.mass = Math.floor(Math.random() * (10 - 1 + 1) + 1);
    else if (mass <= 0) throw new Error('Invalid mass argument.');
    else this.mass = mass;
    if (radius === 'random') this.radius = Math.floor(Math.random() * (20 - 5 + 1) + 5);
    else if (radius <= 0) throw new Error('Invalid radius argument.');
    else this.radius = radius;
    if (position === 'random') {
      this.position = new Vector2D();
      this.setPosition('random', container.x_max - this.radius)
    }
    else this.position = new Vector2D(position.x, position.y);
    if (velocity === 'random') {
      this.velocity = new Vector2D();
      this.setVelocity('random', 200)
    }
    else this.velocity = new Vector2D(velocity.x, velocity.y);
    if (acceleration === 'random') {
      this.acceleration = new Vector2D();
      this.setAcceleration('random', 100)
    }
    else this.acceleration = new Vector2D(acceleration.x, acceleration.y);
    if (oscillation === 'random') {
      this.oscillation = new Vector2D();
      this.setOscillation('random', 0.001)
    }
    else this.oscillation = new Vector2D(oscillation.x, oscillation.y);
    if (color === 'random') {
      this.color = particle_colors[Math.floor(Math.random() * particle_colors.length)];
    }
    else if (!particle_colors.includes(color)) this.color = 'black';
    else this.color = color;
    this.trajectory = trajectory;
    simulation_particles.push(this);
  }

  collideContainer(container: BoxSpace): boolean {
    // const tangential_velocity = 
    //   this.oscillation.x && this.oscillation.y 
    //     ? new Vector2D(this.oscillation.x * Math.cos(time_elapsed), this.oscillation.y * Math.sin(time_elapsed))
    //     : new Vector2D();
    // const total_velocity = this.position.add(tangential_velocity);
    let hasCollided: boolean = false;

    if (this.position.x + this.radius > container.x_max) {  // collision with right (totally elastic)
      this.velocity.x = -this.velocity.x;
      this.position.x = container.x_max - this.radius;
      hasCollided = true;
    }
    if (this.position.x - this.radius < container.x_min) {  // collision with left (totally elastic)
      this.velocity.x = -this.velocity.x;
      this.position.x = container.x_min + this.radius;
      hasCollided = true;
    }
    if (this.position.y + this.radius > container.y_max) {  // collision with top (totally elastic)
      this.velocity.y = -this.velocity.y;
      this.position.y = container.y_max - this.radius;
      hasCollided = true;
    }
    if (this.position.y - this.radius < container.y_min) {  // collision with bottom (totally elastic)
      this.velocity.y = -this.velocity.y;
      this.position.y = container.y_min + this.radius;
      hasCollided = true;
    }
    return hasCollided;
  }

  collideParticle(otherParticle: Particle, elasticity: number = 1): boolean {
    if (elasticity < 0 || elasticity > 1) {
      throw new Error("Invalid elasticity value.");
    }

    const distance_vector: Vector2D = this.position.subtract(otherParticle.position);
    const distance: number = distance_vector.magnitude();

    if (distance === 0) {  // Handles particles in the same location (i.e. instantiated in the same position)
      let random_direction: Vector2D = new Vector2D(Math.random(), Math.random());
      random_direction = random_direction.normalize();
      const minimum_separation: number = (this.radius + otherParticle.radius) / 2;
      this.position = this.position.add(random_direction.scalarMultiply(minimum_separation));
      otherParticle.position = otherParticle.position.subtract(random_direction.scalarMultiply(minimum_separation));
      return false;
    }
    
    if (distance <= this.radius + otherParticle.radius) {
      // Positional correction using projection method
      // const penetration_normal: Vector2D = distance_vector.scalarMultiply((this.radius + otherParticle.radius - distance) / 2);
      // this.position = this.position.add(penetration_normal);
      // otherParticle.position = otherParticle.position.subtract(penetration_normal);

      // Velocity correction using impulse method
      const normal: Vector2D = distance_vector.normalize();  // n
      const relative_velocity: Vector2D = this.velocity.subtract(otherParticle.velocity);  // v_ab = v_a - v_b
      const normal_velocity: number = relative_velocity.dotProduct(normal);  // v_n = v_ab * n
      if (normal_velocity > 0) { 
        return false;
      }
      const impulse: number = 
        -(1 + elasticity) * normal_velocity 
        / ((1/this.mass)+(1/otherParticle.mass));
        // J = -(1+e)v_ab*n / (n*n*(1/m_a + 1/m_b)) where n*n = 1 since n is already a unit vector
      this.velocity = this.velocity.add(normal.scalarMultiply(impulse/this.mass));
      otherParticle.velocity = otherParticle.velocity.subtract(normal.scalarMultiply(impulse/otherParticle.mass));
      return true;
    }
    return false;
  }

  /**
   * "Moves" or changes the particle's kinematic properties given some time span
   * @param {number} dt The time change that the movement occurs, more accurate the smaller the value is
   * @param {number} t The total time elapsed, used for oscillation only (WIP)
   * @param {'euler' | 'rungekutta'} method The calculation used, euler by default
   */
  move(dt: number, t: number, method: 'euler' | 'rungekutta' = 'euler') {
    if (this.oscillation.x && this.oscillation.y) {
      const tangential_velocity = new Vector2D(this.oscillation.x * Math.cos(t), this.oscillation.y * Math.sin(t));
      this.position = this.position.add(tangential_velocity);
    }

    // dv/dt = g - (b/m)*v
    const gravity = simulation_settings.environment.acceleration;
    const dragOverMass = simulation_settings.environment.drag / this.mass;
    if (method === 'euler') {
      const drag_force = this.velocity.scalarMultiply(-dragOverMass)
      const new_acceleration = this.acceleration.add(gravity.add(drag_force));
      this.velocity = this.velocity.add(new_acceleration.scalarMultiply(dt));
      this.position = this.position.add(this.velocity.scalarMultiply(dt));
    }
    else if (method === 'rungekutta') {
      const new_acceleration = (vel: Vector2D) => gravity.add(vel.scalarMultiply(-dragOverMass))
      const k1_velocity = this.velocity;
      const k1_acceleration = new_acceleration(k1_velocity);
    
      const k2_velocity = this.velocity.add(k1_acceleration.scalarMultiply(0.5 * dt));
      const k2_acceleration = new_acceleration(k2_velocity);
    
      const k3_velocity = this.velocity.add(k2_acceleration.scalarMultiply(0.5 * dt));
      const k3_acceleration = new_acceleration(k3_velocity);
    
      const k4_velocity = this.velocity.add(k3_acceleration.scalarMultiply(dt));
      const k4_acceleration = new_acceleration(k4_velocity);
    
      this.velocity = this.velocity.add(
        k1_acceleration.add(k2_acceleration.scalarMultiply(2))
          .add(k3_acceleration.scalarMultiply(2))
          .add(k4_acceleration)
          .scalarMultiply(dt / 6)
      );
    
      this.position = this.position.add(
        k1_velocity.add(k2_velocity.scalarMultiply(2))
          .add(k3_velocity.scalarMultiply(2))
          .add(k4_velocity)
          .scalarMultiply(dt / 6)
      );
    }
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
      this.position = this.position.randomize_int(max);
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
      this.velocity = this.velocity.randomize_int(max);
    }
    else {
      this.velocity.x = a;
      this.velocity.y = b;
    }
  }

  /**
   * Sets a new acceleration in a 2D space for a particle
   * 
   * @param {number | 'random'} a Either the acceleration of the particle in the x-axis, or the setting for randomizing the particle acceleration
   * @param {number} b Either the acceleration of the particle in the y-axis, or the set range (-max to +max) that the particle acceleration can be randomized
   */
  setAcceleration(a: number | 'random' = 0, b: number = 0) {
    if (a === 'random') {
      let max = b === 0 ? 1 : b;
      this.acceleration = this.acceleration.randomize_float(max);
    }
    else {
      this.acceleration.x = a;
      this.acceleration.y = b;
    }
  }

    /**
   * Sets new oscillation amplitudes in a 2D space for a particle
   * 
   * @param {number | 'random'} a Either the amplitudes of the particle in the x-axis, or the setting for randomizing the oscillation amplitudes
   * @param {number} b Either the amplitudes of the particle in the y-axis, or the set range (-max to +max) that the particle position can be randomized
   * @param {'' | 'circular'} c Only used by the 'random' setting, constrains the randomized amplitudes to achieve circular motion
   */
  setOscillation(a: number | 'random' = 0, b: number = 0, c: '' | 'circular' = '') {
    if (a === 'random') {
      let max = b === 0 ? 1 : b;
      this.oscillation = this.oscillation.randomize_float(max);
      if (c === 'circular') {
        const common_amplitude = Math.random() * (2*max) - max;
        this.oscillation.x = common_amplitude;
        this.oscillation.y = common_amplitude;
      }
    }
    else {
      this.oscillation.x = a;
      this.oscillation.y = b;
    }
  }
}
