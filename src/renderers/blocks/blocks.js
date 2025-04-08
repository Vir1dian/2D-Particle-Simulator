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
var _ButtonRenderer_callback, _ButtonRenderer_event, _DialogRenderer_open_button, _DialogRenderer_close_button, _DialogRenderer_content_wrapper, _InputRenderer_value, _InputRenderer_name, _InputRenderer_is_disabled, _InputRenderer_label_element;
/**
 * Stores an HTMLButtonElement, maintains a callback
 * and an event. Uses only one eventlistener at a
 * time.
 */
class ButtonRenderer extends Renderer {
    constructor(callback, event = 'click') {
        const button = document.createElement('button');
        button.addEventListener(event, callback);
        super(button);
        _ButtonRenderer_callback.set(this, void 0);
        _ButtonRenderer_event.set(this, void 0);
        __classPrivateFieldSet(this, _ButtonRenderer_callback, callback, "f");
        __classPrivateFieldSet(this, _ButtonRenderer_event, event, "f");
    }
    getElement() {
        return super.getElement();
    }
    deafen() {
        this.getElement().removeEventListener(__classPrivateFieldGet(this, _ButtonRenderer_event, "f"), __classPrivateFieldGet(this, _ButtonRenderer_callback, "f"));
    }
    setCallback(callback) {
        if (__classPrivateFieldGet(this, _ButtonRenderer_callback, "f") === callback)
            return;
        this.deafen();
        __classPrivateFieldSet(this, _ButtonRenderer_callback, callback, "f");
        this.getElement().addEventListener(__classPrivateFieldGet(this, _ButtonRenderer_event, "f"), callback);
    }
    setEvent(event) {
        if (__classPrivateFieldGet(this, _ButtonRenderer_event, "f") === event)
            return;
        this.deafen();
        __classPrivateFieldSet(this, _ButtonRenderer_event, event, "f");
        this.getElement().addEventListener(event, __classPrivateFieldGet(this, _ButtonRenderer_callback, "f"));
    }
    remove() {
        this.deafen();
        super.remove();
    }
}
_ButtonRenderer_callback = new WeakMap(), _ButtonRenderer_event = new WeakMap();
/**
 * Stores an empty HTMLDialogElement, an empty
 * div Renderer for wrapping the content, and two
 * ButtonRenderers for opening and closing the
 * dialog. The buttons must be accessed and
 * appended somewhere manually.
 */
