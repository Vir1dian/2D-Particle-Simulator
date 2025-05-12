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
var _Simulation_container, _Simulation_environment, _Simulation_config, _Simulation_particles_handler, _Simulation_observers;
var SimEvent;
(function (SimEvent) {
    SimEvent[SimEvent["Update"] = 0] = "Update";
    SimEvent[SimEvent["Update_Container"] = 1] = "Update_Container";
    SimEvent[SimEvent["Update_Environment"] = 2] = "Update_Environment";
    SimEvent[SimEvent["Update_Config"] = 3] = "Update_Config";
})(SimEvent || (SimEvent = {}));
;
// Update SimEvent and #observers here to use the ObserverHandler class
/**
 * Oversees most processes in the program.
 * Only one instance of Simulation should
 * exist at any time.
 */
class Simulation {
    constructor(preset = {}) {
        _Simulation_container.set(this, void 0);
        _Simulation_environment.set(this, void 0);
        _Simulation_config.set(this, void 0);
        _Simulation_particles_handler.set(this, void 0);
        _Simulation_observers.set(this, void 0);
        const preset_clone = structuredCloneCustom(preset);
        const default_clone = structuredCloneCustom(DEFAULT_PRESET);
        const final_preset = deepmergeCustom(default_clone, preset_clone);
        __classPrivateFieldSet(this, _Simulation_container, final_preset.container, "f");
        __classPrivateFieldSet(this, _Simulation_environment, final_preset.environment, "f");
        __classPrivateFieldSet(this, _Simulation_config, final_preset.config, "f");
        __classPrivateFieldSet(this, _Simulation_particles_handler, new ParticlesHandler(final_preset.particle_groups, final_preset.container), "f");
        __classPrivateFieldSet(this, _Simulation_observers, new ObserverHandler(SimEvent), "f");
        this.setupParticleHandlerObservers(__classPrivateFieldGet(this, _Simulation_particles_handler, "f"));
    }
    setupParticleHandlerObservers(particles_handler) {
        const obs = particles_handler.getObservers();
    }
    setPreset(preset) {
        const current_properties = {
            container: __classPrivateFieldGet(this, _Simulation_container, "f"),
            environment: __classPrivateFieldGet(this, _Simulation_environment, "f"),
            config: __classPrivateFieldGet(this, _Simulation_config, "f")
        };
        const preset_clone = structuredCloneCustom(preset);
        if (preset.container) {
            __classPrivateFieldSet(this, _Simulation_container, deepmergeCustom(current_properties.container, preset_clone.container), "f");
            __classPrivateFieldGet(this, _Simulation_observers, "f").notify(SimEvent.Update_Container, undefined);
        }
        if (preset.environment) {
            __classPrivateFieldSet(this, _Simulation_environment, deepmergeCustom(current_properties.environment, preset_clone.environment), "f");
            __classPrivateFieldGet(this, _Simulation_observers, "f").notify(SimEvent.Update_Environment, undefined);
        }
        if (preset.config) {
            __classPrivateFieldSet(this, _Simulation_config, deepmergeCustom(current_properties.config, preset_clone.config), "f");
            __classPrivateFieldGet(this, _Simulation_observers, "f").notify(SimEvent.Update_Config, undefined);
        }
        if (preset.particle_groups) {
            __classPrivateFieldGet(this, _Simulation_particles_handler, "f").overwriteGroups(preset.particle_groups);
        }
        if (preset)
            __classPrivateFieldGet(this, _Simulation_observers, "f").notify(SimEvent.Update, undefined);
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
    getParticlesHandler() {
        return __classPrivateFieldGet(this, _Simulation_particles_handler, "f");
    }
    getObservers() {
        return __classPrivateFieldGet(this, _Simulation_observers, "f");
    }
}
_Simulation_container = new WeakMap(), _Simulation_environment = new WeakMap(), _Simulation_config = new WeakMap(), _Simulation_particles_handler = new WeakMap(), _Simulation_observers = new WeakMap();
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
};
// For testing Simulation class, will eventually save all presets in "simulation_presets.json"
const TEMPORARY_PRESETS = {
    empty: structuredCloneCustom(DEFAULT_PRESET),
    sandbox: {
        container: {
            x_min: -275,
            x_max: 275,
            y_min: -275,
            y_max: 275
        },
        environment: structuredCloneCustom(DEFAULT_PRESET.environment),
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
                elasticity: 0.7,
                drag: 0,
                gravity: new Vector2D(),
                electric_field: new Vector2D(),
                magnetic_field: 0
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
                gravity: new Vector2D(0, -10),
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
        container: structuredCloneCustom(DEFAULT_PRESET.container),
        environment: structuredCloneCustom(DEFAULT_PRESET.environment),
        config: structuredCloneCustom(DEFAULT_PRESET.config),
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
                drag: 0,
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
};
const DEFAULT_BOUNDS = [
    { key: "radius", min: 1, max: 75 },
    { key: "position", min: { x: -1, y: -1 }, max: { x: 1, y: 1 } },
    { key: "mass", min: 1, max: false },
];
