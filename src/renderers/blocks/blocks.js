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
var _ButtonRenderer_callback, _ButtonRenderer_event, _DialogRenderer_open_button, _DialogRenderer_close_button, _DialogRenderer_content_wrapper, _StandardDialogRenderer_body, _InputRenderer_value, _InputRenderer_name, _InputRenderer_is_disabled, _InputRenderer_label_element;
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
        const open_button = new ButtonRenderer(this.openDialog.bind(this));
        const close_button = new ButtonRenderer(this.closeDialog.bind(this));
        const content_wrapper = new Renderer(document.createElement('div'), 'dialog_wrapper', `dialog_wrapper_id${id}`);
        __classPrivateFieldSet(this, _DialogRenderer_open_button, open_button, "f");
        __classPrivateFieldSet(this, _DialogRenderer_close_button, close_button, "f");
        __classPrivateFieldSet(this, _DialogRenderer_content_wrapper, content_wrapper, "f");
        open_button.getElement().textContent = `Open ${id}`;
        close_button.getElement().textContent = `Close ${id}`;
        this.setChild(__classPrivateFieldGet(this, _DialogRenderer_content_wrapper, "f"));
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
    setOpenButtonLabel(label, is_mdi = false) {
        const open_button = this.getOpenButton();
        if (is_mdi) {
            open_button.setClassName("material-symbols-sharp icon");
        }
        open_button.getElement().textContent = label;
    }
    setCloseButtonLabel(label, is_mdi = false) {
        const close_button = this.getCloseButton();
        if (is_mdi) {
            close_button.setClassName("material-symbols-sharp icon");
        }
        close_button.getElement().textContent = label;
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
/**
 * An extension of DialogRenderer with basic styling
 * for a title and a close button, with a space for
 * a renderer body. The open button must be accessed
 * and appended somewhere manually.
 */
class StandardDialogRenderer extends DialogRenderer {
    constructor(body, id, title_text = '', isDraggable = false) {
        super(id);
        _StandardDialogRenderer_body.set(this, void 0);
        const header = document.createElement('header');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        const title = document.createElement('span');
        title.innerHTML = title_text;
        header.appendChild(title);
        this.getCloseButton().setParent(header);
        this.appendToContent(header);
        __classPrivateFieldSet(this, _StandardDialogRenderer_body, body, "f");
        this.appendToContent(__classPrivateFieldGet(this, _StandardDialogRenderer_body, "f"));
        this.getElement().addEventListener('click', e => {
            if (e.target instanceof HTMLDialogElement) {
                this.closeDialog();
            }
        });
        if (isDraggable)
            this.setAsDraggable(header, this.getElement());
    }
    // From w3schools: https://www.w3schools.com/howto/howto_js_draggable.asp 
    setAsDraggable(header, dialog) {
        header.style.cursor = 'move';
        dialog.classList.add('draggable');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            console.log(`1: ${pos1}, 2: ${pos2}, 3: ${pos3}, 4: ${pos4}`);
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            dialog.style.top = (dialog.offsetTop - pos2) + "px";
            dialog.style.left = (dialog.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}
_StandardDialogRenderer_body = new WeakMap();
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
    getNumberValue() {
        return parseFloat(this.getValue());
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
