enum SimEvent {
  Update,
  Update_Container,
  Update_Environment,
  Update_Config,
  Overwrite_Particle_Groups,
  Edit_Particle_Groups
};

/**
 * Oversees most processes in the program.
 * Only one instance of Simulation should
 * exist at any time. 
 * NOTE: consider writing as a singleton
 * in the future
 */
class Simulation {
  #container: BoxSpace;
  #environment: SimEnvironment;
  #config: SimConfig;
  #particle_groups: Map<string, ParticleGroup>;
  #observers: Map<SimEvent, Set<() => void>>;  // using a map with a set to avoid duplicate callbacks for an event type

  constructor(preset: SimPreset = {}) {
    const preset_clone: SimPreset = structuredCloneCustom(preset);  
    const default_clone: SimPreset = structuredCloneCustom(DEFAULT_PRESET);
    const final_preset: SimPreset = deepmergeCustom(default_clone, preset_clone);
    this.#container = final_preset.container as BoxSpace;
    this.#environment = final_preset.environment as SimEnvironment;
    this.#config = final_preset.config as SimConfig;
    this.#particle_groups = new Map(Array.from(
      final_preset.particle_groups as Map<string, { grouping: ParticleGrouping, size: number}>, 
      ([group_id, group]) => [group_id, new ParticleGroup(group.grouping, group.size)]
    ));
    this.#observers = new Map();
    Object.keys(SimEvent).forEach((_, event) => {
      this.#observers.set(event, new Set());
    });
  }
  // Setters & Getters
  add_observer(event: SimEvent, callback: () => void): void {
    this.#observers.get(event)!.add(callback);
  }
  remove_observer(event: SimEvent, callback: () => void): void {
    this.#observers.get(event)!.delete(callback);
  }
  private notify_observers(...events: SimEvent[]): void {
    events.forEach(event => {
      this.#observers.get(event)!.forEach(callback => callback());
    });
  }
  addGroup(grouping: ParticleGrouping): void {  
    // Assumes that string group_id has valid formatting: i.e. no spaces, alphanumeric.
    if (this.#particle_groups.has(grouping.group_id)) {
      throw new Error(`Group name: ${grouping.group_id} already exists.`);
    }
    this.#particle_groups.set(grouping.group_id, new ParticleGroup(grouping, 0));
    this.notify_observers(SimEvent.Update, SimEvent.Edit_Particle_Groups);
  }
  setPreset(preset: SimPreset): void {  
    const current_properties: SimPreset = {
      container: this.#container,
      environment: this.#environment,
      config: this.#config
    }

    const preset_clone = structuredCloneCustom(preset);

    if (preset.container) {
      console.log('update_container');
      this.#container = deepmergeCustom(current_properties.container!, preset_clone.container!)
      this.notify_observers(SimEvent.Update_Container);
    }
    if (preset.environment) {
      console.log('update_environment');
      this.#environment = deepmergeCustom(current_properties.environment!, preset_clone.environment!)
      this.notify_observers(SimEvent.Update_Environment);
    }
    if (preset.config) {
      console.log('update_config');
      this.#config = deepmergeCustom(current_properties.config!, preset_clone.config!)
      this.notify_observers(SimEvent.Update_Config);
    }
    
    if (preset.particle_groups) {
      console.log('overwrite_particle_groups')
      this.#particle_groups = new Map(Array.from(
        preset_clone.particle_groups as Map<string, { grouping: ParticleGrouping, size: number}>, 
        ([group_id, group]) => [group_id, new ParticleGroup(group.grouping, group.size)]
      ));
      this.notify_observers(SimEvent.Overwrite_Particle_Groups);
    }

    if (preset) this.notify_observers(SimEvent.Update);
    console.log('update');
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
  getParticleGroups(): Map<string, ParticleGroup> {
    return this.#particle_groups;
  }
  getAllParticles(): Particle[] { 
    const particles: Particle[] = [];
    this.#particle_groups.forEach(group => {
      particles.push(...group.getParticles());
    });
    return particles;
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
    [DEFAULT_GROUPING.group_id, { grouping: DEFAULT_GROUPING, size: 0 }]
  ])
}

// For testing Simulation class, will eventually save all presets in "simulation_presets.json"
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
        size: 40
      }]
    ])
  },
  rybg: {
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
  }
}
