interface ParticleGrouping {
  group_id: string,
  radius?: number | 'random',
  position?: Vector2D | 'random',
  velocity?: Vector2D | 'random',
  mass?: number | 'random',
  charge?: number | 'random',
  color?: string | 'random',
  enable_path_tracing?: boolean
}

const DEFAULT_GROUPING: ParticleGrouping = {
  group_id: "Ungrouped",
  radius: 5,
  position: new Vector2D(),
  velocity: new Vector2D(),
  mass: 1,
  charge: 0,
  color: "black",
  enable_path_tracing: false
}

/**
 * Handles a group of Particles with
 * enforced common properties described
 * by a ParticleGrouping object
 */
class ParticleGroup {
  #grouping: ParticleGrouping;
  #particles: Particle[];

  constructor(grouping: ParticleGrouping = DEFAULT_GROUPING, size: number = 0) {
    this.#grouping = grouping;
    this.#particles = [];
    for (let i = 0; i < size; i++) {
      const p: Particle = new Particle(grouping);
      this.#particles.push(p);
    }
  }

  isValidFor(particle: Particle): boolean {
    return (Object.keys(this.#grouping) as (keyof ParticleGrouping)[]).every(property => {
      const grouping_value = this.#grouping[property];
      const particle_value = (particle as any)[property];
  
      return grouping_value === 'random' || grouping_value === undefined || grouping_value === particle_value;
    });
  }

  addParticle(particle: Particle): void {
    if (this.isValidFor(particle)) this.#particles.push(particle);
    else throw new Error("Particle does not fit grouping.");
  }

  removeParticle(index: number): void {
    if (index >= 0 && index < this.#particles.length) {
      this.#particles.splice(index, 1);
    }
  }

  clone(): ParticleGroup {
    return new ParticleGroup(this.#grouping, this.#particles.length);
  }

  getGrouping(): ParticleGrouping {
    return this.#grouping;
  }

  getParticles(): Particle[] {
    return this.#particles;
  }
}