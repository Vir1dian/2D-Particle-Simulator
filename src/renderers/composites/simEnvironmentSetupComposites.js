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
var _EnvironmentSetupRenderer_simulation, _EnvironmentSetupRenderer_inputs, _EnvironmentSetupRenderer_input_table, _EnvironmentSetupRenderer_sumbit_button, _PresetInputRenderer_simulation, _PresetInputRenderer_preset_dropdown, _PresetInputRenderer_apply_button;
/**
 * Helper class for EnvironmentPanelRenderer.
 * Handles user inputs and sends changes to
 * Simulation's #environment property as a
 * partial preset object.
 */
class EnvironmentSetupRenderer extends Renderer {
    constructor(simulation) {
        const simulation_settings = document.createElement('div');
        super(simulation_settings, '', 'simsetup_global_variables_wrapper');
        _EnvironmentSetupRenderer_simulation.set(this, void 0);
        _EnvironmentSetupRenderer_inputs.set(this, void 0); // still have access to the inputs in this way
        _EnvironmentSetupRenderer_input_table.set(this, void 0);
        _EnvironmentSetupRenderer_sumbit_button.set(this, void 0);
        // Saved Data
        simulation.add_observer(SimEvent.Update_Environment, this.refreshInputs.bind(this));
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_simulation, simulation, "f");
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_inputs, new Map(), "f");
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_input_table, this.populateInputTable(), "f");
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_sumbit_button, new ButtonRenderer(this.submitChanges.bind(this)), "f");
        // Content
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_input_table, "f").setParent(simulation_settings);
        const buttons_wrapper = document.createElement('div');
        buttons_wrapper.id = "simsetup_env_button_wrapper";
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_sumbit_button, "f").getElement().textContent = "Apply Changes";
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_sumbit_button, "f").setParent(buttons_wrapper);
        simulation_settings.appendChild(buttons_wrapper);
    }
    populateInputTable() {
        const statics = __classPrivateFieldGet(this, _EnvironmentSetupRenderer_simulation, "f").getEnvironment().statics; // statics for now because dynamics is still empty
        if (!statics)
            return new TableRenderer();
        const env_setup_data = Object.keys(statics);
        // 1 extra row for table headings, 2 columns for labels and inputs
        const input_table = new TableRenderer(env_setup_data.length + 1, 2);
        env_setup_data.forEach((key, index) => {
            const value = statics[key];
            if (typeof value === 'number') {
                const input = new NumberInputRenderer(`input_id_${key}`, value);
                input.getLabelElement().innerText = prettifyKey(key);
                input_table.getCell(index, 0).setContent(input.getLabelElement());
                input_table.getCell(index, 1).setContent(input);
                __classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f").set(key, input);
            }
            else if (isObject(value) && "x" in value && "y" in value) {
                const input_x = new NumberInputRenderer(`input_x_id_${key}`, value.x);
                const input_y = new NumberInputRenderer(`input_y_id_${key}`, value.y);
                const input_wrapper = document.createElement('div');
                input_wrapper.className = "input_wrapper_xy";
                input_x.getLabelElement().innerText = "x:";
                input_y.getLabelElement().innerText = "y:";
                input_wrapper.appendChild(input_x.getLabelElement());
                input_x.setParent(input_wrapper);
                input_wrapper.appendChild(input_y.getLabelElement());
                input_y.setParent(input_wrapper);
                const label_xy = document.createElement('label');
                label_xy.htmlFor = `input_x_id_${key}`;
                label_xy.innerText = prettifyKey(key);
                input_table.getCell(index, 0).setContent(label_xy);
                input_table.getCell(index, 1).setContent(input_wrapper);
                __classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f").set(`${key}_x`, input_x);
                __classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f").set(`${key}_y`, input_y);
            }
        });
        return input_table;
    }
    submitChanges() {
        const statics = structuredClone(__classPrivateFieldGet(this, _EnvironmentSetupRenderer_simulation, "f").getEnvironment().statics); // statics for now because dynamics is still empty
        const changes = { environment: { statics: {}, dynamics: {} } };
        const input_keys = [...__classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f").keys()];
        // Properties of type Vector2D in this.#inputs are represented by two InputRenderers instead of one,
        // one for the x component, and the other for the y component, one after the other.
        for (let i = 0; i < input_keys.length; i++) {
            const key = input_keys[i];
            const input = __classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f").get(key);
            input.refreshValue();
            if (key.endsWith("_x")) { // Detect x component, y is always next
                const baseKey = key.slice(0, -2); // Remove "_x" to get the property name
                const next_input = __classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f").get(input_keys[++i]);
                next_input.refreshValue();
                const x = parseFloat(input.getValue());
                const y = parseFloat(next_input.getValue());
                if (statics[baseKey].x === x &&
                    statics[baseKey].y === y)
                    continue;
                if (!changes.environment)
                    continue;
                if (!changes.environment.statics)
                    continue;
                changes.environment.statics[baseKey] = { x, y };
            }
            else {
                const val = parseFloat(input.getValue());
                if (statics[key] === val)
                    continue;
                if (!changes.environment)
                    continue;
                if (!changes.environment.statics)
                    continue;
                changes.environment.statics[key] = val;
            }
        }
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_simulation, "f").setPreset(changes);
    }
    getInputs() {
        return __classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f");
    }
    getTable() {
        return __classPrivateFieldGet(this, _EnvironmentSetupRenderer_input_table, "f");
    }
    getSubmitButton() {
        return __classPrivateFieldGet(this, _EnvironmentSetupRenderer_sumbit_button, "f");
    }
    refreshInputs() {
        const statics = structuredClone(__classPrivateFieldGet(this, _EnvironmentSetupRenderer_simulation, "f").getEnvironment().statics); // statics for now because dynamics is still empty
        const input_keys = [...__classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f").keys()];
        // Properties of type Vector2D in this.#inputs are represented by two InputRenderers instead of one,
        // one for the x component, and the other for the y component, one after the other.
        for (let i = 0; i < input_keys.length; i++) {
            const key = input_keys[i];
            const input = __classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f").get(key);
            if (key.endsWith("_x")) { // Detect x component, y is always next
                const baseKey = key.slice(0, -2); // Remove "_x" to get the property name
                const next_input = __classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f").get(input_keys[++i]);
                const vector = statics[baseKey];
                input.setValue(vector.x.toString());
                next_input.setValue(vector.y.toString());
            }
            else {
                const scalar = statics[key];
                input.setValue(scalar.toString());
            }
        }
    }
    remove() {
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_inputs, "f").clear();
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_input_table, "f").remove();
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_sumbit_button, "f").remove();
        super.remove();
    }
}
_EnvironmentSetupRenderer_simulation = new WeakMap(), _EnvironmentSetupRenderer_inputs = new WeakMap(), _EnvironmentSetupRenderer_input_table = new WeakMap(), _EnvironmentSetupRenderer_sumbit_button = new WeakMap();
/**
 * Helper class for EnvironmentPanelRenderer.
 * Handles a DatalistInputRenderer to allow
 * user selection of existing Simulation
 * presets. Sends changes to Simulation's
 * properties as a preset object.
 */
