enum SimEvent {
  Update,
  Update_Container,
  Update_Environment,
  Update_Config,
  Update_Particle_Groups,
  Update_Particle
};

type SimEventPayload = {
  operation: "add" | "edit" | "delete" | "overwrite",
  data?: string | Particle | ParticleGroup;
}

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
  #observers: Map<SimEvent, Set<(payload?: SimEventPayload) => void>>;  // using a map with a set to avoid duplicate callbacks for an event type

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
  add_observer(event: SimEvent, callback: (payload?: SimEventPayload) => void): void {
    this.#observers.get(event)!.add(callback);
  }
  remove_observer(event: SimEvent, callback: (payload?: SimEventPayload) => void): void {
    this.#observers.get(event)!.delete(callback);
  }
  private notify_observers(...events: { type: SimEvent; payload?: SimEventPayload }[]): void {
    events.forEach(({ type, payload }) => {
      this.#observers.get(type)!.forEach(callback => callback(payload));
    });
  }
  addGroup(grouping: ParticleGrouping): void {  
    // Assumes that string group_id has valid formatting: i.e. no spaces, alphanumeric.
    if (this.#particle_groups.has(grouping.group_id)) {
      throw new Error(`Group name: ${grouping.group_id} already exists.`);
    }
    const group = new ParticleGroup(grouping, 0);
    this.#particle_groups.set(grouping.group_id, group);
    this.notify_observers(
      { type: SimEvent.Update }, 
      { type: SimEvent.Update_Particle_Groups, payload: { operation: "add", data: group }}
    );
  }
  editGroup(group_id: string, grouping: ParticleGrouping): void {
    const group = this.#particle_groups.get(group_id);
    if (!group) throw new Error(`Group name: ${group_id} not found`);
    group.setGrouping(grouping);
    this.notify_observers(
      { type: SimEvent.Update }, 
      { type: SimEvent.Update_Particle_Groups, payload: { operation: "edit", data: group }}
    );
  }
  deleteGroup(group_id: string): void {
    const group = this.#particle_groups.get(group_id);
    if (group) group.getParticles().length = 0;
    this.#particle_groups.delete(group_id);
    this.notify_observers(
      { type: SimEvent.Update }, 
      { type: SimEvent.Update_Particle_Groups, payload: { operation: "delete", data: group_id }}
    );
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
      this.notify_observers({ type: SimEvent.Update_Container });
    }
    if (preset.environment) {
      console.log('update_environment');
      this.#environment = deepmergeCustom(current_properties.environment!, preset_clone.environment!)
      this.notify_observers({ type: SimEvent.Update_Environment });
    }
    if (preset.config) {
      console.log('update_config');
      this.#config = deepmergeCustom(current_properties.config!, preset_clone.config!)
      this.notify_observers({ type: SimEvent.Update_Config });
    }
    
    if (preset.particle_groups) {
      console.log('update_particle_groups')
      this.#particle_groups = new Map(Array.from(
        preset_clone.particle_groups as Map<string, { grouping: ParticleGrouping, size: number}>, 
        ([group_id, group]) => [group_id, new ParticleGroup(group.grouping, group.size)]
      ));
      this.notify_observers({ type: SimEvent.Update_Particle_Groups, payload: { operation: "overwrite" } });
    }

    if (preset) this.notify_observers({ type: SimEvent.Update });
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

const DEFAULT_BOUNDS: {  // Used to set a minimum and maximum for input elements
  key: string, 
  min: number | false | {x: number | false, y: number | false}, 
  max: number | false | {x: number | false, y: number | false} 
}[] = [
  { key: "radius", min: 1, max: 75 },
  { key: "position", min: {x: -1, y: -1}, max: {x: 1, y: 1} },
  { key: "mass", min: 1, max: false },
]