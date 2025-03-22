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
var _Renderer_element, _Renderer_classname, _Renderer_id, _InputRenderer_value, _InputRenderer_type, _InputRenderer_is_readonly, _ButtonRenderer_callback, _ButtonRenderer_event, _DialogRenderer_open_button, _DialogRenderer_close_button, _TableCellRenderer_row, _TableCellRenderer_col, _TableRenderer_rows, _TableRenderer_cols, _TableRenderer_cells, _ListRenderer_items;
/**
 *
 */
class Renderer {
    constructor(element, classname = '', id = '') {
        _Renderer_element.set(this, void 0);
        _Renderer_classname.set(this, void 0);
        _Renderer_id.set(this, void 0);
        __classPrivateFieldSet(this, _Renderer_element, element, "f");
        __classPrivateFieldGet(this, _Renderer_element, "f").classList.add(classname);
        __classPrivateFieldGet(this, _Renderer_element, "f").id = id;
        __classPrivateFieldSet(this, _Renderer_classname, classname, "f");
        __classPrivateFieldSet(this, _Renderer_id, id, "f");
    }
    getElement() {
        return __classPrivateFieldGet(this, _Renderer_element, "f");
    }
    setClassName(classname) {
        __classPrivateFieldSet(this, _Renderer_classname, classname, "f");
        __classPrivateFieldGet(this, _Renderer_element, "f").classList.add(classname);
    }
    setID(id) {
        __classPrivateFieldSet(this, _Renderer_id, id, "f");
        __classPrivateFieldGet(this, _Renderer_element, "f").id = id;
    }
    setStyle() {
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
        __classPrivateFieldGet(this, _Renderer_element, "f").replaceWith(__classPrivateFieldGet(this, _Renderer_element, "f").cloneNode(true)); // Nukes all attached event listeners
        __classPrivateFieldGet(this, _Renderer_element, "f").remove();
    }
}
_Renderer_element = new WeakMap(), _Renderer_classname = new WeakMap(), _Renderer_id = new WeakMap();
class InputRenderer extends Renderer {
    constructor(value, type, is_readonly = false) {
        const input = document.createElement('input');
        input.type = type;
        input.value = value.toString();
        input.readOnly = is_readonly;
        super(input);
        _InputRenderer_value.set(this, void 0);
        _InputRenderer_type.set(this, void 0);
        _InputRenderer_is_readonly.set(this, void 0);
        this.validateType(type, value);
        __classPrivateFieldSet(this, _InputRenderer_value, value, "f");
        __classPrivateFieldSet(this, _InputRenderer_type, type, "f");
        __classPrivateFieldSet(this, _InputRenderer_is_readonly, is_readonly, "f");
    }
    getElement() {
        return super.getElement();
    }
    setChild(child) {
        throw new Error("InputRenderer does not support child elements.");
    }
    refreshValue() {
        __classPrivateFieldSet(this, _InputRenderer_value, this.getElement().value, "f");
    }
    setValue(value) {
        this.validateType(__classPrivateFieldGet(this, _InputRenderer_type, "f"), value);
        __classPrivateFieldSet(this, _InputRenderer_value, value, "f");
        this.getElement().value = value.toString();
    }
    validateType(type, value) {
        const isInvalid1 = type === 'text' && typeof value !== 'string';
        const isInvalid2 = type === 'number' && typeof value !== 'number';
        const isInvalid3 = type === 'checkbox' && typeof value !== 'boolean';
        if (isInvalid1 || isInvalid2 || isInvalid3) {
            throw new Error("InputRenderer parameter type mismatch.");
        }
    }
}
_InputRenderer_value = new WeakMap(), _InputRenderer_type = new WeakMap(), _InputRenderer_is_readonly = new WeakMap();
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
}
_ButtonRenderer_callback = new WeakMap(), _ButtonRenderer_event = new WeakMap();
class DialogRenderer extends Renderer {
    constructor(id) {
        const dialog = document.createElement('dialog');
        dialog.id = id;
        super(dialog, '', id);
        _DialogRenderer_open_button.set(this, void 0);
        _DialogRenderer_close_button.set(this, void 0);
        const open_button = new ButtonRenderer(this.openDialog);
        const close_button = new ButtonRenderer(this.closeDialog);
        __classPrivateFieldSet(this, _DialogRenderer_open_button, open_button, "f");
        __classPrivateFieldSet(this, _DialogRenderer_close_button, close_button, "f");
    }
    getElement() {
        return super.getElement();
    }
    openDialog() {
        this.getElement().showModal();
    }
    closeDialog() {
        this.getElement().close();
    }
}
_DialogRenderer_open_button = new WeakMap(), _DialogRenderer_close_button = new WeakMap();
class TableCellRenderer extends Renderer {
    constructor(row, col) {
        const cell = document.createElement('td');
        super(cell);
        _TableCellRenderer_row.set(this, void 0);
        _TableCellRenderer_col.set(this, void 0);
        __classPrivateFieldSet(this, _TableCellRenderer_row, row, "f");
        __classPrivateFieldSet(this, _TableCellRenderer_col, col, "f");
    }
    getElement() {
        return super.getElement();
    }
    getRow() {
        return __classPrivateFieldGet(this, _TableCellRenderer_row, "f");
    }
    getCol() {
        return __classPrivateFieldGet(this, _TableCellRenderer_col, "f");
    }
    setContent(content) {
        const cell = this.getElement();
        cell.innerHTML = '';
        if (typeof content === 'string') {
            cell.innerHTML = content;
        }
        else {
            cell.appendChild(content);
        }
    }
}
_TableCellRenderer_row = new WeakMap(), _TableCellRenderer_col = new WeakMap();
class TableRenderer extends Renderer {
    constructor(rows = 1, cols = 1) {
        if (rows < 1 || cols < 1) {
            throw new Error('Invalid table dimensions');
        }
        const table = document.createElement('table');
        super(table);
        _TableRenderer_rows.set(this, void 0);
        _TableRenderer_cols.set(this, void 0);
        _TableRenderer_cells.set(this, void 0);
        __classPrivateFieldSet(this, _TableRenderer_rows, rows, "f");
        __classPrivateFieldSet(this, _TableRenderer_cols, cols, "f");
        __classPrivateFieldSet(this, _TableRenderer_cells, [], "f");
        for (let i = 0; i < rows; i++) {
            const table_row = document.createElement('tr');
            __classPrivateFieldGet(this, _TableRenderer_cells, "f")[i] = [];
            for (let j = 0; j < cols; j++) {
                const cell_renderer = new TableCellRenderer(i, j);
                cell_renderer.setParent(table_row);
                __classPrivateFieldGet(this, _TableRenderer_cells, "f")[i][j] = cell_renderer;
            }
            table.appendChild(table_row);
        }
    }
    getCell(row, col) {
        if (row >= __classPrivateFieldGet(this, _TableRenderer_rows, "f") || row < 0 || col >= __classPrivateFieldGet(this, _TableRenderer_cols, "f") || col < 0) {
            throw new Error(`Invalid cell at (${row}, ${col})`);
        }
        return __classPrivateFieldGet(this, _TableRenderer_cells, "f")[row][col];
    }
    getElement() {
        return super.getElement();
    }
}
_TableRenderer_rows = new WeakMap(), _TableRenderer_cols = new WeakMap(), _TableRenderer_cells = new WeakMap();
class ListRenderer extends Renderer {
    constructor(...items) {
        const ul = document.createElement('ul');
        super(ul);
        _ListRenderer_items.set(this, void 0);
        __classPrivateFieldSet(this, _ListRenderer_items, [], "f");
        items.forEach(item => {
            __classPrivateFieldGet(this, _ListRenderer_items, "f").push(item);
            const li = document.createElement('li');
            item.setParent(li);
            ul.appendChild(li);
        });
    }
    getElement() {
        return super.getElement();
    }
    getLength() {
        return __classPrivateFieldGet(this, _ListRenderer_items, "f").length;
    }
    push(item) {
        __classPrivateFieldGet(this, _ListRenderer_items, "f").push(item);
        const ul = this.getElement();
        const li = document.createElement('li');
        item.setParent(li);
        ul.appendChild(li);
    }
    at(index) {
        if (index < 0 || index >= __classPrivateFieldGet(this, _ListRenderer_items, "f").length) {
            throw new Error("Invalid index.");
        }
        return __classPrivateFieldGet(this, _ListRenderer_items, "f")[index];
    }
    map(callback) {
        return __classPrivateFieldGet(this, _ListRenderer_items, "f").map(callback);
    }
    forEach(callback) {
        __classPrivateFieldGet(this, _ListRenderer_items, "f").forEach(callback);
    }
    filter(callback) {
        return __classPrivateFieldGet(this, _ListRenderer_items, "f").filter(callback);
    }
    swap(index1, index2) {
        if (index1 === index2)
            return;
        // Swap in array
        const s = __classPrivateFieldGet(this, _ListRenderer_items, "f");
        if (index1 < 0 || index2 < 0 ||
            index1 >= s.length ||
            index2 >= s.length) {
            throw new Error("Invalid indices.");
        }
        let temp = s[index1];
        s[index1] = s[index2];
        s[index2] = temp;
        // Swap in DOM
        const ul = this.getElement();
        const li1 = ul.children[index1];
        const li2 = ul.children[index2];
        if (li1 && li2) {
            const next = li2.nextSibling; // Store next sibling for correct insertion order
            ul.insertBefore(li2, li1);
            if (next) {
                ul.insertBefore(li1, next);
            }
            else {
                ul.appendChild(li1); // If li2 was last, append li1 at the end
            }
        }
    }
    removeItem(item) {
        const index = __classPrivateFieldGet(this, _ListRenderer_items, "f").indexOf(item);
        if (index !== -1) {
            __classPrivateFieldGet(this, _ListRenderer_items, "f").splice(index, 1);
            item.remove();
        }
    }
    removeAtIndex(index, range) {
        if (index < 0 || range < 0 || index + range > __classPrivateFieldGet(this, _ListRenderer_items, "f").length) {
            throw new Error("Invalid range.");
        }
        __classPrivateFieldGet(this, _ListRenderer_items, "f").splice(index, range).forEach(item => { item.remove(); });
    }
    empty() {
        __classPrivateFieldGet(this, _ListRenderer_items, "f").forEach(item => {
            item.remove();
        });
        __classPrivateFieldGet(this, _ListRenderer_items, "f").splice(0, Infinity);
    }
    remove() {
        this.empty();
        super.remove();
    }
}
_ListRenderer_items = new WeakMap();
class TooltipRenderer extends Renderer {
}
class DraggableRenderer extends Renderer {
}
