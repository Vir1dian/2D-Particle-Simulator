"use strict";
// Helper classes for SimulationRenderer, the ULTIMATE RENDERER!!!
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
var _UIControlRenderer_simulation, _EnvironmentPanelRenderer_simulation, _EnvironmentPanelRenderer_preset_handler, _EnvironmentPanelRenderer_environment_handler, _EnvironmentSetupRenderer_simulation, _EnvironmentSetupRenderer_inputs, _EnvironmentSetupRenderer_input_table, _EnvironmentSetupRenderer_sumbit_button, _PresetInputRenderer_simulation, _PresetInputRenderer_preset_dropdown, _PresetInputRenderer_apply_button, _ParticlePanelRenderer_simulation, _ParticlePanelRenderer_add_particles_dialog, _ParticlePanelRenderer_create_group_dialog, _ParticlePanelRenderer_group_list, _ParticleUnitGroupRenderer_particle_group, _ParticleUnitGroupRenderer_icon, _ParticleUnitGroupRenderer_details_dialog, _ParticleUnitGroupRenderer_drag_button, _ParticleUnitGroupRenderer_unit_list, _ParticleUnitRenderer_particle_renderer, _ParticleUnitRenderer_icon, _ParticleUnitRenderer_details_dialog, _ParticleUnitRenderer_drag_button, _ParticlePointRenderer_particle, _ParticlePointRenderer_container;
// UI Config Renderers -- May implement a separate UIHandler class from Simulation
class UIControlRenderer extends Renderer {
    // may create a UIConfig class soon
    constructor(simulation) {
        const ui_settings_element = document.createElement('div');
        super(ui_settings_element);
        // WIP: Will need methods to handle Simulation Class's calls
        _UIControlRenderer_simulation.set(this, void 0);
        __classPrivateFieldSet(this, _UIControlRenderer_simulation, simulation, "f");
    }
    remove() {
        super.remove();
    }
}
_UIControlRenderer_simulation = new WeakMap();
class EnvironmentPanelRenderer extends Renderer {
    constructor(simulation) {
        const environment_panel = document.createElement('article');
        super(environment_panel, 'control_item', 'control_simsetup');
        _EnvironmentPanelRenderer_simulation.set(this, void 0);
        _EnvironmentPanelRenderer_preset_handler.set(this, void 0);
        _EnvironmentPanelRenderer_environment_handler.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _EnvironmentPanelRenderer_simulation, simulation, "f");
        __classPrivateFieldSet(this, _EnvironmentPanelRenderer_preset_handler, new PresetInputRenderer(simulation), "f");
        __classPrivateFieldSet(this, _EnvironmentPanelRenderer_environment_handler, new EnvironmentSetupRenderer(simulation), "f");
        // HTML Content
        const header = document.createElement('header');
        header.innerHTML = "Environment Setup";
        environment_panel.appendChild(header);
        __classPrivateFieldGet(this, _EnvironmentPanelRenderer_preset_handler, "f").setParent(environment_panel);
        __classPrivateFieldGet(this, _EnvironmentPanelRenderer_environment_handler, "f").setParent(environment_panel);
    }
    remove() {
        __classPrivateFieldGet(this, _EnvironmentPanelRenderer_preset_handler, "f").remove();
        __classPrivateFieldGet(this, _EnvironmentPanelRenderer_environment_handler, "f").remove();
        super.remove();
    }
}
_EnvironmentPanelRenderer_simulation = new WeakMap(), _EnvironmentPanelRenderer_preset_handler = new WeakMap(), _EnvironmentPanelRenderer_environment_handler = new WeakMap();
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
// Particle Interface Renderers
/**
 * Helper class for SimulationRenderer
 * Handles ParticleUnitGroupRenderers which
 * collectively send changes to Simulation's
 * #particle_groups property.
 */
