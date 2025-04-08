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
var _Renderer_element, _Renderer_classname, _Renderer_id;
/**
 * Base class for storing and handling an HTMLElement
 */
class Renderer {
    constructor(element, classname = '', id = '') {
        _Renderer_element.set(this, void 0);
        _Renderer_classname.set(this, void 0);
        _Renderer_id.set(this, void 0);
        __classPrivateFieldSet(this, _Renderer_element, element, "f");
        __classPrivateFieldGet(this, _Renderer_element, "f").className = classname;
        __classPrivateFieldGet(this, _Renderer_element, "f").id = id;
        __classPrivateFieldSet(this, _Renderer_classname, classname, "f");
        __classPrivateFieldSet(this, _Renderer_id, id, "f");
    }
    getElement() {
        return __classPrivateFieldGet(this, _Renderer_element, "f");
    }
    setClassName(classname) {
        __classPrivateFieldSet(this, _Renderer_classname, classname, "f");
        __classPrivateFieldGet(this, _Renderer_element, "f").className = classname;
    }
    setID(id) {
        __classPrivateFieldSet(this, _Renderer_id, id, "f");
        __classPrivateFieldGet(this, _Renderer_element, "f").id = id;
    }
    setParent(parent) {
        const currentParent = __classPrivateFieldGet(this, _Renderer_element, "f").parentElement;
        if (currentParent) {
            currentParent.removeChild(__classPrivateFieldGet(this, _Renderer_element, "f"));
        }
        if (parent instanceof HTMLElement)
            parent.appendChild(__classPrivateFieldGet(this, _Renderer_element, "f"));
        else
            parent.getElement().appendChild(__classPrivateFieldGet(this, _Renderer_element, "f"));
    }
    setChild(child) {
        if (child instanceof HTMLElement)
            __classPrivateFieldGet(this, _Renderer_element, "f").appendChild(child);
        else
            __classPrivateFieldGet(this, _Renderer_element, "f").appendChild(child.getElement());
    }
    remove() {
        var _a;
        const deafened_clone = __classPrivateFieldGet(this, _Renderer_element, "f").cloneNode(true);
        __classPrivateFieldGet(this, _Renderer_element, "f").replaceWith(deafened_clone); // Nukes all attached event listeners
        (_a = deafened_clone.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(deafened_clone);
        __classPrivateFieldGet(this, _Renderer_element, "f").remove();
    }
}
_Renderer_element = new WeakMap(), _Renderer_classname = new WeakMap(), _Renderer_id = new WeakMap();
