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
var _ObserverHandler_observers;
/**
 * Maps a number type enum into a Record pairing each enum value
 * with an empty set to store observer callbacks.
 */
class ObserverHandler {
    constructor(enum_object) {
        _ObserverHandler_observers.set(this, void 0);
        __classPrivateFieldSet(this, _ObserverHandler_observers, {}, "f");
        Object.keys(enum_object).forEach(key => {
            const value = enum_object[key];
            if (typeof value === 'number') {
                __classPrivateFieldGet(this, _ObserverHandler_observers, "f")[value] = new Set();
            }
        });
    }
    add(event, callback) {
        if (!__classPrivateFieldGet(this, _ObserverHandler_observers, "f")[event])
            throw new Error(`Event ${event} not found.`);
        __classPrivateFieldGet(this, _ObserverHandler_observers, "f")[event].add(callback);
    }
    remove(event, callback) {
        if (!__classPrivateFieldGet(this, _ObserverHandler_observers, "f")[event])
            throw new Error(`Event ${event} not found.`);
        __classPrivateFieldGet(this, _ObserverHandler_observers, "f")[event].delete(callback);
    }
    notify(event, payload) {
        if (!__classPrivateFieldGet(this, _ObserverHandler_observers, "f")[event])
            throw new Error(`Event ${event} not found.`);
        __classPrivateFieldGet(this, _ObserverHandler_observers, "f")[event].forEach(callback => callback(payload));
    }
    clear(event) {
        if (!__classPrivateFieldGet(this, _ObserverHandler_observers, "f")[event])
            throw new Error(`Event ${event} not found.`);
        __classPrivateFieldGet(this, _ObserverHandler_observers, "f")[event].clear();
    }
    clearAll() {
        var _a;
        for (const key in __classPrivateFieldGet(this, _ObserverHandler_observers, "f")) {
            (_a = __classPrivateFieldGet(this, _ObserverHandler_observers, "f")[key]) === null || _a === void 0 ? void 0 : _a.clear();
        }
    }
}
_ObserverHandler_observers = new WeakMap();