class ParticlePanelRenderer extends Renderer {
    constructor(simulation) {
        const particle_panel = document.createElement('article');
        super(particle_panel, 'control_item', 'control_parsetup');
        _ParticlePanelRenderer_simulation.set(this, void 0);
        _ParticlePanelRenderer_add_particles_dialog.set(this, void 0);
        _ParticlePanelRenderer_create_group_dialog.set(this, void 0);
        _ParticlePanelRenderer_group_list.set(this, void 0);
        // Saved Data
        simulation.add_observer(SimEvent.Overwrite_Particle_Groups, this.overwriteGroupList.bind(this));
        __classPrivateFieldSet(this, _ParticlePanelRenderer_simulation, simulation, "f");
        __classPrivateFieldSet(this, _ParticlePanelRenderer_add_particles_dialog, this.setupAddParticlesDialog(), "f");
        __classPrivateFieldSet(this, _ParticlePanelRenderer_create_group_dialog, this.setupCreateGroupDialog(), "f");
        __classPrivateFieldSet(this, _ParticlePanelRenderer_group_list, new ListRenderer(...Array.from(simulation.getParticleGroups(), ([group_id, group]) => new ParticleUnitGroupRenderer(group, simulation.getContainer()))), "f");
        // Content
        const header = document.createElement('header');
        header.innerHTML = "Particle Setup";
        particle_panel.appendChild(header);
        particle_panel.appendChild(this.createButtonsWrapper());
        const list_wrapper = document.createElement('div');
        list_wrapper.id = "parsetup_groups_wrapper";
        __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").setParent(list_wrapper);
        particle_panel.appendChild(list_wrapper);
    }
    setupAddParticlesDialog() {
        const dialog = new DialogRenderer('parsetup_add_particle_dialog');
        dialog.getOpenButton().getElement().textContent = "Add Particles";
        // Entire setup for dialog details
        return dialog;
    }
    setupCreateGroupDialog() {
        const dialog = new DialogRenderer('parsetup_add_group_dialog');
        dialog.getOpenButton().getElement().textContent = "Create Group";
        // Entire setup for dialog details
        return dialog;
    }
    createButtonsWrapper() {
        const buttons_wrapper = document.createElement('div');
        buttons_wrapper.id = "parsetup_buttons_wrapper";
        __classPrivateFieldGet(this, _ParticlePanelRenderer_add_particles_dialog, "f").getOpenButton().setParent(buttons_wrapper);
        __classPrivateFieldGet(this, _ParticlePanelRenderer_create_group_dialog, "f").getOpenButton().setParent(buttons_wrapper);
        return buttons_wrapper;
    }
    getGroupList() {
        return __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f");
    }
    overwriteGroupList() {
        __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").empty();
        Array.from(__classPrivateFieldGet(this, _ParticlePanelRenderer_simulation, "f").getParticleGroups(), ([group_id, group]) => new ParticleUnitGroupRenderer(group, __classPrivateFieldGet(this, _ParticlePanelRenderer_simulation, "f").getContainer())).forEach(group_renderer => __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").push(group_renderer));
    }
    remove() {
        __classPrivateFieldGet(this, _ParticlePanelRenderer_add_particles_dialog, "f").remove();
        __classPrivateFieldGet(this, _ParticlePanelRenderer_create_group_dialog, "f").remove();
        __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").remove();
        super.remove();
    }
}
_ParticlePanelRenderer_simulation = new WeakMap(), _ParticlePanelRenderer_add_particles_dialog = new WeakMap(), _ParticlePanelRenderer_create_group_dialog = new WeakMap(), _ParticlePanelRenderer_group_list = new WeakMap();
/**
 * Helper class for ParticleSetup Renderer.
 * Handles a set of Renderers that represents the
 * user control interface for a ParticleGroup.
 * Handles ParticleUnitRenderers.
 */
class ParticleUnitGroupRenderer extends Renderer {
    constructor(group, container) {
        const particle_group_element = document.createElement('article');
        super(particle_group_element, 'parsetup_group', `parsetup_group_id${group.getGrouping().group_id}`);
        _ParticleUnitGroupRenderer_particle_group.set(this, void 0);
        _ParticleUnitGroupRenderer_icon.set(this, void 0);
        _ParticleUnitGroupRenderer_details_dialog.set(this, void 0);
        _ParticleUnitGroupRenderer_drag_button.set(this, void 0);
        _ParticleUnitGroupRenderer_unit_list.set(this, void 0);
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_particle_group, group, "f");
        // Saved renderers
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_icon, this.createIcon(group.getGrouping().color), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_details_dialog, this.setupDetailsDialog(group.getGrouping().group_id), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_drag_button, this.setupDragButton(), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_unit_list, new ListRenderer(...group.getParticles().map(particle => {
            return new ParticleUnitRenderer(particle, container);
        })), "f");
        // Contents
        const header = document.createElement('header');
        header.appendChild(this.createTitleWrapper(group.getGrouping().group_id));
        header.appendChild(this.createButtonsWrapper());
        particle_group_element.appendChild(header);
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f").setParent(particle_group_element);
    }
    createIcon(color) {
        const icon = new Renderer(document.createElement("span"));
        icon.setClassName("parsetup_group_icon");
        icon.getElement().style.backgroundColor = color;
        return icon;
    }
    ;
    setupDetailsDialog(group_id) {
        const details_dialog = new DialogRenderer(`particle_group_${group_id}`);
        details_dialog.getOpenButton().setClassName("material-symbols-sharp icon");
        details_dialog.getOpenButton().getElement().innerHTML = "expand_content";
        // Entire setup for dialog details
        return details_dialog;
    }
    ;
    setupDragButton() {
        const drag_button = new ButtonRenderer(() => {
            // Draggable button WIP (see Drag and Drop API)
        }, 'drag' // Draggable button WIP (see Drag and Drop API)
        );
        drag_button.setClassName("material-symbols-sharp icon drag_icon");
        drag_button.getElement().innerHTML = "drag_handle";
        return drag_button;
    }
    ;
    createTitleWrapper(group_id) {
        const title_wrapper = document.createElement('div');
        title_wrapper.className = "parsetup_group_title_wrapper";
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_icon, "f").setParent(title_wrapper);
        const title = document.createElement('span');
        title.className = "parsetup_group_title";
        title.innerHTML = group_id;
        title_wrapper.appendChild(title);
        return title_wrapper;
    }
    ;
    createButtonsWrapper() {
        const buttons_wrapper = document.createElement('div');
        buttons_wrapper.className = "parsetup_group_buttons_wrapper";
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_details_dialog, "f").getOpenButton().setParent(buttons_wrapper);
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_drag_button, "f").setParent(buttons_wrapper);
        return buttons_wrapper;
    }
    ;
    getParticleGroup() {
        return __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_particle_group, "f");
    }
    getUnitList() {
        return __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f");
    }
    remove() {
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_icon, "f").remove();
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_details_dialog, "f").remove();
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_drag_button, "f").remove();
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f").remove();
        super.remove();
    }
}
_ParticleUnitGroupRenderer_particle_group = new WeakMap(), _ParticleUnitGroupRenderer_icon = new WeakMap(), _ParticleUnitGroupRenderer_details_dialog = new WeakMap(), _ParticleUnitGroupRenderer_drag_button = new WeakMap(), _ParticleUnitGroupRenderer_unit_list = new WeakMap();
/**
 * Helper class for ParticleUnitGroupRenderer.
 * Handles a set of Renderers that represents
 * the user control interface of a Particle.
 * Handles a single ParticlePointRenderer.
 */
