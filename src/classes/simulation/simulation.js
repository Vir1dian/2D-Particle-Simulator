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
    constructor(container = sim_defaults.box, environment = sim_defaults.environment, config = sim_defaults.config) {
        _Simulation_container.set(this, void 0);
        _Simulation_environment.set(this, void 0);
        _Simulation_config.set(this, void 0);
        _Simulation_particle_groups.set(this, void 0);
        __classPrivateFieldSet(this, _Simulation_container, container, "f");
        __classPrivateFieldSet(this, _Simulation_environment, environment, "f");
        __classPrivateFieldSet(this, _Simulation_config, config, "f");
        __classPrivateFieldSet(this, _Simulation_particle_groups, new Map([
            ["Ungrouped", { grouping: { group_id: "Ungrouped" }, particles: [] }]
        ]), "f");
        // particle_groups is populated after instantiation
    }
    addGroup(grouping) {
        if (__classPrivateFieldGet(this, _Simulation_particle_groups, "f").has(grouping.group_id))
            throw new Error("Group name already exists.");
        __classPrivateFieldGet(this, _Simulation_particle_groups, "f").set(grouping.group_id, { grouping, particles: [] });
    }
    addParticle(particle, group_id) {
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
};
// For testing Simulation class, will eventually save all presets in "simulation_presets.json"
const temporary_presets = {};
