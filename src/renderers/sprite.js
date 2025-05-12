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
var _Sprite_translation, _Sprite_rotation, _Sprite_scale, _ZArrowSprite_is_pointing_up, _ZArrowSprite_dot, _ZArrowSprite_cross, _XYArrowSprite_head, _XYArrowSprite_body;
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
        const rotate = `rotate(${__classPrivateFieldGet(this, _Sprite_rotation, "f") * -1}deg)`;
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
    /**
     * Warning: getBoundingClientRect() only works once
     * element is rendered in the DOM. Use setTimout
     * to delay translateCenter if to be used immediately.
     */
    translateCenter(translation) {
        const bounds = this.getElement().getBoundingClientRect();
        const offsetX = bounds.width / 2;
        const offsetY = bounds.height / 2;
        return this.translate({
            x: translation.x - offsetX,
            y: translation.y - offsetY,
        });
    }
    slowScale(magnitude, base = Math.E) {
        const safe_magnitude = Math.max(0, magnitude); // Prevent negatives
        const scale_factor = safe_magnitude ** 0.1;
        this.scale({
            x: scale_factor,
            y: scale_factor
        });
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
    constructor(is_up = true) {
        super('z_arrow_wrapper');
        _ZArrowSprite_is_pointing_up.set(this, void 0);
        _ZArrowSprite_dot.set(this, void 0);
        _ZArrowSprite_cross.set(this, void 0);
        const wrapper = this.getElement();
        __classPrivateFieldSet(this, _ZArrowSprite_is_pointing_up, is_up, "f");
        __classPrivateFieldSet(this, _ZArrowSprite_dot, document.createElement('div'), "f");
        __classPrivateFieldSet(this, _ZArrowSprite_cross, document.createElement('div'), "f");
        __classPrivateFieldGet(this, _ZArrowSprite_dot, "f").className = 'z_arrow_dot';
        __classPrivateFieldGet(this, _ZArrowSprite_cross, "f").className = 'z_arrow_cross';
        wrapper.appendChild(__classPrivateFieldGet(this, _ZArrowSprite_dot, "f"));
        wrapper.appendChild(__classPrivateFieldGet(this, _ZArrowSprite_cross, "f"));
        if (is_up) {
            __classPrivateFieldGet(this, _ZArrowSprite_dot, "f").style.display = '';
            __classPrivateFieldGet(this, _ZArrowSprite_cross, "f").style.display = 'none';
        }
        else {
            __classPrivateFieldGet(this, _ZArrowSprite_dot, "f").style.display = 'none';
            __classPrivateFieldGet(this, _ZArrowSprite_cross, "f").style.display = '';
        }
    }
    pointUp(value = true) {
        __classPrivateFieldSet(this, _ZArrowSprite_is_pointing_up, value, "f");
        if (value) {
            __classPrivateFieldGet(this, _ZArrowSprite_dot, "f").style.display = '';
            __classPrivateFieldGet(this, _ZArrowSprite_cross, "f").style.display = 'none';
        }
        else {
            __classPrivateFieldGet(this, _ZArrowSprite_dot, "f").style.display = 'none';
            __classPrivateFieldGet(this, _ZArrowSprite_cross, "f").style.display = '';
        }
    }
    isPointingUp() {
        return __classPrivateFieldGet(this, _ZArrowSprite_is_pointing_up, "f");
    }
    setColor(color) {
        __classPrivateFieldGet(this, _ZArrowSprite_dot, "f").style.backgroundColor = color;
        __classPrivateFieldGet(this, _ZArrowSprite_cross, "f").style.background = color;
    }
    remove() {
        __classPrivateFieldGet(this, _ZArrowSprite_dot, "f").remove();
        __classPrivateFieldGet(this, _ZArrowSprite_cross, "f").remove();
        super.remove();
    }
}
_ZArrowSprite_is_pointing_up = new WeakMap(), _ZArrowSprite_dot = new WeakMap(), _ZArrowSprite_cross = new WeakMap();
class XYArrowSprite extends Sprite {
    constructor() {
        super('xy_arrow_wrapper');
        _XYArrowSprite_head.set(this, void 0);
        _XYArrowSprite_body.set(this, void 0);
        const wrapper = this.getElement();
        __classPrivateFieldSet(this, _XYArrowSprite_head, document.createElement('div'), "f");
        __classPrivateFieldSet(this, _XYArrowSprite_body, document.createElement('div'), "f");
        __classPrivateFieldGet(this, _XYArrowSprite_head, "f").className = 'xy_arrow_head';
        __classPrivateFieldGet(this, _XYArrowSprite_body, "f").className = 'xy_arrow_body';
        wrapper.appendChild(__classPrivateFieldGet(this, _XYArrowSprite_body, "f"));
        wrapper.appendChild(__classPrivateFieldGet(this, _XYArrowSprite_head, "f"));
    }
    pointAt(direction) {
        const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);
        this.rotate(angle);
    }
    setColor(color) {
        __classPrivateFieldGet(this, _XYArrowSprite_head, "f").style.borderLeftColor = color;
        __classPrivateFieldGet(this, _XYArrowSprite_body, "f").style.background = color;
    }
    remove() {
        __classPrivateFieldGet(this, _XYArrowSprite_head, "f").remove();
        __classPrivateFieldGet(this, _XYArrowSprite_body, "f").remove();
        super.remove();
    }
}
_XYArrowSprite_head = new WeakMap(), _XYArrowSprite_body = new WeakMap();