class ParticleUnitRenderer extends Renderer {
    constructor(particle, container) {
        const particle_control_element = document.createElement('div');
        super(particle_control_element, 'parsetup_par', `parsetup_par_id${particle.getID()}`);
        _ParticleUnitRenderer_particle_renderer.set(this, void 0);
        _ParticleUnitRenderer_icon.set(this, void 0);
        _ParticleUnitRenderer_details_dialog.set(this, void 0);
        _ParticleUnitRenderer_drag_button.set(this, void 0);
        // Saved renderers
        __classPrivateFieldSet(this, _ParticleUnitRenderer_particle_renderer, new ParticlePointRenderer(particle, container), "f");
        __classPrivateFieldSet(this, _ParticleUnitRenderer_icon, this.createIcon(particle.color), "f");
        __classPrivateFieldSet(this, _ParticleUnitRenderer_details_dialog, this.setupDetailsDialog(particle.getID()), "f");
        __classPrivateFieldSet(this, _ParticleUnitRenderer_drag_button, this.setupDragButton(), "f");
        // Contents
        particle_control_element.appendChild(this.createTitleWrapper(particle.getID()));
        particle_control_element.appendChild(this.createButtonsWrapper());
        __classPrivateFieldGet(this, _ParticleUnitRenderer_details_dialog, "f").setParent(particle_control_element);
    }
    createIcon(color) {
        const icon = new Renderer(document.createElement("span"));
        icon.setClassName("parsetup_par_icon");
        icon.getElement().style.backgroundColor = color;
        return icon;
    }
    setupDetailsDialog(id) {
        const details_dialog = new DialogRenderer(`particle_${id}`);
        details_dialog.getOpenButton().setClassName("material-symbols-sharp icon");
        details_dialog.getOpenButton().getElement().innerHTML = "expand_content";
        // Entire setup for dialog details
        // IDEA: on open, focus on the particles by overlaying a 
        // translucent div the size of the container over the others
        // only the selected particles are of z-index greater than
        // this overlay
        return details_dialog;
    }
    setupDragButton() {
        const drag_button = new ButtonRenderer(() => {
            // Draggable button WIP (see Drag and Drop API)
        }, 'drag' // Draggable button WIP (see Drag and Drop API)
        );
        drag_button.setClassName("material-symbols-sharp icon drag_icon");
        drag_button.getElement().innerHTML = "drag_handle";
        return drag_button;
    }
    createTitleWrapper(id) {
        const title_wrapper = document.createElement('div');
        title_wrapper.className = "parsetup_par_title_wrapper";
        __classPrivateFieldGet(this, _ParticleUnitRenderer_icon, "f").setParent(title_wrapper);
        const title = document.createElement('span');
        title.className = "parsetup_par_title";
        title.innerHTML = id.toString();
        title_wrapper.appendChild(title);
        return title_wrapper;
    }
    createButtonsWrapper() {
        const buttons_wrapper = document.createElement('div');
        buttons_wrapper.className = "parsetup_par_buttons_wrapper";
        __classPrivateFieldGet(this, _ParticleUnitRenderer_details_dialog, "f").getOpenButton().setParent(buttons_wrapper);
        __classPrivateFieldGet(this, _ParticleUnitRenderer_drag_button, "f").setParent(buttons_wrapper);
        return buttons_wrapper;
    }
    getElement() {
        return super.getElement();
    }
    getParticlePoint() {
        return __classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f");
    }
    remove() {
        __classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f").remove();
        __classPrivateFieldGet(this, _ParticleUnitRenderer_icon, "f").remove();
        __classPrivateFieldGet(this, _ParticleUnitRenderer_details_dialog, "f").remove();
        __classPrivateFieldGet(this, _ParticleUnitRenderer_drag_button, "f").remove();
        super.remove();
    }
}
_ParticleUnitRenderer_particle_renderer = new WeakMap(), _ParticleUnitRenderer_icon = new WeakMap(), _ParticleUnitRenderer_details_dialog = new WeakMap(), _ParticleUnitRenderer_drag_button = new WeakMap();
/**
 * Helper class for ParticleUnitRenderer.
 * Handles a Renderer belonging to a Simulation container
 * that represents a Particle as a circular point with
 * the correct styling.
 */
