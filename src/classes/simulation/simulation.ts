/**
 * Oversees most processes in the program.
 * Only one instance of Simulation should
 * exist at any time.
 */
class Simulation {
  #container: BoxSpace;
  #environment: SimEnvironment;
  #config: SimConfig;
  #particle_groups: Map<string, ParticleGroup>;

  constructor(preset: SimPreset = {}) {
    /*
    WARNING!
    Potential issue for the future, structuredClone flattens all 
    class types in the SimPreset objects, such as values of
    type Vector2D. Currently, all Vector2D values that get flattened
    so far do not require the class methods, which is okay for now.
    Vector2D properies of particles stored in Simulation are thankfully
    still fully Vector2D's since they are instantiated afterward.
    */
    const preset_clone: SimPreset = structuredClone(preset);  
    const default_clone: SimPreset = structuredClone(DEFAULT_PRESET);
    const final_preset: SimPreset = deepmerge(default_clone, preset_clone);
    this.#container = final_preset.container as BoxSpace;
    this.#environment = final_preset.environment as SimEnvironment;
    this.#config = final_preset.config as SimConfig;
    this.#particle_groups = new Map(Array.from(
      final_preset.particle_groups as Map<string, { grouping: ParticleGrouping, size: number}>, 
      ([group_id, group]) => [group_id, new ParticleGroup(group.grouping, group.size)]
    ));
  }
  addGroup(grouping: ParticleGrouping): void {  
    // Assumes that string group_id has valid formatting: i.e. no spaces, alphanumeric.
    if (this.#particle_groups.has(grouping.group_id)) {
      throw new Error(`Group name: ${grouping.group_id} already exists.`);
    }
    this.#particle_groups.set(grouping.group_id, new ParticleGroup(grouping, 0));
  }

  // Setters & Getters
  setPreset(preset: SimPreset): void {  
    const current_properties: SimPreset = {
      container: this.#container,
      environment: this.#environment,
      config: this.#config
    }
    const preset_clone: SimPreset = structuredClone(preset);
    const updated_properties = deepmerge(current_properties, preset_clone);
    this.#container = updated_properties.container as BoxSpace;
    this.#environment = updated_properties.environment as SimEnvironment;
    this.#config = updated_properties.config as SimConfig;

    if (preset_clone.particle_groups) {
      this.#particle_groups = new Map(Array.from(
        updated_properties.particle_groups as Map<string, { grouping: ParticleGrouping, size: number}>, 
        ([group_id, group]) => [group_id, new ParticleGroup(group.grouping, group.size)]
      ));
    }
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

/**
 * Performs a deep merge onto a target object,
 * can accept multiple sources, which are 
 * processed recursively.
 * From Stack Overflow:
 * https://stackoverflow.com/a/34749873 
 * @param {T} target Target object
 * @param {Partial<T>[]} sources Objects to merge into target
 */
function deepmerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();
  if (source && isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isMap(source[key])) {
        if (!isMap(target[key])) target[key] = new Map() as any;
        (source[key] as Map<any, any>).forEach((mapValue, mapKey) => {
          (target[key] as Map<any, any>).set(mapKey, mapValue);
        });
      }
      // else if ((source as any)[key] instanceof Vector2D) {
      //   // Ensure the Vector2D object remains a proper instance
      //   console.log("found a Vector2D");
      //   target[key] = new Vector2D(source[key].x, source[key].y) as any;
      // }
      else if (isObject(source[key])) {
        if (!isObject(target[key])) target[key] = {} as any;
        deepmerge(target[key], source[key] as any);
      } else {
        target[key] = source[key] as any;
      }
    }
  }

  return deepmerge(target, ...sources);
}
/**
 * Checks if a value is a defined object and not an array.
 */
function isObject(item: unknown): item is Record<string, any> {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}
/**
 * Type guard to check if a value is a Map.
 */
function isMap(item: unknown): item is Map<any, any> {
  return item instanceof Map;
}
