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
  Delete,
  Add_Particle,
  Delete_Particle,
  Overwrite_Particles
};

type ParticleGroupEventPayload<T extends ParticleGroupEvent> = {
  [ParticleGroupEvent.Update]: void | undefined;
  [ParticleGroupEvent.Edit]: { changes_log: { [K in keyof ParticleGrouping]: boolean } };
  [ParticleGroupEvent.Delete]: void | undefined;
  [ParticleGroupEvent.Add_Particle]: { data: Particle };
  [ParticleGroupEvent.Delete_Particle]: { id: number };
  [ParticleGroupEvent.Overwrite_Particles]: void | undefined;
}[T];

/**
 * Handles a group of Particles with
 * enforced common properties described
 * by a ParticleGrouping object
 */
class ParticleGroup {
  #grouping: ParticleGrouping;
  #particles: Map<string, Particle>;
  #observers: {
    [E in ParticleGroupEvent]?: Set<(payload: ParticleGroupEventPayload<E>) => void>
  };

  constructor(grouping: ParticleGrouping = DEFAULT_GROUPING, size: number = 0) {
    this.#grouping = structuredCloneCustom(grouping);
    this.#particles = [];
    for (let i = 0; i < size; i++) {
      const p: Particle = new Particle(grouping);
      this.#particles.push(p);
    }
    this.#observers = createObserverMap(ParticleGroupEvent);
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

  addParticle(particle: Particle): void {
    if (this.isValidFor(particle)) this.#particles.push(particle);
    else throw new Error("Particle does not fit grouping.");
  }

  removeParticle(particle: Particle): void {
    const index = this.#particles.findIndex(p => p === particle);
    if (index >= 0 && index < this.#particles.length) 
      this.#particles.splice(index, 1);
    else 
      throw new Error("Invalid particle.");
  }

  clone(): ParticleGroup {
    return new ParticleGroup(structuredCloneCustom(this.#grouping), this.#particles.length);
  }

  getGrouping(): ParticleGrouping {
    return this.#grouping;
  }

  getParticles(): Particle[] {
    return this.#particles;
  }

  setGrouping(grouping: ParticleGrouping): { [K in keyof ParticleGrouping]: boolean } {
    const changes = createBooleanKeyStates(DEFAULT_GROUPING);
    (Object.keys(changes) as (keyof ParticleGrouping)[]).forEach(property => {
      const new_value = grouping[property];
      const current_value = this.#grouping[property];
      if (isVectorLike(new_value) && isVectorLike(current_value)) {
        if (new_value.x !== current_value.x || new_value.y !== current_value.y) {
          (this.#grouping[property] as Vector2D) = new_value.clone();
          changes[property] = true;
        }
      }
      else if (new_value !== current_value) {
        (this.#grouping[property] as string | number | boolean | Vector2D | undefined) = new_value;
        changes[property] = true;
      }
    });

    // may have to improve this
    this.#particles.forEach(particle => {
      (Object.keys(grouping) as (keyof ParticleGrouping)[]).forEach(property => {
        const new_value = grouping[property];
        const current_value = (particle as any)[property];
        if (new_value !== 'random' && new_value !== undefined && new_value !== current_value) {
          if (isVectorLike(new_value) && (new_value.x !== current_value.x || new_value.y !== current_value.y))
            (particle as any)[property] = new_value.clone();
          else (particle as any)[property] = new_value;
        }
      });
    });

    return changes;
  }
}