enum SimEvent {
  Update,
  Update_Container,
  Update_Environment,
  Update_Config
};

type SimEventPayloadMap = {
  [SimEvent.Update]: void | undefined;
  [SimEvent.Update_Container]: void | undefined;
  [SimEvent.Update_Environment]: void | undefined;
  [SimEvent.Update_Config]: void | undefined;
};

// Update SimEvent and #observers here to use the ObserverHandler class

/**
 * Oversees most processes in the program.
 * Only one instance of Simulation should
 * exist at any time. 
 */
class Simulation {
  #container: BoxSpace;
  #environment: SimEnvironment;
  #config: SimConfig;
  #particles_handler: ParticlesHandler;
  #observers: ObserverHandler<typeof SimEvent, SimEventPayloadMap>

  constructor(preset: SimPreset = {}) {
    const preset_clone: SimPreset = structuredCloneCustom(preset);  
    const default_clone: SimPreset = structuredCloneCustom(DEFAULT_PRESET);
    const final_preset: SimPreset = deepmergeCustom(default_clone, preset_clone);
    this.#container = final_preset.container as BoxSpace;
    this.#environment = final_preset.environment as SimEnvironment;
    this.#config = final_preset.config as SimConfig;
    this.#particles_handler = new ParticlesHandler(final_preset.particle_groups!, final_preset.container!);
    this.#observers = new ObserverHandler(SimEvent);

    this.setupParticleHandlerObservers(this.#particles_handler);
  }
  private setupParticleHandlerObservers(particles_handler: ParticlesHandler): void {
    const obs = particles_handler.getObservers();
  }

  setPreset(preset: SimPreset): void {  
    const current_properties: SimPreset = {
      container: this.#container,
      environment: this.#environment,
      config: this.#config
    }

    const preset_clone = structuredCloneCustom(preset);

    if (preset.container) {
      this.#container = deepmergeCustom(current_properties.container!, preset_clone.container!)
      this.#observers.notify(SimEvent.Update_Container, undefined);
    }
    if (preset.environment) {
      this.#environment = deepmergeCustom(current_properties.environment!, preset_clone.environment!)
      this.#observers.notify(SimEvent.Update_Environment, undefined);
    }
    if (preset.config) {
      this.#config = deepmergeCustom(current_properties.config!, preset_clone.config!)
      this.#observers.notify(SimEvent.Update_Config, undefined);
    }
    
    if (preset.particle_groups) {
      this.#particles_handler.overwriteGroups(preset.particle_groups);
    }

    if (preset) this.#observers.notify(SimEvent.Update, undefined);
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
  getParticlesHandler(): ParticlesHandler {
    return this.#particles_handler;
  }
  getObservers(): ObserverHandler<typeof SimEvent, SimEventPayloadMap> {
    return this.#observers;
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
      magnetic_field: 0
    },
    dynamics: {}
  },
  config: {
    path_trace_step: 0.5,
    is_draggable: false,
    focus_color: "yellow"
  },
  particle_groups: new Map([
    [DEFAULT_GROUPING.group_id, { grouping: DEFAULT_GROUPING, size: 0 }]
  ])
}

// For testing Simulation class, will eventually save all presets in "simulation_presets.json"
const TEMPORARY_PRESETS: Record<string, SimPreset> = {
  sandbox: {
    container: {
      x_min: -275,
      x_max: 275,
      y_min: -275,
      y_max: 275
    },
    environment: {
      statics: {
        elasticity: 1,
        drag: 0,
        gravity: new Vector2D(),
        electric_field: new Vector2D(),
        magnetic_field: 0
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
        size: 40
      }],
      ["Bob", { 
        grouping: {
          group_id: "Bob",
          radius: 15,
          mass: 10000,
          color: 'red',
        }, 
        size: 1 
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
        elasticity: 0.7
      }
    },
    config: {
      path_trace_step: 0.5,
      is_draggable: false,
      focus_color: "pink"
    },
    particle_groups: new Map([
      [DEFAULT_GROUPING.group_id, { 
        grouping: DEFAULT_GROUPING, 
        size: 0 
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
        size: 10 
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
        size: 10 
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
        size: 10
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
        size: 10
      }]
    ])
  },
  lavalamp: {
    container: {
      x_min: -100,
      x_max: 100,
      y_min: -280,
      y_max: 280
    },
    environment: {
      statics: {
        elasticity: 0.95,
        drag: 0,
        gravity: new Vector2D(),
        electric_field: new Vector2D(),
        magnetic_field: 0
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
          color: 'random',
        }, 
        size: 0
      }],
      ["Lava", { 
        grouping: {
          group_id: "Lava",
          radius: 10,
          position: 'random',
          velocity: 'random',
          mass: 5,
          color: 'orange',
        }, 
        size: 60 
      }],
      ["Rocks", {
        grouping: {
          group_id: "Rocks",
          radius: 15,
          position: 'random',
          velocity: new Vector2D(0, -250),
          mass: 10,
          color: 'black',
        },
        size: 15
      }]
    ])
  },
  colorstest: {
    particle_groups: new Map([
      [DEFAULT_GROUPING.group_id, { 
        grouping: {
          group_id: DEFAULT_GROUPING.group_id
        }, 
        size: 0
      }],
      ["black", { 
        grouping: {
          group_id: "black",
          radius: 20,
          position: new Vector2D(-230, 0),
          color: 'black',
        }, 
        size: 1 
      }],
      ["gray", { 
        grouping: {
          group_id: "gray",
          radius: 20,
          position: new Vector2D(-190, 0),
          color: 'gray',
        }, 
        size: 1 
      }],
      ["blue", { 
        grouping: {
          group_id: "blue",
          radius: 20,
          position: new Vector2D(-150, 0),
          color: 'blue',
        }, 
        size: 1 
      }],
      ["red", { 
        grouping: {
          group_id: "red",
          radius: 20,
          position: new Vector2D(-110, 0),
          color: 'red',
        }, 
        size: 1 
      }],
      ["pink", { 
        grouping: {
          group_id: "pink",
          radius: 20,
          position: new Vector2D(-70, 0),
          color: 'pink',
        }, 
        size: 1 
      }],
      ["green", { 
        grouping: {
          group_id: "green",
          radius: 20,
          position: new Vector2D(-30, 0),
          color: 'green',
        }, 
        size: 1 
      }],
      ["yellow", { 
        grouping: {
          group_id: "yellow",
          radius: 20,
          position: new Vector2D(10, 0),
          color: 'yellow',
        }, 
        size: 1 
      }],
      ["orange", { 
        grouping: {
          group_id: "orange",
          radius: 20,
          position: new Vector2D(50, 0),
          color: 'orange',
        }, 
        size: 1 
      }],
      ["violet", { 
        grouping: {
          group_id: "violet",
          radius: 20,
          position: new Vector2D(90, 0),
          color: 'violet',
        }, 
        size: 1 
      }],
      ["purple", { 
        grouping: {
          group_id: "purple",
          radius: 20,
          position: new Vector2D(130, 0),
          color: 'purple',
        }, 
        size: 1 
      }],
      ["brown", { 
        grouping: {
          group_id: "brown",
          radius: 20,
          position: new Vector2D(170, 0),
          color: 'brown',
        }, 
        size: 1 
      }]
    ])
  },
  vectorfieldstest: {
    container: {
      x_min: -250,
      x_max: 250,
      y_min: -250,
      y_max: 250
    },
    environment: {
      statics: {
        elasticity: 0.7,
        gravity: new Vector2D(100, 100),
        electric_field: new Vector2D(-100, 100),
        magnetic_field: -30
      }
    },
    particle_groups: new Map([
      [DEFAULT_GROUPING.group_id, { 
        grouping: {
          group_id: DEFAULT_GROUPING.group_id,
          radius: 15,
          position: 'random',
          velocity: 'random',
          mass: 'random',
          color: 'random',
        }, 
        size: 10
      }]
    ])
  }
}

const DEFAULT_BOUNDS: {  // Used to set a minimum and maximum for input elements
  key: string, 
  min: number | false | {x: number | false, y: number | false}, 
  max: number | false | {x: number | false, y: number | false} 
}[] = [
  { key: "radius", min: 1, max: 75 },
  { key: "position", min: {x: -1, y: -1}, max: {x: 1, y: 1} },
  { key: "mass", min: 1, max: false },
]