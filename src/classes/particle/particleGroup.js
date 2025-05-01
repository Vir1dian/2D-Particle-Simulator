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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var ParticleGroupEvent;
(function (ParticleGroupEvent) {
    ParticleGroupEvent[ParticleGroupEvent["Update"] = 0] = "Update";
    ParticleGroupEvent[ParticleGroupEvent["Edit"] = 1] = "Edit";
    ParticleGroupEvent[ParticleGroupEvent["Delete"] = 2] = "Delete";
    ParticleGroupEvent[ParticleGroupEvent["Add_Particle"] = 3] = "Add_Particle";
    ParticleGroupEvent[ParticleGroupEvent["Delete_Particle"] = 4] = "Delete_Particle";
    ParticleGroupEvent[ParticleGroupEvent["Overwrite_Particles"] = 5] = "Overwrite_Particles";
})(ParticleGroupEvent || (ParticleGroupEvent = {}));
;
/**
 * Handles a group of Particles with
 * enforced common properties described
 * by a ParticleGrouping object
 */
class ParticleGroup {
    constructor(grouping = DEFAULT_GROUPING, size = 0) {
        _ParticleGroup_grouping.set(this, void 0);
        _ParticleGroup_particles.set(this, void 0);
        __classPrivateFieldSet(this, _ParticleGroup_grouping, structuredCloneCustom(grouping), "f");
        __classPrivateFieldSet(this, _ParticleGroup_particles, [], "f");
        for (let i = 0; i < size; i++) {
            const p = new Particle(grouping);
            __classPrivateFieldGet(this, _ParticleGroup_particles, "f").push(p);
        }
    }
    isValidFor(particle) {
        const grouping = ((_a) => {
            var { group_id, enable_path_tracing } = _a, exposed_properties = __rest(_a, ["group_id", "enable_path_tracing"]);
            return exposed_properties;
        })(__classPrivateFieldGet(this, _ParticleGroup_grouping, "f"));
        if (grouping === DEFAULT_GROUPING)
            return true;
        return Object.keys(grouping).every(property => {
            const grouping_value = __classPrivateFieldGet(this, _ParticleGroup_grouping, "f")[property];
            const particle_value = particle[property];
            return (grouping_value === 'random'
                || grouping_value === undefined
                || grouping_value === particle_value
                || (isVectorLike(grouping_value)
                    && isVectorLike(particle_value)
                    && grouping_value.equals(particle_value)));
        });
    }
    addParticle(particle) {
        if (this.isValidFor(particle))
            __classPrivateFieldGet(this, _ParticleGroup_particles, "f").push(particle);
        else
            throw new Error("Particle does not fit grouping.");
    }
    removeParticle(particle) {
        const index = __classPrivateFieldGet(this, _ParticleGroup_particles, "f").findIndex(p => p === particle);
        if (index >= 0 && index < __classPrivateFieldGet(this, _ParticleGroup_particles, "f").length)
            __classPrivateFieldGet(this, _ParticleGroup_particles, "f").splice(index, 1);
        else
            throw new Error("Invalid particle.");
    }
    clone() {
        return new ParticleGroup(structuredCloneCustom(__classPrivateFieldGet(this, _ParticleGroup_grouping, "f")), __classPrivateFieldGet(this, _ParticleGroup_particles, "f").length);
    }
    getGrouping() {
        return __classPrivateFieldGet(this, _ParticleGroup_grouping, "f");
    }
    getParticles() {
        return __classPrivateFieldGet(this, _ParticleGroup_particles, "f");
    }
    setGrouping(grouping) {
        const changes = createBooleanKeyStates(DEFAULT_GROUPING);
        Object.keys(changes).forEach(property => {
            const new_value = grouping[property];
            const current_value = __classPrivateFieldGet(this, _ParticleGroup_grouping, "f")[property];
            if (isVectorLike(new_value) && isVectorLike(current_value)) {
                if (new_value.x !== current_value.x || new_value.y !== current_value.y) {
                    __classPrivateFieldGet(this, _ParticleGroup_grouping, "f")[property] = new_value.clone();
                    changes[property] = true;
                }
            }
            else if (new_value !== current_value) {
                __classPrivateFieldGet(this, _ParticleGroup_grouping, "f")[property] = new_value;
                changes[property] = true;
            }
        });
        // may have to improve this
        __classPrivateFieldGet(this, _ParticleGroup_particles, "f").forEach(particle => {
            Object.keys(grouping).forEach(property => {
                const new_value = grouping[property];
                const current_value = particle[property];
                if (new_value !== 'random' && new_value !== undefined && new_value !== current_value) {
                    if (isVectorLike(new_value) && (new_value.x !== current_value.x || new_value.y !== current_value.y))
                        particle[property] = new_value.clone();
                    else
                        particle[property] = new_value;
                }
            });
        });
        return changes;
    }
}
_ParticleGroup_grouping = new WeakMap(), _ParticleGroup_particles = new WeakMap();
