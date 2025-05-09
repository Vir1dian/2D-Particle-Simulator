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
var _ParticlesHandler_groups, _ParticlesHandler_container, _ParticlesHandler_observers;
var ParticleHandlerEvent;
(function (ParticleHandlerEvent) {
    ParticleHandlerEvent[ParticleHandlerEvent["Update"] = 0] = "Update";
    ParticleHandlerEvent[ParticleHandlerEvent["Add_Group"] = 1] = "Add_Group";
    ParticleHandlerEvent[ParticleHandlerEvent["Delete_Group"] = 2] = "Delete_Group";
    ParticleHandlerEvent[ParticleHandlerEvent["Overwrite_Groups"] = 3] = "Overwrite_Groups";
})(ParticleHandlerEvent || (ParticleHandlerEvent = {}));
;
class ParticlesHandler {
    constructor(preset_groups, container) {
        _ParticlesHandler_groups.set(this, void 0);
        _ParticlesHandler_container.set(this, void 0);
        _ParticlesHandler_observers.set(this, void 0);
        __classPrivateFieldSet(this, _ParticlesHandler_groups, new Map(), "f");
        __classPrivateFieldSet(this, _ParticlesHandler_container, container, "f");
        for (const [id, group] of preset_groups) {
            __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").set(id, new ParticleGroup(group.grouping, container, group.size));
        }
        __classPrivateFieldSet(this, _ParticlesHandler_observers, new ObserverHandler(ParticleHandlerEvent), "f");
    }
    addGroup(grouping) {
        // Assumes that string group_id has valid formatting: i.e. no spaces, alphanumeric.
        if (__classPrivateFieldGet(this, _ParticlesHandler_groups, "f").has(grouping.group_id)) {
            throw new Error(`Group name: ${grouping.group_id} already exists.`);
        }
        const group = new ParticleGroup(grouping, __classPrivateFieldGet(this, _ParticlesHandler_container, "f"), 0);
        __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").set(grouping.group_id, group);
        __classPrivateFieldGet(this, _ParticlesHandler_observers, "f").notify(ParticleHandlerEvent.Update, undefined);
        __classPrivateFieldGet(this, _ParticlesHandler_observers, "f").notify(ParticleHandlerEvent.Add_Group, { group: group });
    }
    deleteGroup(group) {
        if (!__classPrivateFieldGet(this, _ParticlesHandler_groups, "f").delete(group.getGrouping().group_id))
            throw new Error("Group not found");
        __classPrivateFieldGet(this, _ParticlesHandler_observers, "f").notify(ParticleHandlerEvent.Update, undefined);
        __classPrivateFieldGet(this, _ParticlesHandler_observers, "f").notify(ParticleHandlerEvent.Delete_Group, { group: group }); // call delete related observers first
        group.clear(); // then remove all observers
    }
    overwriteGroups(preset_groups) {
        for (const [id, group] of __classPrivateFieldGet(this, _ParticlesHandler_groups, "f"))
            group.clear();
        __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").clear();
        for (const [id, group] of preset_groups)
            __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").set(id, new ParticleGroup(group.grouping, __classPrivateFieldGet(this, _ParticlesHandler_container, "f"), group.size));
        __classPrivateFieldGet(this, _ParticlesHandler_observers, "f").notify(ParticleHandlerEvent.Update, undefined);
        __classPrivateFieldGet(this, _ParticlesHandler_observers, "f").notify(ParticleHandlerEvent.Overwrite_Groups, undefined);
    }
    addParticle(particle, group) {
        group.addParticle(particle); // Observers in the called group are notified
    }
    getGroups() {
        return __classPrivateFieldGet(this, _ParticlesHandler_groups, "f");
    }
    getAllParticles() {
        const particles = [];
        __classPrivateFieldGet(this, _ParticlesHandler_groups, "f").forEach(group => {
            particles.push(...Array.from(group.getParticles().values()));
        });
        return particles;
    }
    getObservers() {
        return __classPrivateFieldGet(this, _ParticlesHandler_observers, "f");
    }
}
_ParticlesHandler_groups = new WeakMap(), _ParticlesHandler_container = new WeakMap(), _ParticlesHandler_observers = new WeakMap();
