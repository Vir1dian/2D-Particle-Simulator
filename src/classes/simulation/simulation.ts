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

  constructor(preset: SimPreset = DEFAULT_PRESET) {
    const default_clone: SimPreset = structuredClone(DEFAULT_PRESET);
    if (preset === DEFAULT_PRESET) {
      this.#container = default_clone.container as BoxSpace;
      this.#environment = default_clone.environment as SimEnvironment;
      this.#config = default_clone.config as SimConfig;
      this.#particle_groups = default_clone.particle_groups as Map<string, { grouping: ParticleGrouping, particles: Particle[]}>;
    }
    else {
      let preset_clone: SimPreset = structuredClone(preset);
      this.#container = preset_clone.container ?? default_clone.container as BoxSpace;
      this.#environment = preset_clone.environment ?? default_clone.environment as SimEnvironment;
      this.#config = preset_clone.config ?? default_clone.config as SimConfig;
      this.#particle_groups = preset_clone.particle_groups ?? default_clone.particle_groups as Map<string, { grouping: ParticleGrouping, particles: Particle[]}>;
    }
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

  setPreset(preset: SimPreset): void {
    const preset_clone: SimPreset = structuredClone(preset);
    if (preset_clone.container) {
      this.#container = preset_clone.container;
    }
    if (preset_clone.environment) {
      this.#environment = preset_clone.environment;
    }
    if (preset_clone.config) {
      this.#config = preset_clone.config;
    }
    if (preset_clone.particle_groups) {
      this.#particle_groups = preset_clone.particle_groups;
    }
  }

  // Basic Setters & Getters
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
  container?: BoxSpace;
  environment?: SimEnvironment;
  config?: SimConfig;
  particle_groups?: Map<string, { grouping: ParticleGrouping, particles: Particle[]}>;
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
      ["Red", { 
        grouping: {
          group_id: "Red",
          radius: 15,
          position: new Vector2D(-200,200),
          velocity: new Vector2D(200,-200),
          mass: 4,
          color: 'red',
        }, 
        particles: Particle.createBatch(
          {
            group_id: "Red",
            radius: 15,
            position: new Vector2D(-200,200),
            velocity: new Vector2D(200,-200),
            mass: 4,
            color: 'red',
          },
          10
        ) 
      }],
      ["Yellow", { 
        grouping: {
          group_id: "Yellow",
          radius: 15,
          position: new Vector2D(-200,-200),
          velocity: new Vector2D(200,200),
          mass: 2,
          color: 'orange',
        }, 
        particles: Particle.createBatch(
          {
            group_id: "Yellow",
            radius: 15,
            position: new Vector2D(-200,-200),
            velocity: new Vector2D(200,200),
            mass: 2,
            color: 'orange',
          },
          10
        ) 
      }],
      ["Blue", { 
        grouping: {
          group_id: "Blue",
          radius: 15,
          position: new Vector2D(200,200),
          velocity: new Vector2D(-200,-200),
          mass: 3,
          color: 'blue',
        }, 
        particles: Particle.createBatch(
          {
            group_id: "Blue",
            radius: 15,
            position: new Vector2D(200,200),
            velocity: new Vector2D(-200,-200),
            mass: 3,
            color: 'blue',
          },
          10
        ) 
      }],
      ["Green", { 
        grouping: {
          group_id: "Green",
          radius: 15,
          position: new Vector2D(200,-200),
          velocity: new Vector2D(-200,200),
          mass: 1,
          color: 'green',
        }, 
        particles: Particle.createBatch(
          {
            group_id: "Green",
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