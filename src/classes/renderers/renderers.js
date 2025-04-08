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
var _Renderer_element, _Renderer_classname, _Renderer_id, _ButtonRenderer_callback, _ButtonRenderer_event, _DialogRenderer_open_button, _DialogRenderer_close_button, _DialogRenderer_content_wrapper, _TableCellRenderer_row, _TableCellRenderer_col, _TableCellRenderer_content, _TableRenderer_rows, _TableRenderer_cols, _TableRenderer_cells, _ListRenderer_items, _OptionRenderer_value, _OptionRenderer_label, _SelectRenderer_options, _SelectRenderer_selected, _SelectRenderer_name, _SelectRenderer_label_element, _InputRenderer_value, _InputRenderer_name, _InputRenderer_is_disabled, _InputRenderer_label_element, _DatalistInputRenderer_data, _DatalistInputRenderer_datalist_element;
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
/**
 *
 */
class TableCellRenderer extends Renderer {
    constructor(row, col) {
        const cell = document.createElement('td');
        super(cell);
        _TableCellRenderer_row.set(this, void 0);
        _TableCellRenderer_col.set(this, void 0);
        _TableCellRenderer_content.set(this, void 0);
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
    setParent(parent) {
        throw new Error("Cannot append TableCellRenderer to a parent. Manipulate through TableRenderer instead.");
    }
    setContent(content) {
        const cell = this.getElement();
        cell.innerHTML = ''; // Clear previous content
        if (typeof content === 'string') {
            cell.textContent = content;
        }
        else if (content instanceof HTMLElement) {
            cell.appendChild(content);
        }
        else if (content instanceof Renderer) {
            cell.appendChild(content.getElement());
        }
        __classPrivateFieldSet(this, _TableCellRenderer_content, content, "f");
    }
    getContent() {
        return __classPrivateFieldGet(this, _TableCellRenderer_content, "f");
    }
    remove() {
        if (__classPrivateFieldGet(this, _TableCellRenderer_content, "f") instanceof Renderer)
            __classPrivateFieldGet(this, _TableCellRenderer_content, "f").remove();
        else if (__classPrivateFieldGet(this, _TableCellRenderer_content, "f") instanceof HTMLElement)
            __classPrivateFieldGet(this, _TableCellRenderer_content, "f").remove();
        super.remove();
    }
}
_TableCellRenderer_row = new WeakMap(), _TableCellRenderer_col = new WeakMap(), _TableCellRenderer_content = new WeakMap();
/**
 * Stores a HTMLTableElement, maintains a
 * 2D array of TableCellRenderers. Is
 * static, cannot modify dimensions
 * after instantiation.
 */
class TableRenderer extends Renderer {
    constructor(rows = 1, cols = 1) {
        if (rows < 1 || cols < 1) {
            throw new Error('Invalid table dimensions');
        }
        const table = document.createElement('table');
        super(table);
        _TableRenderer_rows.set(this, void 0);
        _TableRenderer_cols.set(this, void 0);
        _TableRenderer_cells.set(this, void 0); // Allow any type of renderer and maintain polymorphism
        __classPrivateFieldSet(this, _TableRenderer_rows, rows, "f");
        __classPrivateFieldSet(this, _TableRenderer_cols, cols, "f");
        __classPrivateFieldSet(this, _TableRenderer_cells, [], "f");
        for (let i = 0; i < rows; i++) {
            const table_row = document.createElement('tr');
            __classPrivateFieldGet(this, _TableRenderer_cells, "f")[i] = [];
            for (let j = 0; j < cols; j++) {
                const cell_renderer = new TableCellRenderer(i, j);
                table_row.appendChild(cell_renderer.getElement());
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
    remove() {
        for (let i = 0; i < __classPrivateFieldGet(this, _TableRenderer_rows, "f"); i++) {
            for (let j = 0; j < __classPrivateFieldGet(this, _TableRenderer_cols, "f"); j++) {
                __classPrivateFieldGet(this, _TableRenderer_cells, "f")[i][j].remove();
            }
            __classPrivateFieldGet(this, _TableRenderer_cells, "f")[i].length = 0;
        }
        __classPrivateFieldGet(this, _TableRenderer_cells, "f").length = 0;
        super.remove();
    }
}
_TableRenderer_rows = new WeakMap(), _TableRenderer_cols = new WeakMap(), _TableRenderer_cells = new WeakMap();
class ListRenderer extends Renderer {
    constructor(...items) {
        // if (items.length <= 0) {
        //   throw new Error("Empty spread operator argument");
        // }
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
        if (items.length <= 0) {
            ul.style.display = "none";
        }
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
        ul.style.display = "";
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
            if (__classPrivateFieldGet(this, _ListRenderer_items, "f").length <= 0) {
                this.getElement().style.display = "none";
            }
            item.remove();
        }
    }
    removeAtIndex(index, range) {
        if (index < 0 || range < 0 || index + range > __classPrivateFieldGet(this, _ListRenderer_items, "f").length) {
            throw new Error("Invalid range.");
        }
        if (__classPrivateFieldGet(this, _ListRenderer_items, "f").length <= 0) {
            this.getElement().style.display = "none";
        }
        __classPrivateFieldGet(this, _ListRenderer_items, "f").splice(index, range).forEach(item => { item.remove(); });
    }
    empty() {
        __classPrivateFieldGet(this, _ListRenderer_items, "f").forEach(item => item.remove());
        __classPrivateFieldGet(this, _ListRenderer_items, "f").length = 0;
        this.getElement().style.display = "none";
    }
    remove() {
        this.empty();
        super.remove();
    }
}
_ListRenderer_items = new WeakMap();
class OptionRenderer extends Renderer {
    constructor(value, label) {
        const option = document.createElement('option');
        super(option);
        _OptionRenderer_value.set(this, void 0);
        _OptionRenderer_label.set(this, void 0);
        __classPrivateFieldSet(this, _OptionRenderer_value, value, "f");
        __classPrivateFieldSet(this, _OptionRenderer_label, label ? label : value, "f");
        option.value = __classPrivateFieldGet(this, _OptionRenderer_value, "f");
        option.innerHTML = __classPrivateFieldGet(this, _OptionRenderer_label, "f");
    }
    getElement() {
        return super.getElement();
    }
    getValue() {
        return __classPrivateFieldGet(this, _OptionRenderer_value, "f");
    }
    getLabel() {
        return __classPrivateFieldGet(this, _OptionRenderer_label, "f");
    }
    setChild(child) {
        throw new Error("setChild() not allowed for OptionRenderer.");
    }
    setParent(parent) {
        super.setParent(parent);
    }
}
_OptionRenderer_value = new WeakMap(), _OptionRenderer_label = new WeakMap();
class SelectRenderer extends Renderer {
    constructor(id, options, selected_value = "", name = "") {
        const select = document.createElement('select');
        select.name = name;
        super(select, "", id); // id required for label elements
        _SelectRenderer_options.set(this, void 0);
        _SelectRenderer_selected.set(this, void 0);
        _SelectRenderer_name.set(this, void 0);
        _SelectRenderer_label_element.set(this, void 0); // appended manually within the DOM, but not required
        // Creates a trivial option at the start, intended to persist until the renderer is removed
        __classPrivateFieldSet(this, _SelectRenderer_options, [new OptionRenderer("", ""), ...options], "f");
        options.forEach(option => {
            option.setParent(this);
        });
        __classPrivateFieldSet(this, _SelectRenderer_selected, this.resolveSelectedValue(selected_value), "f");
        __classPrivateFieldSet(this, _SelectRenderer_name, name, "f");
        select.value = __classPrivateFieldGet(this, _SelectRenderer_selected, "f").getValue();
        select.addEventListener("change", () => {
            __classPrivateFieldSet(this, _SelectRenderer_selected, __classPrivateFieldGet(this, _SelectRenderer_options, "f")[this.getOptionIndex(this.getElement().value)], "f");
        });
        const label = document.createElement('label');
        label.htmlFor = id;
        __classPrivateFieldSet(this, _SelectRenderer_label_element, label, "f");
    }
    resolveSelectedValue(selected_value) {
        // Returns the first available option or undefined if the selected_value does not exist among options
        const selected_option = __classPrivateFieldGet(this, _SelectRenderer_options, "f").find(option => option.getValue() === selected_value);
        if (selected_option)
            return selected_option;
        return __classPrivateFieldGet(this, _SelectRenderer_options, "f")[0];
    }
    // getters
    getElement() {
        return super.getElement();
    }
    getOptions() {
        return __classPrivateFieldGet(this, _SelectRenderer_options, "f");
    }
    getSelectedOption() {
        return __classPrivateFieldGet(this, _SelectRenderer_selected, "f");
    }
    getName() {
        return __classPrivateFieldGet(this, _SelectRenderer_name, "f");
    }
    getLabelElement() {
        return __classPrivateFieldGet(this, _SelectRenderer_label_element, "f");
    }
    getOptionIndex(value) {
        return __classPrivateFieldGet(this, _SelectRenderer_options, "f").findIndex(option => option.getValue() === value);
    }
    // setters
    setChild(child) {
        // Prevents setChild from being used for an SelectRenderer
        throw new Error("setChild() not allowed for SelectRenderer, use addOption().");
    }
    setName(name) {
        __classPrivateFieldSet(this, _SelectRenderer_name, name, "f");
        this.getElement().name = name;
    }
    setID(id) {
        super.setID(id);
        __classPrivateFieldGet(this, _SelectRenderer_label_element, "f").htmlFor = id;
    }
    addOption(option) {
        if (this.getOptionIndex(option.getValue()) !== -1)
            throw new Error("Value already exists in select.");
        __classPrivateFieldGet(this, _SelectRenderer_options, "f").push(option);
        option.setParent(this);
    }
    removeOption(option) {
        const index = this.getOptionIndex(option.getValue());
        if (index < 1)
            return;
        __classPrivateFieldGet(this, _SelectRenderer_options, "f")[index].remove();
        __classPrivateFieldGet(this, _SelectRenderer_options, "f").splice(index, 1);
        if (__classPrivateFieldGet(this, _SelectRenderer_selected, "f") === option) {
            // Sets the selected option to the first nontrivial option if possible, if it was deleted.
            __classPrivateFieldSet(this, _SelectRenderer_selected, __classPrivateFieldGet(this, _SelectRenderer_options, "f").length > 1 ? __classPrivateFieldGet(this, _SelectRenderer_options, "f")[1] : __classPrivateFieldGet(this, _SelectRenderer_options, "f")[0], "f");
            this.getElement().value = __classPrivateFieldGet(this, _SelectRenderer_selected, "f").getValue();
        }
    }
    empty() {
        __classPrivateFieldGet(this, _SelectRenderer_options, "f").slice(1).forEach(option => option.remove());
        __classPrivateFieldGet(this, _SelectRenderer_options, "f").splice(1, Infinity);
    }
    remove() {
        __classPrivateFieldGet(this, _SelectRenderer_options, "f").length = 0;
        __classPrivateFieldGet(this, _SelectRenderer_selected, "f").remove();
        __classPrivateFieldGet(this, _SelectRenderer_label_element, "f").remove();
        super.remove();
    }
}
_SelectRenderer_options = new WeakMap(), _SelectRenderer_selected = new WeakMap(), _SelectRenderer_name = new WeakMap(), _SelectRenderer_label_element = new WeakMap();
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
class DatalistInputRenderer extends InputRenderer {
    constructor(id, data, data_id) {
        super(id);
        // Note, datalists only require option elements with set values, no need for inner text labels
        _DatalistInputRenderer_data.set(this, void 0);
        _DatalistInputRenderer_datalist_element.set(this, void 0);
        const datalist = document.createElement("datalist");
        datalist.id = data_id;
        this.getElement().setAttribute("list", data_id);
        data.forEach(option => option.setParent(datalist));
        __classPrivateFieldSet(this, _DatalistInputRenderer_data, data, "f");
        __classPrivateFieldSet(this, _DatalistInputRenderer_datalist_element, datalist, "f");
    }
    setParent(parent) {
        super.setParent(parent);
        if (parent instanceof HTMLElement)
            parent.appendChild(__classPrivateFieldGet(this, _DatalistInputRenderer_datalist_element, "f"));
        else
            parent.getElement().appendChild(__classPrivateFieldGet(this, _DatalistInputRenderer_datalist_element, "f"));
    }
    getDatalist() {
        return __classPrivateFieldGet(this, _DatalistInputRenderer_data, "f");
    }
    getDatalistElement() {
        return __classPrivateFieldGet(this, _DatalistInputRenderer_datalist_element, "f");
    }
    getOptionIndex(value) {
        return __classPrivateFieldGet(this, _DatalistInputRenderer_data, "f").findIndex(option => option.getValue() === value);
    }
    addOption(option) {
        if (this.getOptionIndex(option.getValue()) !== -1)
            throw new Error("Value already exists in datalist.");
        __classPrivateFieldGet(this, _DatalistInputRenderer_data, "f").push(option);
        option.setParent(__classPrivateFieldGet(this, _DatalistInputRenderer_datalist_element, "f"));
    }
    removeOption(option) {
        const index = this.getOptionIndex(option.getValue());
        if (index < 0)
            return;
        __classPrivateFieldGet(this, _DatalistInputRenderer_data, "f")[index].remove();
        __classPrivateFieldGet(this, _DatalistInputRenderer_data, "f").splice(index, 1);
    }
    empty() {
        __classPrivateFieldGet(this, _DatalistInputRenderer_data, "f").forEach(option => option.remove());
        __classPrivateFieldGet(this, _DatalistInputRenderer_data, "f").length = 0;
    }
    remove() {
        this.empty();
        __classPrivateFieldGet(this, _DatalistInputRenderer_datalist_element, "f").remove();
        super.remove();
    }
}
_DatalistInputRenderer_data = new WeakMap(), _DatalistInputRenderer_datalist_element = new WeakMap();
class TooltipRenderer extends Renderer {
}
class DraggableRenderer extends Renderer {
}