class ParticlePointRenderer extends Renderer {
    constructor(particle, container) {
        const particle_element = document.createElement('div');
        super(particle_element, 'particle_element', `particle_element_id${particle.getID()}`);
        _ParticlePointRenderer_particle.set(this, void 0);
        _ParticlePointRenderer_container.set(this, void 0);
        __classPrivateFieldSet(this, _ParticlePointRenderer_particle, particle, "f");
        __classPrivateFieldSet(this, _ParticlePointRenderer_container, container, "f");
        const container_element = document.querySelector('.container_element');
        container_element.appendChild(particle_element);
        // shape
        particle_element.style.borderRadius = `${particle.radius}px`;
        particle_element.style.width = `${2 * particle.radius}px`;
        particle_element.style.height = `${2 * particle.radius}px`;
        // positioning
        particle_element.style.left = `${(particle.position.x - particle.radius) - container.x_min}px`;
        particle_element.style.top = `${container.y_max - (particle.position.y + particle.radius)}px`;
        // color
        particle_element.style.backgroundColor = particle.color;
    }
    getElement() {
        return super.getElement();
    }
    getParticle() {
        return __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f");
    }
    setContainer(container) {
        if (__classPrivateFieldGet(this, _ParticlePointRenderer_container, "f") === container)
            return;
        __classPrivateFieldSet(this, _ParticlePointRenderer_container, container, "f");
        const container_element = document.querySelector('.container_element');
        container_element.appendChild(this.getElement());
    }
    update() {
        const particle_element = this.getElement();
        // shape
        particle_element.style.borderRadius = `${__classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").radius}px`;
        particle_element.style.width = `${2 * __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").radius}px`;
        particle_element.style.height = `${2 * __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").radius}px`;
        // positioning
        particle_element.style.left = `${(__classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").position.x - __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").radius) - __classPrivateFieldGet(this, _ParticlePointRenderer_container, "f").x_min}px`;
        particle_element.style.top = `${__classPrivateFieldGet(this, _ParticlePointRenderer_container, "f").y_max - (__classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").position.y + __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").radius)}px`;
        // color
        particle_element.style.backgroundColor = __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").color;
    }
}
_ParticlePointRenderer_particle = new WeakMap(), _ParticlePointRenderer_container = new WeakMap();
