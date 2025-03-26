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
var _Simulation_container, _Simulation_environment, _Simulation_config, _Simulation_particle_groups;
class Simulation {
    constructor(container = DEFAULT_PRESET.container, environment = DEFAULT_PRESET.environment, config = DEFAULT_PRESET.config) {
        _Simulation_container.set(this, void 0);
        _Simulation_environment.set(this, void 0);
        _Simulation_config.set(this, void 0);
        _Simulation_particle_groups.set(this, void 0);
        __classPrivateFieldSet(this, _Simulation_container, container, "f");
        __classPrivateFieldSet(this, _Simulation_environment, environment, "f");
        __classPrivateFieldSet(this, _Simulation_config, config, "f");
        __classPrivateFieldSet(this, _Simulation_particle_groups, DEFAULT_PRESET.particle_groups, "f");
        // particle_groups is populated after instantiation
    }
    addGroup(grouping) {
        // Assumes that group_id has valid formatting: i.e. no spaces, hash symbols, etc.
        if (__classPrivateFieldGet(this, _Simulation_particle_groups, "f").has(grouping.group_id))
            throw new Error("Group name already exists.");
        __classPrivateFieldGet(this, _Simulation_particle_groups, "f").set(grouping.group_id, { grouping, particles: [] });
    }
    addParticle(particle, group_id = DEFAULT_GROUPING.group_id) {
        // Assumes that the particle already fits the grouping
        const group = __classPrivateFieldGet(this, _Simulation_particle_groups, "f").get(group_id);
        if (!group)
            throw new Error("Group name does not exist.");
        group.particles.push(particle);
    }
    // Setters & Getters
    setContainer(container) {
        __classPrivateFieldSet(this, _Simulation_container, container, "f");
    }
    setEnvironment(environment) {
        __classPrivateFieldSet(this, _Simulation_environment, environment, "f");
    }
    setConfig(config) {
        __classPrivateFieldSet(this, _Simulation_config, config, "f");
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
    getParticles() {
        return __classPrivateFieldGet(this, _Simulation_particle_groups, "f");
    }
}
_Simulation_container = new WeakMap(), _Simulation_environment = new WeakMap(), _Simulation_config = new WeakMap(), _Simulation_particle_groups = new WeakMap();
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
        [DEFAULT_GROUPING.group_id, { grouping: DEFAULT_GROUPING, particles: [] }]
    ])
};
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
                    particles: Particle.createBatch({
                        group_id: DEFAULT_GROUPING.group_id,
                        position: 'random',
                        velocity: 'random',
                        mass: 'random',
                        color: 'random',
                    }, 40)
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
                        position: new Vector2D(-200, 200),
                        velocity: new Vector2D(200, -200),
                        mass: 4,
                        color: 'red',
                    },
                    particles: Particle.createBatch({
                        group_id: "red",
                        radius: 15,
                        position: new Vector2D(-200, 200),
                        velocity: new Vector2D(200, -200),
                        mass: 4,
                        color: 'red',
                    }, 10)
                }],
            ["yellow", {
                    grouping: {
                        group_id: "yellow",
                        radius: 15,
                        position: new Vector2D(-200, -200),
                        velocity: new Vector2D(200, 200),
                        mass: 2,
                        color: 'orange',
                    },
                    particles: Particle.createBatch({
                        group_id: "yellow",
                        radius: 15,
                        position: new Vector2D(-200, -200),
                        velocity: new Vector2D(200, 200),
                        mass: 2,
                        color: 'orange',
                    }, 10)
                }],
            ["blue", {
                    grouping: {
                        group_id: "blue",
                        radius: 15,
                        position: new Vector2D(200, 200),
                        velocity: new Vector2D(-200, -200),
                        mass: 3,
                        color: 'blue',
                    },
                    particles: Particle.createBatch({
                        group_id: "blue",
                        radius: 15,
                        position: new Vector2D(200, 200),
                        velocity: new Vector2D(-200, -200),
                        mass: 3,
                        color: 'blue',
                    }, 10)
                }],
            ["green", {
                    grouping: {
                        group_id: "green",
                        radius: 15,
                        position: new Vector2D(200, -200),
                        velocity: new Vector2D(-200, 200),
                        mass: 1,
                        color: 'green',
                    },
                    particles: Particle.createBatch({
                        group_id: "green",
                        radius: 15,
                        position: new Vector2D(200, -200),
                        velocity: new Vector2D(-200, 200),
                        mass: 1,
                        color: 'green',
                    }, 10)
                }]
        ])
    }
};
