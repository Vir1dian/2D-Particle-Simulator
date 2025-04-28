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
var _ParticlesHandler_groups, _ParticlesHandler_observers;
var ParticleEvent;
(function (ParticleEvent) {
    ParticleEvent[ParticleEvent["Update"] = 0] = "Update";
    ParticleEvent[ParticleEvent["Update_Particle_Groups"] = 1] = "Update_Particle_Groups";
    ParticleEvent[ParticleEvent["Update_Particle"] = 2] = "Update_Particle";
})(ParticleEvent || (ParticleEvent = {}));
;
class ParticlesHandler {
    constructor(preset_groups) {
        _ParticlesHandler_groups.set(this, void 0);
        _ParticlesHandler_observers.set(this, void 0);
        __classPrivateFieldSet(this, _ParticlesHandler_groups, new Map(), "f");
        if (preset_groups) {
            for (const [id, group] of preset_groups) {
                __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").set(id, new ParticleGroup(group.grouping, group.size));
            }
        }
        __classPrivateFieldSet(this, _ParticlesHandler_observers, new Map(), "f");
        Object.keys(ParticleEvent).forEach((_, event) => {
            __classPrivateFieldGet(this, _ParticlesHandler_observers, "f").set(event, new Set());
        });
    }
    add_observer(event, callback) {
        __classPrivateFieldGet(this, _ParticlesHandler_observers, "f").get(event).add(callback);
    }
    remove_observer(event, callback) {
        __classPrivateFieldGet(this, _ParticlesHandler_observers, "f").get(event).delete(callback);
    }
    notify_observers(...events) {
        events.forEach(({ type, payload }) => {
            __classPrivateFieldGet(this, _ParticlesHandler_observers, "f").get(type).forEach(callback => callback(payload));
        });
    }
    addGroup(grouping) {
        // Assumes that string group_id has valid formatting: i.e. no spaces, alphanumeric.
        if (__classPrivateFieldGet(this, _ParticlesHandler_groups, "f").has(grouping.group_id)) {
            throw new Error(`Group name: ${grouping.group_id} already exists.`);
        }
        const group = new ParticleGroup(grouping, 0);
        __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").set(grouping.group_id, group);
        this.notify_observers({ type: ParticleEvent.Update }, { type: ParticleEvent.Update_Particle_Groups, payload: { operation: "add", data: group } });
    }
    editGroup(group_id, grouping) {
        const group = __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").get(group_id);
        if (!group)
            throw new Error(`Group name: ${group_id} not found`);
        const changes_log = group.setGrouping(grouping);
        this.notify_observers({ type: ParticleEvent.Update }, { type: ParticleEvent.Update_Particle_Groups, payload: { operation: "edit", data: group, data2: changes_log } });
    }
    deleteGroup(group_id) {
        const group = __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").get(group_id);
        this.notify_observers({ type: ParticleEvent.Update }, { type: ParticleEvent.Update_Particle_Groups, payload: { operation: "delete", data: group_id } });
        __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").delete(group_id);
        if (group)
            group.getParticles().length = 0;
    }
    overwriteGroups(preset_groups) {
        __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").clear();
        for (const [id, group] of preset_groups) {
            __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").set(id, new ParticleGroup(group.grouping, group.size));
        }
        this.notify_observers({ type: ParticleEvent.Update }, { type: ParticleEvent.Update_Particle_Groups, payload: { operation: "overwrite" } });
    }
    addParticle(particle) {
        // TODO
    }
    editParticle(particle) {
        // TODO
    }
    deleteParticle(particle) {
        // TODO
    }
    getGroups() {
        return __classPrivateFieldGet(this, _ParticlesHandler_groups, "f");
    }
    getAllParticles() {
        const particles = [];
        __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").forEach(group => {
            particles.push(...group.getParticles());
        });
        return particles;
    }
}
_ParticlesHandler_groups = new WeakMap(), _ParticlesHandler_observers = new WeakMap();
