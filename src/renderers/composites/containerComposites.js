"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ZVectorField_vectors, _XYVectorField_vectors;
class ZVectorField {
    constructor() {
        _ZVectorField_vectors.set(this, void 0);
        __classPrivateFieldSet(this, _ZVectorField_vectors, [], "f");
    }
}
_ZVectorField_vectors = new WeakMap();
class XYVectorField {
    constructor() {
        _XYVectorField_vectors.set(this, void 0);
        __classPrivateFieldSet(this, _XYVectorField_vectors, [], "f");
    }
}
_XYVectorField_vectors = new WeakMap();
