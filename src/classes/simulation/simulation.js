"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Simulation_container, _Simulation_environment, _Simulation_config, _Simulation_particle_groups, _Simulation_observers;
/**
 * Oversees most processes in the program.
 * Only one instance of Simulation should
 * exist at any time.
 * NOTE: consider writing as a singleton
 * in the future
 */
class Simulation {
    constructor(preset = {}) {
        _Simulation_container.set(this, void 0);
        _Simulation_environment.set(this, void 0);
        _Simulation_config.set(this, void 0);
        _Simulation_particle_groups.set(this, void 0);
        _Simulation_observers.set(this, void 0); // using a map with a set to avoid duplicate callbacks for an event type
        /*
        WARNING!
        Potential issue for the future, structuredClone flattens all
        class types in the SimPreset objects, such as values of
        type Vector2D. Currently, all Vector2D values that get flattened
        so far do not require the class methods, which is okay for now.
        Vector2D properies of particles stored in Simulation are thankfully
        still fully Vector2D's since they are instantiated afterward.
        */
        const preset_clone = structuredClone(preset);
        const default_clone = structuredClone(DEFAULT_PRESET);
        const final_preset = deepmerge(default_clone, preset_clone);
        __classPrivateFieldSet(this, _Simulation_container, final_preset.container, "f");
        __classPrivateFieldSet(this, _Simulation_environment, final_preset.environment, "f");
        __classPrivateFieldSet(this, _Simulation_config, final_preset.config, "f");
        __classPrivateFieldSet(this, _Simulation_particle_groups, new Map(Array.from(final_preset.particle_groups, ([group_id, group]) => [group_id, new ParticleGroup(group.grouping, group.size)])), "f");
        __classPrivateFieldSet(this, _Simulation_observers, new Map([
            ['update', new Set()],
            ['update_container', new Set()],
            ['update_environment', new Set()],
            ['update_config', new Set()],
            ['update_particle_groups', new Set()]
        ]), "f");
    }
    // Setters & Getters
    add_observer(event, callback) {
        __classPrivateFieldGet(this, _Simulation_observers, "f").get(event).add(callback);
    }
    remove_observer(event, callback) {
        __classPrivateFieldGet(this, _Simulation_observers, "f").get(event).delete(callback);
    }
    notify_observers(...events) {
        events.forEach(event => {
            __classPrivateFieldGet(this, _Simulation_observers, "f").get(event).forEach(callback => callback());
        });
    }
    addGroup(grouping) {
        // Assumes that string group_id has valid formatting: i.e. no spaces, alphanumeric.
        if (__classPrivateFieldGet(this, _Simulation_particle_groups, "f").has(grouping.group_id)) {
            throw new Error(`Group name: ${grouping.group_id} already exists.`);
        }
        __classPrivateFieldGet(this, _Simulation_particle_groups, "f").set(grouping.group_id, new ParticleGroup(grouping, 0));
        this.notify_observers('update', 'update_particle_groups');
    }
    setPreset(preset) {
        const current_properties = {
            container: __classPrivateFieldGet(this, _Simulation_container, "f"),
            environment: __classPrivateFieldGet(this, _Simulation_environment, "f"),
            config: __classPrivateFieldGet(this, _Simulation_config, "f")
        };
        const preset_clone = structuredClone(preset);
        if (preset.container) {
            __classPrivateFieldSet(this, _Simulation_container, deepmerge(current_properties.container, preset_clone.container), "f");
            this.notify_observers('update_container');
        }
        if (preset.environment) {
            __classPrivateFieldSet(this, _Simulation_environment, deepmerge(current_properties.environment, preset_clone.environment), "f");
            this.notify_observers('update_environment');
        }
        if (preset.config) {
            __classPrivateFieldSet(this, _Simulation_config, deepmerge(current_properties.config, preset_clone.config), "f");
            this.notify_observers('update_config');
        }
        if (preset.particle_groups) {
            __classPrivateFieldSet(this, _Simulation_particle_groups, new Map(Array.from(preset_clone.particle_groups, ([group_id, group]) => [group_id, new ParticleGroup(group.grouping, group.size)])), "f");
            this.notify_observers('update_particle_groups');
        }
        if (preset)
            this.notify_observers('update');
    }
    getContainer() {
        return __classPrivateFieldGet(this, _Simulation_container, "f");
    }
    getEnvironment() {
        return __classPrivateFieldGet(this, _Simulation_environment, "f");
    }
    getConfig() {
        return __classPrivateFieldGet(this, _Simulation_config, "f");
    }
    getParticleGroups() {
        return __classPrivateFieldGet(this, _Simulation_particle_groups, "f");
    }
    getAllParticles() {
        const particles = [];
        __classPrivateFieldGet(this, _Simulation_particle_groups, "f").forEach(group => {
            particles.push(...group.getParticles());
        });
        return particles;
    }
}
_Simulation_container = new WeakMap(), _Simulation_environment = new WeakMap(), _Simulation_config = new WeakMap(), _Simulation_particle_groups = new WeakMap(), _Simulation_observers = new WeakMap();
const DEFAULT_PRESET = {
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
};
// For testing Simulation class, will eventually save all presets in "simulation_presets.json"
const TEMPORARY_PRESETS = {
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
                        position: new Vector2D(-200, 200),
                        velocity: new Vector2D(200, -200),
                        mass: 4,
                        color: 'red',
                    },
                    size: 10
                }],
            ["Yellow", {
                    grouping: {
                        group_id: "Yellow",
                        radius: 15,
                        position: new Vector2D(-200, -200),
                        velocity: new Vector2D(200, 200),
                        mass: 2,
                        color: 'orange',
                    },
                    size: 10
                }],
            ["Blue", {
                    grouping: {
                        group_id: "Blue",
                        radius: 15,
                        position: new Vector2D(200, 200),
                        velocity: new Vector2D(-200, -200),
                        mass: 3,
                        color: 'blue',
                    },
                    size: 10
                }],
            ["Green", {
                    grouping: {
                        group_id: "Green",
                        radius: 15,
                        position: new Vector2D(200, -200),
                        velocity: new Vector2D(-200, 200),
                        mass: 1,
                        color: 'green',
                    },
                    size: 10
                }]
        ])
    }
};
