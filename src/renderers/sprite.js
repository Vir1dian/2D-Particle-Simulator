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
var _Sprite_translate, _Sprite_rotate, _Sprite_scale;
class Sprite extends Renderer {
    constructor(classname = '', id = '') {
        const element = document.createElement('div');
        super(element, classname, id);
        _Sprite_translate.set(this, void 0);
        _Sprite_rotate.set(this, void 0);
        _Sprite_scale.set(this, void 0);
        this.getElement().style.position = "absolute";
        __classPrivateFieldSet(this, _Sprite_translate, '', "f");
        __classPrivateFieldSet(this, _Sprite_rotate, '', "f");
        __classPrivateFieldSet(this, _Sprite_scale, 'scale(1, 1)', "f");
    }
    applyTransform() {
        this.getElement().style.transform = `${__classPrivateFieldGet(this, _Sprite_translate, "f")} ${__classPrivateFieldGet(this, _Sprite_rotate, "f")} ${__classPrivateFieldGet(this, _Sprite_scale, "f")}`;
    }
    setStyle(styles) {
        Object.assign(this.getElement().style, styles);
    }
    translate(x, y) {
        __classPrivateFieldSet(this, _Sprite_translate, `translate(${x}px, ${y}px)`, "f");
        this.applyTransform();
        return this; // allows chaining transform calls in one line
    }
    rotate(deg) {
        __classPrivateFieldSet(this, _Sprite_rotate, `rotate(${deg}deg)`, "f");
        this.applyTransform();
        return this;
    }
    scale(scale_x, scale_y) {
        __classPrivateFieldSet(this, _Sprite_scale, `scale(${scale_x}, ${scale_y})`, "f");
        this.applyTransform();
        return this;
    }
    reset() {
        this.getElement().style.transform = 'none';
    }
}
_Sprite_translate = new WeakMap(), _Sprite_rotate = new WeakMap(), _Sprite_scale = new WeakMap();
class ZArrowSprite extends Sprite {
}
class XYArrowSprite extends Sprite {
}
