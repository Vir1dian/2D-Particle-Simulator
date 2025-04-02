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
var _UIControlRenderer_simulation, _EnvironmentSetupRenderer_simulation, _EnvironmentSetupRenderer_inputs, _EnvironmentSetupRenderer_input_table, _EnvironmentSetupRenderer_sumbit_button, _PresetInputRenderer_simulation, _PresetInputRenderer_preset_dropdown, _PresetInputRenderer_apply_button, _ParticleSetupRenderer_simulation, _ParticleSetupRenderer_add_particles_dialog, _ParticleSetupRenderer_create_group_dialog, _ParticleSetupRenderer_group_list, _ParticleUnitGroupRenderer_particle_group, _ParticleUnitGroupRenderer_icon, _ParticleUnitGroupRenderer_details_dialog, _ParticleUnitGroupRenderer_drag_button, _ParticleUnitGroupRenderer_unit_list, _ParticleUnitRenderer_particle_renderer, _ParticleUnitRenderer_icon, _ParticleUnitRenderer_details_dialog, _ParticleUnitRenderer_drag_button, _ParticlePointRenderer_particle, _ParticlePointRenderer_container;
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
}
_UIControlRenderer_simulation = new WeakMap();
// Environment Setup Renderers
/**
 * Helper class for SimulationRenderer.
 * Handles user inputs and sends changes to
 * Simulation's #environment property.
 */
class EnvironmentSetupRenderer extends Renderer {
    constructor(simulation) {
        const simulation_settings = document.createElement('div');
        super(simulation_settings, '', 'simsetup_global_variables_wrapper');
        _EnvironmentSetupRenderer_simulation.set(this, void 0);
        _EnvironmentSetupRenderer_inputs.set(this, void 0);
        _EnvironmentSetupRenderer_input_table.set(this, void 0);
        _EnvironmentSetupRenderer_sumbit_button.set(this, void 0);
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_simulation, simulation, "f");
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_inputs, new Map(), "f");
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_input_table, new TableRenderer(), "f");
        __classPrivateFieldSet(this, _EnvironmentSetupRenderer_sumbit_button, new ButtonRenderer(() => { }), "f");
    }
}
_EnvironmentSetupRenderer_simulation = new WeakMap(), _EnvironmentSetupRenderer_inputs = new WeakMap(), _EnvironmentSetupRenderer_input_table = new WeakMap(), _EnvironmentSetupRenderer_sumbit_button = new WeakMap();
class PresetInputRenderer extends Renderer {
    constructor(simulation) {
        const simulation_preset_input = document.createElement('div');
        super(simulation_preset_input, '', 'simsetup_presets_wrapper');
        _PresetInputRenderer_simulation.set(this, void 0);
        _PresetInputRenderer_preset_dropdown.set(this, void 0);
        _PresetInputRenderer_apply_button.set(this, void 0);
        __classPrivateFieldSet(this, _PresetInputRenderer_simulation, simulation, "f");
        // saved renderers
        __classPrivateFieldSet(this, _PresetInputRenderer_preset_dropdown, this.setupPresetDropdown(), "f");
        __classPrivateFieldSet(this, _PresetInputRenderer_apply_button, this.setupApplyButton(), "f");
        // contents
        __classPrivateFieldGet(this, _PresetInputRenderer_preset_dropdown, "f").setParent(simulation_preset_input);
        __classPrivateFieldGet(this, _PresetInputRenderer_apply_button, "f").setParent(simulation_preset_input);
    }
    setupPresetDropdown() {
        const preset_data = [];
        Object.keys(TEMPORARY_PRESETS).forEach((preset_name, preset) => {
            preset_data.push(new OptionRenderer(preset_name, ''));
        });
        const dropdown = new DatalistInputRenderer('simsetup_presets_input', preset_data, 'simsetup_presets');
        return dropdown;
    }
    setupApplyButton() {
        const button = new ButtonRenderer(() => {
            const preset_name = __classPrivateFieldGet(this, _PresetInputRenderer_preset_dropdown, "f").getValue();
            const preset = TEMPORARY_PRESETS[preset_name];
            __classPrivateFieldGet(this, _PresetInputRenderer_simulation, "f").setPreset(preset);
        });
        button.setID('simsetup_presets_button');
        return button;
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
class ParticleSetupRenderer extends Renderer {
    constructor(simulation) {
        const particle_setup = document.createElement('article');
        super(particle_setup, 'control_item', 'control_parsetup');
        _ParticleSetupRenderer_simulation.set(this, void 0);
        _ParticleSetupRenderer_add_particles_dialog.set(this, void 0);
        _ParticleSetupRenderer_create_group_dialog.set(this, void 0);
        _ParticleSetupRenderer_group_list.set(this, void 0);
        __classPrivateFieldSet(this, _ParticleSetupRenderer_simulation, simulation, "f");
        // Saved Renderers
        __classPrivateFieldSet(this, _ParticleSetupRenderer_add_particles_dialog, this.setupAddParticlesDialog(), "f");
        __classPrivateFieldSet(this, _ParticleSetupRenderer_create_group_dialog, this.setupCreateGroupDialog(), "f");
        __classPrivateFieldSet(this, _ParticleSetupRenderer_group_list, new ListRenderer(...Array.from(simulation.getParticleGroups(), ([group_id, group]) => new ParticleUnitGroupRenderer(group, simulation.getContainer()))), "f");
        // Content
        const header = document.createElement('header');
        header.innerHTML = "Particle Setup";
        particle_setup.appendChild(header);
        particle_setup.appendChild(this.createButtonsWrapper());
        const list_wrapper = document.createElement('div');
        list_wrapper.id = "parsetup_groups_wrapper";
        __classPrivateFieldGet(this, _ParticleSetupRenderer_group_list, "f").setParent(list_wrapper);
        particle_setup.appendChild(list_wrapper);
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
        __classPrivateFieldGet(this, _ParticleSetupRenderer_add_particles_dialog, "f").getOpenButton().setParent(buttons_wrapper);
        __classPrivateFieldGet(this, _ParticleSetupRenderer_create_group_dialog, "f").getOpenButton().setParent(buttons_wrapper);
        return buttons_wrapper;
    }
    getGroupList() {
        return __classPrivateFieldGet(this, _ParticleSetupRenderer_group_list, "f");
    }
}
_ParticleSetupRenderer_simulation = new WeakMap(), _ParticleSetupRenderer_add_particles_dialog = new WeakMap(), _ParticleSetupRenderer_create_group_dialog = new WeakMap(), _ParticleSetupRenderer_group_list = new WeakMap();
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
        details_dialog.getOpenButton().getElement().innerHTML = "keyboard_arrow_down";
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
        details_dialog.getOpenButton().getElement().innerHTML = "visibility";
        // Entire setup for dialog details
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
