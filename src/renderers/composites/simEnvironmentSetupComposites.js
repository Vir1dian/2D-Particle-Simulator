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
var _EnvironmentSetupRenderer_simulation, _EnvironmentSetupRenderer_input_table, _EnvironmentSetupRenderer_apply_button, _PresetInputRenderer_simulation, _PresetInputRenderer_preset_dropdown, _PresetInputRenderer_apply_button;
/**
 * Helper class for EnvironmentPanelRenderer.
 * Handles user inputs and sends changes to
 * Simulation's #environment property as a
 * partial preset object.
 */
class EnvironmentSetupRenderer extends Renderer {
    constructor(simulation) {
        const environment_setup_wrapper = document.createElement('div');
        super(environment_setup_wrapper, '', 'simsetup_global_variables_wrapper');
        _EnvironmentSetupRenderer_simulation.set(this, void 0);
        _EnvironmentSetupRenderer_input_table.set(this, void 0);
        _EnvironmentSetupRenderer_apply_button.set(this, void 0);
        // Saved Data
        simulation.add_observer(SimEvent.Update_Environment, this.refresh.bind(this));
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_simulation, simulation, "f");
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_input_table, new InputTableRenderer(simulation.getEnvironment().statics), "f"); // statics for now because dynamics is still empty
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_apply_button, new ButtonRenderer(this.submitChanges.bind(this)), "f"); // Manual config of submitButton so setPreset is used explicitly
        // Content
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_input_table, "f").setParent(environment_setup_wrapper);
        const buttons_wrapper = document.createElement('div');
        buttons_wrapper.id = "simsetup_env_button_wrapper";
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_apply_button, "f").getElement().textContent = "Apply Changes";
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_apply_button, "f").setParent(buttons_wrapper);
        environment_setup_wrapper.appendChild(buttons_wrapper);
    }
    submitChanges() {
        const changes = {
            environment: {
                statics: __classPrivateFieldGet(this, _EnvironmentSetupRenderer_input_table, "f").prepareChanges(),
                dynamics: {}
            }
        };
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_simulation, "f").setPreset(changes);
        console.log(__classPrivateFieldGet(this, _EnvironmentSetupRenderer_simulation, "f").getEnvironment());
    }
    getTable() {
        return __classPrivateFieldGet(this, _EnvironmentSetupRenderer_input_table, "f");
    }
    refresh() {
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_input_table, "f").refresh();
    }
    remove() {
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_input_table, "f").remove();
        __classPrivateFieldGet(this, _EnvironmentSetupRenderer_apply_button, "f").remove();
        super.remove();
    }
}
_EnvironmentSetupRenderer_simulation = new WeakMap(), _EnvironmentSetupRenderer_input_table = new WeakMap(), _EnvironmentSetupRenderer_apply_button = new WeakMap();
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
