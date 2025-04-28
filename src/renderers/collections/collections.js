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
var _TableCellRenderer_row, _TableCellRenderer_col, _TableCellRenderer_content, _TableRenderer_rows, _TableRenderer_cols, _TableRenderer_cells, _ListRenderer_items, _OptionRenderer_value, _OptionRenderer_label, _SelectRenderer_options, _SelectRenderer_selected, _SelectRenderer_name, _SelectRenderer_label_element, _DatalistInputRenderer_data, _DatalistInputRenderer_datalist_element, _InputTableRenderer_properties, _InputTableRenderer_overrides, _InputTableRenderer_inputs, _InputTableRenderer_override_callbacks;
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
    addRow() {
        var _a;
        __classPrivateFieldSet(this, _TableRenderer_rows, (_a = __classPrivateFieldGet(this, _TableRenderer_rows, "f"), _a++, _a), "f");
        const table_row_element = document.createElement('tr');
        const table_row_renderers = [];
        for (let j = 0; j < __classPrivateFieldGet(this, _TableRenderer_cols, "f"); j++) {
            const cell_renderer = new TableCellRenderer(__classPrivateFieldGet(this, _TableRenderer_rows, "f") - 1, j);
            table_row_element.appendChild(cell_renderer.getElement());
            table_row_renderers.push(cell_renderer);
        }
        this.getElement().appendChild(table_row_element);
        __classPrivateFieldGet(this, _TableRenderer_cells, "f").push(table_row_renderers);
    }
    addColumn() {
        var _a;
        __classPrivateFieldSet(this, _TableRenderer_cols, (_a = __classPrivateFieldGet(this, _TableRenderer_cols, "f"), _a++, _a), "f");
        for (let i = 0; i < __classPrivateFieldGet(this, _TableRenderer_rows, "f"); i++) {
            const cell_renderer = new TableCellRenderer(i, __classPrivateFieldGet(this, _TableRenderer_cols, "f") - 1);
            this.getElement().rows[i].appendChild(cell_renderer.getElement());
            __classPrivateFieldGet(this, _TableRenderer_cells, "f")[i].push(cell_renderer);
        }
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
    find(callback) {
        const item = __classPrivateFieldGet(this, _ListRenderer_items, "f").find(callback);
        if (item === undefined)
            throw new Error("ListRenderer: item not found.");
        return item;
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
            const li = item.getElement().parentElement;
            __classPrivateFieldGet(this, _ListRenderer_items, "f").splice(index, 1);
            if (__classPrivateFieldGet(this, _ListRenderer_items, "f").length <= 0) {
                this.getElement().style.display = "none";
            }
            item.remove();
            li.remove();
        }
    }
    removeAtIndex(index, range) {
        if (index < 0 || range < 0 || index + range > __classPrivateFieldGet(this, _ListRenderer_items, "f").length) {
            throw new Error("Invalid range.");
        }
        __classPrivateFieldGet(this, _ListRenderer_items, "f").splice(index, range).forEach(item => {
            const li = item.getElement().parentElement;
            item.remove();
            li.remove();
        });
        if (__classPrivateFieldGet(this, _ListRenderer_items, "f").length <= 0) {
            this.getElement().style.display = "none";
        }
    }
    empty() {
        __classPrivateFieldGet(this, _ListRenderer_items, "f").forEach(item => {
            var _a;
            (_a = item.getElement().parentElement) === null || _a === void 0 ? void 0 : _a.remove();
            item.remove();
        });
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
        __classPrivateFieldSet(this, _SelectRenderer_options, options, "f");
        if (options.length <= 0)
            __classPrivateFieldSet(this, _SelectRenderer_options, [new OptionRenderer("", "")], "f");
        options.forEach(option => {
            option.setParent(this);
        });
        __classPrivateFieldSet(this, _SelectRenderer_selected, this.resolveSelectedValue(selected_value), "f");
        __classPrivateFieldSet(this, _SelectRenderer_name, name, "f");
        select.value = __classPrivateFieldGet(this, _SelectRenderer_selected, "f").getValue();
        const label = document.createElement('label');
        label.htmlFor = id;
        __classPrivateFieldSet(this, _SelectRenderer_label_element, label, "f");
    }
    resolveSelectedValue(selected_value) {
        var _a;
        // Returns the first available option or undefined if the selected_value does not exist among options
        return (_a = __classPrivateFieldGet(this, _SelectRenderer_options, "f").find(option => option.getValue() === selected_value)) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _SelectRenderer_options, "f")[0];
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
    setSelected(index) {
        if (index < 0 || index >= __classPrivateFieldGet(this, _SelectRenderer_options, "f").length)
            throw new Error("Index out of bounds.");
        __classPrivateFieldSet(this, _SelectRenderer_selected, __classPrivateFieldGet(this, _SelectRenderer_options, "f")[index], "f");
        this.getElement().value = __classPrivateFieldGet(this, _SelectRenderer_selected, "f").getValue();
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
        if (__classPrivateFieldGet(this, _SelectRenderer_options, "f").length === 1 && __classPrivateFieldGet(this, _SelectRenderer_options, "f")[0].getValue() === "") {
            __classPrivateFieldGet(this, _SelectRenderer_options, "f")[0].remove();
            __classPrivateFieldGet(this, _SelectRenderer_options, "f").splice(0, 1);
        }
        __classPrivateFieldGet(this, _SelectRenderer_options, "f").push(option);
        option.setParent(this);
        this.setSelected(this.getOptionIndex(option.getValue()));
    }
    removeOption(option) {
        const index = this.getOptionIndex(typeof option === 'string' ? option : option.getValue());
        if (index < 0)
            return;
        __classPrivateFieldGet(this, _SelectRenderer_options, "f")[index].remove();
        __classPrivateFieldGet(this, _SelectRenderer_options, "f").splice(index, 1);
        if (__classPrivateFieldGet(this, _SelectRenderer_options, "f").length <= 0) {
            this.addOption(new OptionRenderer("", ""));
        }
        if (__classPrivateFieldGet(this, _SelectRenderer_selected, "f") === option) {
            __classPrivateFieldSet(this, _SelectRenderer_selected, __classPrivateFieldGet(this, _SelectRenderer_options, "f")[0], "f");
            this.getElement().value = __classPrivateFieldGet(this, _SelectRenderer_selected, "f").getValue();
        }
    }
    refresh() {
        __classPrivateFieldSet(this, _SelectRenderer_selected, __classPrivateFieldGet(this, _SelectRenderer_options, "f")[this.getOptionIndex(this.getElement().value)], "f");
    }
    empty(completely = false) {
        __classPrivateFieldGet(this, _SelectRenderer_options, "f").forEach(option => option.remove());
        __classPrivateFieldGet(this, _SelectRenderer_options, "f").length = 0;
        if (!completely)
            this.addOption(new OptionRenderer("", ""));
    }
    remove() {
        this.empty(true);
        __classPrivateFieldGet(this, _SelectRenderer_label_element, "f").remove();
        super.remove();
    }
}
_SelectRenderer_options = new WeakMap(), _SelectRenderer_selected = new WeakMap(), _SelectRenderer_name = new WeakMap(), _SelectRenderer_label_element = new WeakMap();
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
/**
 * Handles a table of inputs for a string record-type object.
 * Left column contains prettified key names of the object,
 * right column contains input fields for matching value
 * data types. Additional columns can be added for boolean
 * overrides such as 'random' and 'unspecified'. Stores a
 * record object for read-only operations, and a map of
 * renderer arrays for inputs.
 *
 * ID parameter is required to prevent duplicate input ID's.
 * Allows an optional header, must be specified even when using
 * boolean overrides.
 *
 * Boolean overrides are specifically intended for the
 * ParticleGrouping interface structure. The rightmost
 * override has the highest priority, disabling the inputs
 * to its left when checked.
 */
