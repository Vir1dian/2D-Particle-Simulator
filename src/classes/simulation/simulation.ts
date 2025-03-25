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
  path_trace_step: number,
  is_draggable: boolean,
  focus_color: string
}

class Simulation {
  #container: BoxSpace;
  #environment: SimEnvironment;
  #config: SimConfig;
  #particle_groups: Map<string, { grouping: ParticleGrouping, particles: Particle[]}>;

  constructor(
    container: BoxSpace = DEFAULT_PRESET.container, 
    environment: SimEnvironment = DEFAULT_PRESET.environment, 
    config: SimConfig = DEFAULT_PRESET.config
  ) {  
    this.#container = container;
    this.#environment = environment;
    this.#config = config;
    this.#particle_groups = DEFAULT_PRESET.particle_groups;
    // particle_groups is populated after instantiation
  }
  addGroup(grouping: ParticleGrouping): void {  
    // Assumes that group_id has valid formatting: i.e. no spaces, hash symbols, etc.
    if (this.#particle_groups.has(grouping.group_id)) throw new Error("Group name already exists.");
    this.#particle_groups.set(grouping.group_id, { grouping, particles: [] });
  }
  addParticle(particle: Particle, group_id: string = DEFAULT_GROUPING.group_id): void {
    // Assumes that the particle already fits the grouping
    const group = this.#particle_groups.get(group_id);
    if (!group) throw new Error("Group name does not exist.");
    group.particles.push(particle);
  }

  // Setters & Getters
  setContainer(container: BoxSpace): void {
    this.#container = container;
  }
  setEnvironment(environment: SimEnvironment): void {
    this.#environment = environment;
  }
  setConfig(config: SimConfig): void {
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
  getParticles(): Map<string, { grouping: ParticleGrouping, particles: Particle[]}> {
    return this.#particle_groups;
  }
}

const DEFAULT_PRESET: SimPreset = {
  container: {
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
    path_trace_step: 0.5,
    is_draggable: false,
    focus_color: "yellow"
  },
  particle_groups: new Map([
    [DEFAULT_GROUPING.group_id, { grouping: DEFAULT_GROUPING, particles: [] }]
  ])
}

// For testing Simulation class, will eventually save all presets in "simulation_presets.json"
interface SimPreset {
  container: BoxSpace;
  environment: SimEnvironment;
  config: SimConfig;
  particle_groups: Map<string, { grouping: ParticleGrouping, particles: Particle[]}>;
}

const TEMPORARY_PRESETS: Record<string, SimPreset> = {
  sandbox: {
    container: {
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
      path_trace_step: 0.5,
      is_draggable: false,
      focus_color: "yellow"
    },
    particle_groups: new Map([
      [DEFAULT_GROUPING.group_id, { 
        grouping: {
          group_id: DEFAULT_GROUPING.group_id,
          position: 'random',
          velocity: 'random',
          mass: 'random',
          color: 'random',
        }, 
        particles: Particle.createBatch(
          {
            group_id: DEFAULT_GROUPING.group_id,
            position: 'random',
            velocity: 'random',
            mass: 'random',
            color: 'random',
          },
          40
        )
      }]
    ])
  },
  rybg: {
    container: {
      x_min: -250,
      x_max: 250,
      y_min: -250,
      y_max: 250
    },
    environment: {
      statics: {
        elasticity: 0.7,
        drag: 0,
        gravity: new Vector2D(),
        electric_field: new Vector2D(),
        magnetic_field: new Vector2D()
      },
      dynamics: {}
    },
    config: {
      path_trace_step: 0.5,
      is_draggable: false,
      focus_color: "yellow"
    },
    particle_groups: new Map([
      [DEFAULT_GROUPING.group_id, { 
        grouping: DEFAULT_GROUPING, 
        particles: [] 
      }],
      ["red", { 
        grouping: {
          group_id: "red",
          radius: 15,
          position: new Vector2D(-200,200),
          velocity: new Vector2D(200,-200),
          mass: 4,
          color: 'red',
        }, 
        particles: Particle.createBatch(
          {
            group_id: "red",
            radius: 15,
            position: new Vector2D(-200,200),
            velocity: new Vector2D(200,-200),
            mass: 4,
            color: 'red',
          },
          10
        ) 
      }],
      ["yellow", { 
        grouping: {
          group_id: "yellow",
          radius: 15,
          position: new Vector2D(-200,-200),
          velocity: new Vector2D(200,200),
          mass: 2,
          color: 'orange',
        }, 
        particles: Particle.createBatch(
          {
            group_id: "yellow",
            radius: 15,
            position: new Vector2D(-200,-200),
            velocity: new Vector2D(200,200),
            mass: 2,
            color: 'orange',
          },
          10
        ) 
      }],
      ["blue", { 
        grouping: {
          group_id: "blue",
          radius: 15,
          position: new Vector2D(200,200),
          velocity: new Vector2D(-200,-200),
          mass: 3,
          color: 'blue',
        }, 
        particles: Particle.createBatch(
          {
            group_id: "blue",
            radius: 15,
            position: new Vector2D(200,200),
            velocity: new Vector2D(-200,-200),
            mass: 3,
            color: 'blue',
          },
          10
        ) 
      }],
      ["green", { 
        grouping: {
          group_id: "green",
          radius: 15,
          position: new Vector2D(200,-200),
          velocity: new Vector2D(-200,200),
          mass: 1,
          color: 'green',
        }, 
        particles: Particle.createBatch(
          {
            group_id: "green",
            radius: 15,
            position: new Vector2D(200,-200),
            velocity: new Vector2D(-200,200),
            mass: 1,
            color: 'green',
          },
          10
        ) 
      }]
    ])
  }
}