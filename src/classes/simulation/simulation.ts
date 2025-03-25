interface SimEnvironment {
  statics: {
    elasticity: number,
    drag: number,
    gravity: Vector2D,
    electric_field: Vector2D,
    magnetic_field: Vector2D
  }
  dynamics: {
    // for the future
  }
}

interface SimConfig {
  trajectory_step: number,
  is_draggable: boolean,
  focus_color: string
}

interface ParticleGrouping {  // To be moved to particle.ts
  group_id: string,
  mass?: number | 'random',
  radius?: number | 'random',
  position?: Vector2D | 'random',
  velocity?: Vector2D | 'random',
  color?: string | 'random',
  trajectory?: boolean
}

class Simulation {
  #container: BoxSpace;
  #environment: SimEnvironment;
  #config: SimConfig;
  #particle_groups: Map<ParticleGrouping, Particle[]>;

  // No default variables, only one Simulation instance exists upon loading the website (unless I implement rigid exhibits/displays in the future)
  constructor(
    container: BoxSpace = sim_defaults.box, 
    environment: SimEnvironment = sim_defaults.environment, 
    config: SimConfig = sim_defaults.config
  ) {  
    this.#container = container;
    this.#environment = environment;
    this.#config = config;
    this.#particle_groups = new Map([
      [{group_id: "Ungrouped"}, []]
    ]);
    // particle_groups are populated after instantiation
  }
  addGroup(grouping: ParticleGrouping) {
    this.#particle_groups.set(
      grouping, []
    )
  }
  addParticle(particle: Particle, group_id: string) {
    const group: ParticleGrouping = getGroupById(group_id);  // To be implemented
    this.#particle_groups.get(group)?.push(particle);
  }

  // Setters & Getters
  setContainer(container: BoxSpace) {
    this.#container = container;
  }
  setEnvironment(environment: SimEnvironment) {
    this.#environment = environment;
  }
  setConfig(config: SimConfig) {
    this.#config = config;
  }
  getContainer(): BoxSpace {
    return this.#container;
  }
  getEnvironment(): SimEnvironment {
    return this.#environment;
  }
  getConfig(): SimConfig {
    return this.#config;
  }
  getParticles(): Map<ParticleGrouping, Particle[]> {
    return this.#particle_groups;
  }
}

const sim_defaults = {
  box: {
    x_min: -250,
    x_max: 250,
    y_min: -250,
    y_max: 250
  },
  environment: {
    statics: {
      elasticity: 1,
      drag: 0,
      gravity: new Vector2D(),
      electric_field: new Vector2D(),
      magnetic_field: new Vector2D()
    },
    dynamics: {}
  },
  config: {
    trajectory_step: 0.5,
    is_draggable: false,
    focus_color: "yellow"
  }
}

// For testing Simulation class, will eventually save all presets in "simulation_presets.json"
const temporary_presets = {

}