class DialogRenderer extends Renderer {
    constructor(id) {
        const dialog = document.createElement('dialog');
        dialog.id = `dialog_id${id}`;
        super(dialog, '', id);
        _DialogRenderer_open_button.set(this, void 0);
        _DialogRenderer_close_button.set(this, void 0);
        _DialogRenderer_content_wrapper.set(this, void 0);
        const open_button = new ButtonRenderer(this.openDialog);
        const close_button = new ButtonRenderer(this.closeDialog);
        const content_wrapper = new Renderer(document.createElement('div'), 'dialog_wrapper', `dialog_wrapper_id${id}`);
        __classPrivateFieldSet(this, _DialogRenderer_open_button, open_button, "f");
        __classPrivateFieldSet(this, _DialogRenderer_close_button, close_button, "f");
        __classPrivateFieldSet(this, _DialogRenderer_content_wrapper, content_wrapper, "f");
    }
    getElement() {
        return super.getElement();
    }
    getContentWrapper() {
        return __classPrivateFieldGet(this, _DialogRenderer_content_wrapper, "f");
    }
    appendToContent(element) {
        const wrapper = __classPrivateFieldGet(this, _DialogRenderer_content_wrapper, "f").getElement();
        if (element instanceof Renderer) {
            wrapper.appendChild(element.getElement());
        }
        else {
            wrapper.appendChild(element);
        }
    }
    getOpenButton() {
        return __classPrivateFieldGet(this, _DialogRenderer_open_button, "f");
    }
    getCloseButton() {
        return __classPrivateFieldGet(this, _DialogRenderer_close_button, "f");
    }
    openDialog() {
        this.getElement().showModal();
    }
    closeDialog() {
        this.getElement().close();
    }
    remove() {
        __classPrivateFieldGet(this, _DialogRenderer_open_button, "f").remove();
        __classPrivateFieldGet(this, _DialogRenderer_close_button, "f").remove();
        __classPrivateFieldGet(this, _DialogRenderer_content_wrapper, "f").remove();
        super.remove();
    }
}
_DialogRenderer_open_button = new WeakMap(), _DialogRenderer_close_button = new WeakMap(), _DialogRenderer_content_wrapper = new WeakMap();
class InputRenderer extends Renderer {
    constructor(id, value = "", name = "", is_disabled = false) {
        const input = document.createElement('input');
        input.value = value;
        input.name = name;
        input.disabled = is_disabled;
        super(input, "", id); // id required for label elements
        _InputRenderer_value.set(this, void 0); // may not be strings for some Input types, will write derived InputRenderer classes for those as needed
        _InputRenderer_name.set(this, void 0);
        _InputRenderer_is_disabled.set(this, void 0);
        _InputRenderer_label_element.set(this, void 0); // appended manually within the DOM, but not required
        __classPrivateFieldSet(this, _InputRenderer_value, value, "f");
        __classPrivateFieldSet(this, _InputRenderer_name, name, "f");
        __classPrivateFieldSet(this, _InputRenderer_is_disabled, is_disabled, "f");
        const label = document.createElement('label');
        label.htmlFor = id;
        __classPrivateFieldSet(this, _InputRenderer_label_element, label, "f");
    }
    // getters
    getElement() {
        return super.getElement();
    }
    getValue() {
        return __classPrivateFieldGet(this, _InputRenderer_value, "f");
    }
    getName() {
        return __classPrivateFieldGet(this, _InputRenderer_name, "f");
    }
    isDisabled() {
        return __classPrivateFieldGet(this, _InputRenderer_is_disabled, "f");
    }
    getLabelElement() {
        return __classPrivateFieldGet(this, _InputRenderer_label_element, "f");
    }
    // setters
    setChild(child) {
        // Prevents setChild from being used for an InputRenderer
        throw new Error("InputRenderer does not support child elements.");
    }
    setValue(value) {
        __classPrivateFieldSet(this, _InputRenderer_value, value, "f");
        this.getElement().value = value;
    }
    refreshValue() {
        __classPrivateFieldSet(this, _InputRenderer_value, this.getElement().value, "f");
    }
    setName(name) {
        __classPrivateFieldSet(this, _InputRenderer_name, name, "f");
        this.getElement().name = name;
    }
    toggleDisabled() {
        __classPrivateFieldSet(this, _InputRenderer_is_disabled, !__classPrivateFieldGet(this, _InputRenderer_is_disabled, "f"), "f");
        this.getElement().disabled = __classPrivateFieldGet(this, _InputRenderer_is_disabled, "f");
    }
    setID(id) {
        super.setID(id);
        __classPrivateFieldGet(this, _InputRenderer_label_element, "f").htmlFor = id;
    }
    remove() {
        __classPrivateFieldGet(this, _InputRenderer_label_element, "f").remove();
        super.remove();
    }
}
_InputRenderer_value = new WeakMap(), _InputRenderer_name = new WeakMap(), _InputRenderer_is_disabled = new WeakMap(), _InputRenderer_label_element = new WeakMap();
class NumberInputRenderer extends InputRenderer {
    constructor(id, value = 0) {
        super(id, value.toString());
        this.getElement().type = "number";
    }
    setValue(value) {
        var _a, _b;
        // prevents the setValue base method from attempting to set a non-parsable value into for a type="number"
        super.setValue((_b = (_a = parseFloat(value)) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '0');
    }
}
class CheckboxInputRenderer extends InputRenderer {
    constructor(id, checked = false) {
        super(id, checked ? "true" : "false");
        this.getElement().type = "checkbox";
        this.getElement().checked = checked;
    }
    getValue() {
        // prevents the getValue base method from attempting to return a value attribute for a type="checkbox"
        return this.getElement().checked.toString();
    }
    getBooleanValue() {
        return this.getElement().checked;
    }
    setValue(value) {
        this.getElement().checked = value === "true";
        super.setValue(value);
    }
}
class TooltipRenderer extends Renderer {
}
class DraggableRenderer extends Renderer {
}
