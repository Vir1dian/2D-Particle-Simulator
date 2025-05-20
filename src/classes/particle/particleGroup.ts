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

enum ParticleGroupEvent {
  Update,
  Edit,
  Add_Particle,
  Delete_Particle,
  Overwrite_Particles
};

type ParticleGroupEventPayloadMap = {
  [ParticleGroupEvent.Update]: void | undefined;
  [ParticleGroupEvent.Edit]: { change_flags: { [K in keyof ParticleGrouping]: boolean } };
  [ParticleGroupEvent.Add_Particle]: { particle: Particle };
  [ParticleGroupEvent.Delete_Particle]: { particle: Particle };
  [ParticleGroupEvent.Overwrite_Particles]: void | undefined;
};

/**
 * Handles a group of Particles with
 * enforced common properties described
 * by a ParticleGrouping object
 */
class ParticleGroup {
  #grouping: ParticleGrouping;
  #particles: Map<number, Particle>;
  #observers: ObserverHandler<typeof ParticleGroupEvent, ParticleGroupEventPayloadMap>;

  constructor(grouping: ParticleGrouping = DEFAULT_GROUPING, container: BoxSpace, size: number = 0) {
    this.#grouping = structuredCloneCustom(grouping);
    this.#particles = new Map();
    for (let i = 0; i < size; i++) {
      const p: Particle = new Particle(container, grouping);
      this.#particles.set(p.getID(), p);
    }
    this.#observers = new ObserverHandler(ParticleGroupEvent);
  }

  isValidFor(particle: Particle): boolean {
    const grouping = (({group_id, enable_path_tracing, ...exposed_properties}) => exposed_properties)(this.#grouping);
    if (grouping === DEFAULT_GROUPING) return true;
    return (Object.keys(grouping) as (keyof ParticleGrouping)[]).every(property => {
      const grouping_value = this.#grouping[property];
      const particle_value = (particle as any)[property];
  
      return (grouping_value === 'random' 
        || grouping_value === undefined 
        || grouping_value === particle_value
        || (
          isVectorLike(grouping_value) 
          && isVectorLike(particle_value) 
          && grouping_value.equals(particle_value)
        )
      );
    });
  }

  getGrouping(): ParticleGrouping {
    return this.#grouping;
  }

  getParticles(): Map<number, Particle> {
    return this.#particles;
  }

  getObservers(): ObserverHandler<typeof ParticleGroupEvent, ParticleGroupEventPayloadMap> {
    return this.#observers;
  }

  addParticle(particle: Particle): void {
    if (this.isValidFor(particle)) this.#particles.set(particle.getID(), particle);
    else throw new Error("Particle does not fit grouping.");
    this.#observers.notify(ParticleGroupEvent.Update, undefined);
    this.#observers.notify(ParticleGroupEvent.Add_Particle, { particle: particle });
  }

  removeParticle(particle: Particle): void {
    if (!this.#particles.delete(particle.getID()))
      throw new Error("Particle not found");
    this.#observers.notify(ParticleGroupEvent.Update, undefined);
    this.#observers.notify(ParticleGroupEvent.Delete_Particle, { particle: particle });
    particle.clear();
  }

  // overwrite(grouping: ParticleGrouping, size: number): void {}

  edit(grouping: ParticleGrouping): void {
    const change_flags = createKeyFlags(DEFAULT_GROUPING);
    (Object.keys(change_flags) as (keyof ParticleGrouping)[]).forEach(property => {
      const new_value = grouping[property];
      const current_value = this.#grouping[property];
      if (isVectorLike(new_value) && isVectorLike(current_value)) {
        if (new_value.x !== current_value.x || new_value.y !== current_value.y) {
          (this.#grouping[property] as Vector2D) = new_value.clone();
          change_flags[property] = true;
        }
      }
      else if (new_value !== current_value) {
        (this.#grouping[property] as string | number | boolean | Vector2D | undefined) = new_value;
        change_flags[property] = true;
      }
    });

    // may have to improve this
    this.#particles.forEach(particle => {
      const change_flags = createKeyFlags(particle);
      (Object.keys(grouping) as (keyof ParticleGrouping)[]).forEach(property => {
        const new_value = grouping[property];
        const current_value = (particle as any)[property];
        if (new_value !== 'random' && new_value !== undefined && new_value !== current_value) {
          if (isVectorLike(new_value) && (new_value.x !== current_value.x || new_value.y !== current_value.y)) 
            (particle as any)[property] = new_value.clone();
          else (particle as any)[property] = new_value;
          change_flags[property as keyof Particle] = true;
        }
      });
      particle.getObservers().notify(ParticleEvent.Edit, { change_flags: change_flags });
    });
    this.#observers.notify(ParticleGroupEvent.Update, undefined);
    this.#observers.notify(ParticleGroupEvent.Edit, { change_flags: change_flags });
  }

  clear(): void {
    for (const [id, particle] of this.#particles)
      particle.clear();
    this.#particles.clear();
    this.#observers.clearAll();
  }
}