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
var _ZVectorField_arrows, _ZVectorField_magnitude, _XYVectorField_arrows, _XYVectorField_angle, _XYVectorField_magnitude;
const VECTOR_VISUAL_SCALE_FACTOR = 1 / 10000;
class ZVectorField {
    constructor(container, width_between, offset, magnitude = 1, color = 'black') {
        _ZVectorField_arrows.set(this, void 0);
        _ZVectorField_magnitude.set(this, void 0);
        if (width_between < 15)
            throw new Error("Invalid width between arrows.");
        __classPrivateFieldSet(this, _ZVectorField_arrows, [], "f");
        const is_pointing_up = magnitude >= 0;
        __classPrivateFieldSet(this, _ZVectorField_magnitude, magnitude, "f");
        for (let j = 1.5 * container.y_min + offset; j < 1.5 * container.y_max - offset; j += width_between) {
            const row = [];
            for (let i = 1.5 * container.x_min + offset; i < 1.5 * container.x_max - offset; i += width_between) {
                const arrow = new ZArrowSprite(is_pointing_up);
                arrow
                    .translate({
                    x: i - container.x_min,
                    y: j - container.y_min
                })
                    .slowScale(VECTOR_VISUAL_SCALE_FACTOR * Math.abs(magnitude));
                arrow.setColor(color);
                row.push(arrow);
            }
            __classPrivateFieldGet(this, _ZVectorField_arrows, "f").push(row);
        }
    }
    setArrowsParent(parent) {
        __classPrivateFieldGet(this, _ZVectorField_arrows, "f").forEach(row => row.forEach(arrow => arrow.setParent(parent)));
    }
    setMagnitude(magnitude) {
        if (__classPrivateFieldGet(this, _ZVectorField_magnitude, "f") === magnitude)
            return;
        __classPrivateFieldSet(this, _ZVectorField_magnitude, magnitude, "f");
        __classPrivateFieldGet(this, _ZVectorField_arrows, "f").forEach(row => row.forEach(arrow => {
            arrow.slowScale(VECTOR_VISUAL_SCALE_FACTOR * Math.abs(magnitude)).pointUp(magnitude >= 0);
        }));
    }
    setColor(color) {
        __classPrivateFieldGet(this, _ZVectorField_arrows, "f").forEach(row => row.forEach(arrow => arrow.setColor(color)));
    }
    getMagnitude() {
        return __classPrivateFieldGet(this, _ZVectorField_magnitude, "f");
    }
    getArrows() {
        return __classPrivateFieldGet(this, _ZVectorField_arrows, "f");
    }
    clear() {
        __classPrivateFieldGet(this, _ZVectorField_arrows, "f").forEach(row => row.forEach(arrow => arrow.remove()));
        __classPrivateFieldGet(this, _ZVectorField_arrows, "f").length = 0;
    }
}
_ZVectorField_arrows = new WeakMap(), _ZVectorField_magnitude = new WeakMap();
class XYVectorField {
    constructor(container, width_between, offset, angle = 0, magnitude = 1, color = 'black') {
        _XYVectorField_arrows.set(this, void 0);
        _XYVectorField_angle.set(this, void 0);
        _XYVectorField_magnitude.set(this, void 0);
        if (width_between < 15)
            throw new Error("Invalid width between arrows.");
        __classPrivateFieldSet(this, _XYVectorField_arrows, [], "f");
        __classPrivateFieldSet(this, _XYVectorField_angle, angle, "f");
        __classPrivateFieldSet(this, _XYVectorField_magnitude, magnitude, "f");
        const negative_offset = magnitude < 0 ? 180 : 0;
        for (let j = 1.5 * container.y_min + offset; j < 1.5 * container.y_max - offset; j += width_between) {
            const row = [];
            for (let i = 1.5 * container.x_min + offset; i < 1.5 * container.x_max - offset; i += width_between) {
                const arrow = new XYArrowSprite();
                arrow
                    .translate({
                    x: i - container.x_min,
                    y: j - container.y_min
                })
                    .slowScale(VECTOR_VISUAL_SCALE_FACTOR * Math.abs(magnitude))
                    .rotate(__classPrivateFieldGet(this, _XYVectorField_angle, "f") + negative_offset);
                arrow.setColor(color);
                row.push(arrow);
            }
            __classPrivateFieldGet(this, _XYVectorField_arrows, "f").push(row);
        }
    }
    setArrowsParent(parent) {
        __classPrivateFieldGet(this, _XYVectorField_arrows, "f").forEach(row => row.forEach(arrow => arrow.setParent(parent)));
    }
    pointAt(direction) {
        const negative_offset = __classPrivateFieldGet(this, _XYVectorField_magnitude, "f") < 0 ? 180 : 0;
        if (typeof direction === 'number') { // If direction is already an angle
            __classPrivateFieldGet(this, _XYVectorField_arrows, "f").forEach(row => row.forEach(arrow => arrow.rotate(direction + negative_offset)));
            __classPrivateFieldSet(this, _XYVectorField_angle, direction, "f");
        }
        else {
            const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);
            __classPrivateFieldGet(this, _XYVectorField_arrows, "f").forEach(row => row.forEach(arrow => arrow.rotate(angle + negative_offset)));
            __classPrivateFieldSet(this, _XYVectorField_angle, angle, "f");
        }
    }
    setMagnitude(magnitude) {
        const negative_offset = magnitude < 0 ? 180 : 0;
        if (__classPrivateFieldGet(this, _XYVectorField_magnitude, "f") === magnitude)
            return;
        __classPrivateFieldSet(this, _XYVectorField_magnitude, magnitude, "f");
        __classPrivateFieldGet(this, _XYVectorField_arrows, "f").forEach(row => row.forEach(arrow => {
            arrow
                .slowScale(VECTOR_VISUAL_SCALE_FACTOR * Math.abs(magnitude))
                .rotate(__classPrivateFieldGet(this, _XYVectorField_angle, "f") + negative_offset);
        }));
    }
    setColor(color) {
        __classPrivateFieldGet(this, _XYVectorField_arrows, "f").forEach(row => row.forEach(arrow => arrow.setColor(color)));
    }
    getAngle() {
        return __classPrivateFieldGet(this, _XYVectorField_angle, "f");
    }
    getMagnitude() {
        return __classPrivateFieldGet(this, _XYVectorField_magnitude, "f");
    }
    getArrows() {
        return __classPrivateFieldGet(this, _XYVectorField_arrows, "f");
    }
    clear() {
        __classPrivateFieldGet(this, _XYVectorField_arrows, "f").forEach(row => row.forEach(arrow => arrow.remove()));
        __classPrivateFieldGet(this, _XYVectorField_arrows, "f").length = 0;
    }
}
_XYVectorField_arrows = new WeakMap(), _XYVectorField_angle = new WeakMap(), _XYVectorField_magnitude = new WeakMap();