class PresetInputRenderer extends Renderer {
    constructor(simulation) {
        const simulation_preset_input_wrapper = document.createElement('div');
        super(simulation_preset_input_wrapper, '', 'simsetup_presets_wrapper');
        _PresetInputRenderer_simulation.set(this, void 0);
        _PresetInputRenderer_preset_dropdown.set(this, void 0);
        _PresetInputRenderer_apply_button.set(this, void 0);
        __classPrivateFieldSet(this, _PresetInputRenderer_simulation, simulation, "f");
        // saved renderers
        __classPrivateFieldSet(this, _PresetInputRenderer_preset_dropdown, this.setupPresetDropdown(), "f");
        __classPrivateFieldSet(this, _PresetInputRenderer_apply_button, this.setupApplyButton(), "f");
        // contents
        __classPrivateFieldGet(this, _PresetInputRenderer_preset_dropdown, "f").setParent(simulation_preset_input_wrapper);
        __classPrivateFieldGet(this, _PresetInputRenderer_apply_button, "f").setParent(simulation_preset_input_wrapper);
    }
    setupPresetDropdown() {
        const preset_data = [];
        Object.keys(TEMPORARY_PRESETS).forEach((preset_name, preset) => {
            preset_data.push(new OptionRenderer(preset_name, ''));
        });
        const dropdown = new DatalistInputRenderer('simsetup_presets_input', preset_data, 'simsetup_presets');
        dropdown.getElement().placeholder = "Preset";
        return dropdown;
    }
    setupApplyButton() {
        const button = new ButtonRenderer(() => {
            __classPrivateFieldGet(this, _PresetInputRenderer_preset_dropdown, "f").refreshValue();
            const preset_name = __classPrivateFieldGet(this, _PresetInputRenderer_preset_dropdown, "f").getValue();
            const preset = TEMPORARY_PRESETS[preset_name];
            __classPrivateFieldGet(this, _PresetInputRenderer_simulation, "f").setPreset(preset);
        });
        button.setID('simsetup_presets_button');
        button.getElement().textContent = "Apply";
        return button;
    }
    remove() {
        __classPrivateFieldGet(this, _PresetInputRenderer_preset_dropdown, "f").remove();
        __classPrivateFieldGet(this, _PresetInputRenderer_apply_button, "f").remove();
        super.remove();
    }
}
_PresetInputRenderer_simulation = new WeakMap(), _PresetInputRenderer_preset_dropdown = new WeakMap(), _PresetInputRenderer_apply_button = new WeakMap();
