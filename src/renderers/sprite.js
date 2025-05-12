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
var _Sprite_translation, _Sprite_rotation, _Sprite_scale;
class Sprite extends Renderer {
    constructor(classname = '', id = '') {
        const element = document.createElement('div');
        super(element, classname, id);
        _Sprite_translation.set(this, void 0);
        _Sprite_rotation.set(this, void 0);
        _Sprite_scale.set(this, void 0);
        this.getElement().style.position = "absolute";
        __classPrivateFieldSet(this, _Sprite_translation, new Vector2D(), "f");
        __classPrivateFieldSet(this, _Sprite_rotation, 0, "f");
        __classPrivateFieldSet(this, _Sprite_scale, new Vector2D(1, 1), "f");
    }
    applyTransform() {
        const translate = `translate(${__classPrivateFieldGet(this, _Sprite_translation, "f").x}px, ${__classPrivateFieldGet(this, _Sprite_translation, "f").y}px)`;
        const rotate = `rotate(${__classPrivateFieldGet(this, _Sprite_rotation, "f")}deg)`;
        const scale = `scale(${__classPrivateFieldGet(this, _Sprite_scale, "f").x}, ${__classPrivateFieldGet(this, _Sprite_scale, "f").y})`;
        this.getElement().style.transform = `${translate} ${rotate} ${scale}`;
    }
    setStyle(styles) {
        Object.assign(this.getElement().style, styles);
    }
    translate(translation) {
        __classPrivateFieldSet(this, _Sprite_translation, new Vector2D(translation.x, translation.y), "f");
        this.applyTransform();
        return this; // allows chaining transform calls in one line
    }
    rotate(rotation) {
        __classPrivateFieldSet(this, _Sprite_rotation, rotation, "f");
        this.applyTransform();
        return this;
    }
    scale(scale) {
        __classPrivateFieldSet(this, _Sprite_scale, new Vector2D(scale.x, scale.y), "f");
        this.applyTransform();
        return this;
    }
    reset() {
        this.getElement().style.transform = 'none';
    }
    getTranslation() {
        return __classPrivateFieldGet(this, _Sprite_translation, "f");
    }
    getRotation() {
        return __classPrivateFieldGet(this, _Sprite_rotation, "f");
    }
    getScale() {
        return __classPrivateFieldGet(this, _Sprite_scale, "f");
    }
}
_Sprite_translation = new WeakMap(), _Sprite_rotation = new WeakMap(), _Sprite_scale = new WeakMap();
class ZArrowSprite extends Sprite {
}
class XYArrowSprite extends Sprite {
}