class InputTableRenderer extends TableRenderer {
    constructor(id, properties, has_header = false, ...boolean_overrides) {
        const property_keys = Object.keys(properties);
        const unique_overrides = [...new Set(boolean_overrides)];
        super(property_keys.length + (has_header ? 1 : 0), 2 + unique_overrides.length);
        _InputTableRenderer_properties.set(this, void 0); // Assume all properties are defined and not set to 'random'
        _InputTableRenderer_overrides.set(this, void 0);
        _InputTableRenderer_inputs.set(this, void 0);
        // #validators: Record<string, (value: T) => true | string>;  // For the future, for more advanced error handling
        _InputTableRenderer_override_callbacks.set(this, void 0);
        this.setID(id);
        __classPrivateFieldSet(this, _InputTableRenderer_properties, structuredCloneCustom(properties), "f");
        __classPrivateFieldSet(this, _InputTableRenderer_overrides, unique_overrides, "f");
        __classPrivateFieldSet(this, _InputTableRenderer_inputs, new Map(), "f");
        __classPrivateFieldSet(this, _InputTableRenderer_override_callbacks, new Map(), "f");
        property_keys.forEach((key, index) => {
            const value = properties[key];
            const row = index + (has_header ? 1 : 0);
            let input;
            if (typeof value === 'string')
                input = new InputRenderer(`${INPUT_PREFIX}${key}_of_${id}`, value);
            else if (typeof value === 'boolean')
                input = new CheckboxInputRenderer(`${INPUT_PREFIX}${key}_of_${id}`, value);
            else if (typeof value === 'number')
                input = new NumberInputRenderer(`${INPUT_PREFIX}${key}_of_${id}`, value);
            else if (value instanceof Vector2D)
                input = new Vector2DInputRenderer(`${INPUT_PREFIX}${key}_of_${id}`, value);
            input.getLabelElement().innerText = prettifyKey(key);
            this.getCell(row, 0).setContent(input.getLabelElement());
            this.getCell(row, 1).setContent(input);
            const override_inputs = []; // May may expand "override_inputs" to "modifier_inputs" in the future to allow non-overriding and non-boolean inputs
            unique_overrides.forEach((override, column) => {
                const override_input = new CheckboxInputRenderer(`${INPUT_PREFIX}${key}_${override}_override_of_${id}`);
                this.setOverrideCallback(key, override_input, [input, ...override_inputs]);
                override_inputs.push(override_input);
                const cell = this.getCell(row, 2 + column);
                cell.setContent(override_input);
                if (has_header) {
                    this.getCell(0, 2 + column).setContent(prettifyKey(override)); // header row
                    cell.getElement().style.textAlign = 'center';
                }
            });
            __classPrivateFieldGet(this, _InputTableRenderer_inputs, "f").set(key, [input, ...override_inputs]);
        });
    }
    applyOverride(override_input, left_inputs) {
        const is_checked = override_input.getBooleanValue();
        left_inputs.forEach(input => {
            if (input instanceof InputRenderer) {
                if (is_checked && !input.isDisabled())
                    input.toggleDisabled();
                else if (!is_checked && input.isDisabled())
                    input.toggleDisabled();
            }
            else if (input instanceof Vector2DInputRenderer) {
                if (is_checked && !input.isDisabled())
                    input.toggleDisabled();
                else if (!is_checked && input.isDisabled())
                    input.toggleDisabled();
            }
        });
    }
    setOverrideCallback(key, override_input, left_inputs) {
        const callback = () => this.applyOverride(override_input, left_inputs);
        override_input.getElement().addEventListener('change', callback);
        const existing_overrides = __classPrivateFieldGet(this, _InputTableRenderer_override_callbacks, "f").get(key); // Overrides for a key may be 'random', 'unspecified', and potentially more
        if (existing_overrides)
            existing_overrides.push(() => {
                override_input.getElement().removeEventListener('change', callback);
            });
        else
            __classPrivateFieldGet(this, _InputTableRenderer_override_callbacks, "f").set(key, [() => {
                    override_input.getElement().removeEventListener('change', callback); // Saves the remove function for easy removal later
                }]);
    }
    prepareChanges() {
        const changes = {};
        for (const [key, inputs] of __classPrivateFieldGet(this, _InputTableRenderer_inputs, "f")) {
            let is_unspecified = false; // highest override
            let is_random = false;
            inputs.forEach(input => {
                input.refreshValue();
                if (input.getElement().id.includes('_random_override') && input.getBooleanValue()) {
                    changes[key] = 'random';
                    is_random = true;
                }
                ;
                if (input.getElement().id.includes('_unspecified_override') && input.getBooleanValue()) {
                    is_unspecified = true;
                    delete changes[key];
                }
                ;
            });
            if (is_unspecified)
                continue;
            if (is_random)
                continue;
            if (inputs[0] instanceof NumberInputRenderer)
                changes[key] = inputs[0].getNumberValue();
            else if (inputs[0] instanceof CheckboxInputRenderer)
                changes[key] = inputs[0].getBooleanValue();
            else if (inputs[0] instanceof InputRenderer)
                changes[key] = inputs[0].getValue();
            else if (inputs[0] instanceof Vector2DInputRenderer)
                changes[key] = inputs[0].getValue();
        }
        return changes;
    }
    refresh() {
        for (const [key, inputs] of __classPrivateFieldGet(this, _InputTableRenderer_inputs, "f")) {
            for (let i = inputs.length - 1; i >= 0; i--) {
                const input = inputs[i];
                if (input.getElement().id.includes('_unspecified_override')) {
                    if (__classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key] === undefined) {
                        input.setValue("true");
                        this.applyOverride(input, inputs.slice(0, i));
                        break;
                    }
                    this.applyOverride(input, inputs.slice(0, i));
                    input.setValue("false");
                }
                else if (input.getElement().id.includes('_random_override')) {
                    if (__classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key] === 'random') {
                        input.setValue("true");
                        this.applyOverride(input, inputs.slice(0, i));
                        break;
                    }
                    this.applyOverride(input, inputs.slice(0, i));
                    input.setValue("false");
                }
                else if (input instanceof NumberInputRenderer)
                    input.setValue(__classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key].toString());
                else if (input instanceof CheckboxInputRenderer)
                    input.setValue(__classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key] ? "true" : "false");
                else if (input instanceof InputRenderer)
                    input.setValue(__classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key]);
                else if (input instanceof Vector2DInputRenderer)
                    input.setValue(__classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key]);
                else
                    throw new Error("InputTableRenderer failed to refresh an input.");
            }
        }
    }
    setNumberInputBounds(...bounds_definitions) {
        bounds_definitions.forEach(definition => {
            const input = __classPrivateFieldGet(this, _InputTableRenderer_inputs, "f").get(definition.key)[0];
            if (!input) {
                throw new Error("setNumberInputBounds: Input key not found.");
            }
            else if (input instanceof NumberInputRenderer && 'min' in definition && typeof definition.min !== 'object') {
                input.setBounds(definition.min, definition.max);
            }
            else if (input instanceof Vector2DInputRenderer && 'min' in definition && typeof definition.min === 'object') {
                input.getInputX().setBounds(definition.min.x, definition.max.x);
                input.getInputY().setBounds(definition.min.y, definition.max.y);
            }
            else
                throw new Error("setNumberInputBounds: Invalid input type.");
        });
    }
    setProperties(properties) {
        Object.keys(__classPrivateFieldGet(this, _InputTableRenderer_properties, "f")).forEach(key => {
            const new_value = properties[key];
            if (new_value === undefined) {
                if (__classPrivateFieldGet(this, _InputTableRenderer_overrides, "f").includes('unspecified'))
                    delete __classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key];
                else
                    throw new Error("setProperties: undefined key but 'unspecified' override not enabled.");
            }
            else if (new_value === 'random') {
                if (__classPrivateFieldGet(this, _InputTableRenderer_overrides, "f").includes('random'))
                    __classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key] = 'random';
                else
                    throw new Error("setProperties: key with value of 'random' but 'random' override not enabled.");
            }
            else if (new_value instanceof Vector2D && __classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key] instanceof Vector2D)
                __classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key] = new Vector2D(new_value.x, new_value.y);
            else if (typeof new_value === typeof __classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key])
                __classPrivateFieldGet(this, _InputTableRenderer_properties, "f")[key] = new_value;
            else
                throw new Error("setProperties: type mismatch.");
        });
        this.refresh();
    }
    remove() {
        for (const removers of __classPrivateFieldGet(this, _InputTableRenderer_override_callbacks, "f").values()) {
            removers.forEach(remove_callback => remove_callback());
        }
        __classPrivateFieldGet(this, _InputTableRenderer_override_callbacks, "f").clear();
        __classPrivateFieldGet(this, _InputTableRenderer_inputs, "f").clear();
        super.remove();
    }
}
_InputTableRenderer_properties = new WeakMap(), _InputTableRenderer_overrides = new WeakMap(), _InputTableRenderer_inputs = new WeakMap(), _InputTableRenderer_override_callbacks = new WeakMap();
