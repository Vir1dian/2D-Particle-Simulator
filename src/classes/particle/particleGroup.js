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
var _ParticleGroup_grouping, _ParticleGroup_particles;
const DEFAULT_GROUPING = {
    group_id: "Ungrouped",
    radius: 5,
    position: new Vector2D(),
    velocity: new Vector2D(),
    mass: 1,
    charge: 0,
    color: "black",
    enable_path_tracing: false
};
class ParticleGroup {
    constructor(grouping = DEFAULT_GROUPING, size = 0) {
        _ParticleGroup_grouping.set(this, void 0);
        _ParticleGroup_particles.set(this, void 0);
        __classPrivateFieldSet(this, _ParticleGroup_grouping, grouping, "f");
        __classPrivateFieldSet(this, _ParticleGroup_particles, [], "f");
        for (let i = 0; i < size; i++) {
            const p = new Particle(grouping);
            __classPrivateFieldGet(this, _ParticleGroup_particles, "f").push(p);
        }
    }
    isValidFor(particle) {
        return Object.keys(__classPrivateFieldGet(this, _ParticleGroup_grouping, "f")).every(property => {
            const grouping_value = __classPrivateFieldGet(this, _ParticleGroup_grouping, "f")[property];
            const particle_value = particle[property];
            return grouping_value === 'random' || grouping_value === undefined || grouping_value === particle_value;
        });
    }
    addParticle(particle) {
        if (this.isValidFor(particle))
            __classPrivateFieldGet(this, _ParticleGroup_particles, "f").push(particle);
        else
            throw new Error("Particle does not fit grouping.");
    }
    removeParticle(index) {
        if (index >= 0 && index < __classPrivateFieldGet(this, _ParticleGroup_particles, "f").length) {
            __classPrivateFieldGet(this, _ParticleGroup_particles, "f").splice(index, 1);
        }
    }
    clone() {
        return new ParticleGroup(__classPrivateFieldGet(this, _ParticleGroup_grouping, "f"), __classPrivateFieldGet(this, _ParticleGroup_particles, "f").length);
    }
    getGrouping() {
        return __classPrivateFieldGet(this, _ParticleGroup_grouping, "f");
    }
    getParticles() {
        return __classPrivateFieldGet(this, _ParticleGroup_particles, "f");
    }
}
_ParticleGroup_grouping = new WeakMap(), _ParticleGroup_particles = new WeakMap();
