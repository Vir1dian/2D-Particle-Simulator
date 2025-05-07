const PARTICLE_COLORS: string[] = ['black', 'gray', 'blue', 'red', 'pink', 'green', 'yellow', 'orange', 'violet', 'purple', 'brown'];

enum ParticleEvent {
  Update,
  Edit,
  Move
};

type ParticleEventPayloadMap = {
  [ParticleEvent.Update]: void | undefined;
  [ParticleEvent.Edit]: { change_flags: { [K in keyof Particle]: boolean } };
  [ParticleEvent.Move]: void | undefined;
};

class Particle {
  static #instance_count = 0;

  #observers: ObserverHandler<typeof ParticleEvent, ParticleEventPayloadMap>;

  readonly #id: number;
  #group_id: string;
  radius: number;
  position: Vector2D;
  velocity: Vector2D;
  mass: number;
  charge: number;
  color: string;
  enable_path_tracing: boolean;  // will be strictly limited to certain simulation presets only, the user should not ever be able access this property

  constructor(grouping: ParticleGrouping = DEFAULT_GROUPING) {

    this.#observers = new ObserverHandler(ParticleEvent);

    this.#id = ++Particle.#instance_count;
    this.#group_id = grouping.group_id;
    this.radius = this.resolveValue(grouping.radius, DEFAULT_GROUPING.radius as number, () => Math.floor(Math.random() * (20 - 5 + 1) + 5));
    this.position = this.resolveVector(grouping.position, DEFAULT_GROUPING.position as Vector2D, 250 - this.radius);
    this.velocity = this.resolveVector(grouping.velocity, DEFAULT_GROUPING.velocity as Vector2D);
    this.mass = this.resolveValue(grouping.mass, DEFAULT_GROUPING.mass as number, () => Math.floor(Math.random() * (10 - 1 + 1) + 1));
    this.charge = this.resolveValue(grouping.charge, DEFAULT_GROUPING.charge as number, () => Math.floor(Math.random() * (10 - 1 + 1) + 1));
    this.color = this.resolveColor(grouping.color);
    this.enable_path_tracing = grouping.enable_path_tracing ?? DEFAULT_GROUPING.enable_path_tracing as boolean;
  }

  private resolveValue<T>(value: T | 'random' | undefined, default_value: T, randomizer: () => T): T {
    if (!value) return default_value;
    if (value === 'random') return randomizer();
    return value;
  }
  private resolveVector(vector: Vector2D | 'random' | undefined, default_vector: Vector2D, rand_range = 100): Vector2D {
    if (!vector) return default_vector.clone();
    if (vector === 'random') return Vector2D.randomize_int(rand_range);
    return vector.clone();
  }
  private resolveColor(color: string | 'random' | undefined): string {
    if (!color) return DEFAULT_GROUPING.color as string;
    if (color === 'random') return PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    if (!PARTICLE_COLORS.includes(color)) return "black";
    return color;
  }

  getObservers(): ObserverHandler<typeof ParticleEvent, ParticleEventPayloadMap> {
    return this.#observers;
  }
  getID(): number {
    return this.#id;
  }
  getGroupID(): string {
    return this.#group_id;
  }

  edit(changes: Record<string, keyof Particle>): void {
    const change_flags = createKeyFlags(this);
    (Object.keys(change_flags) as (keyof Particle)[]).forEach(property => {
      const new_value = changes[property];
      const current_value = this[property];
      if (isVectorLike(new_value) && isVectorLike(current_value)) {
        if (new_value.x !== current_value.x || new_value.y !== current_value.y) {
          (this[property] as Vector2D) = new Vector2D(new_value.x, new_value.y);
          change_flags[property] = true;
        }
      }
      else if (new_value !== current_value) {
        (this[property] as string | number | boolean | Vector2D | undefined) = new_value;
        change_flags[property] = true;
      }
    });

    // hard coded to disable path tracing unless specified in the preset
    this['enable_path_tracing'] = false;
    change_flags['enable_path_tracing'] = false;

    this.#observers.notify(ParticleEvent.Update, undefined);
    this.#observers.notify(ParticleEvent.Edit, { change_flags: change_flags });
  }

  clear(): void {
    this.#observers.clearAll();
  }

  // Behavior (Called repeatedly by animation.js)
  collideContainer(container: BoxSpace): boolean {
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
  move(environment: SimEnvironment, dt: number, t: number, method: 'euler' | 'rungekutta' = 'euler') {
    // dv/dt = g - (b/m)*v
    const gravity = environment.statics!.gravity!; 
    const dragOverMass = environment.statics!.drag! / this.mass;
    if (method === 'euler') {
      const drag_force = this.velocity.scalarMultiply(-dragOverMass)
      const new_acceleration = gravity.add(drag_force);
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
    this.#observers.notify(ParticleEvent.Update, undefined);
    this.#observers.notify(ParticleEvent.Move, undefined);
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
      this.position = Vector2D.randomize_int(max);
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
      this.velocity = Vector2D.randomize_int(max);
    }
    else {
      this.velocity.x = a;
      this.velocity.y = b;
    }
  }
}

