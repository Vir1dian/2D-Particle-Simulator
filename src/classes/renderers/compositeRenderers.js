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
var _UIControlRenderer_simulation, _SimulationPresetInputRenderer_simulation, _SimulationPresetInputRenderer_preset_dropdown, _SimulationPresetInputRenderer_apply_button, _SimulationControlRenderer_simulation, _ParticlePointRenderer_particle, _ParticlePointRenderer_container, _ParticleUnitRenderer_particle_renderer, _ParticleUnitRenderer_icon, _ParticleUnitRenderer_details_dialog, _ParticleUnitRenderer_drag_button, _ParticleUnitGroupRenderer_particle_renderers, _ParticleUnitGroupRenderer_icon, _ParticleUnitGroupRenderer_details_dialog, _ParticleUnitGroupRenderer_drag_button, _ParticleUnitGroupRenderer_unit_list;
// Other larger Renderer classes, may move to separate files
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
class SimulationPresetInputRenderer extends Renderer {
    constructor(simulation) {
        const simulation_preset_input = document.createElement('div');
        super(simulation_preset_input, '', 'simsetup_presets_wrapper');
        _SimulationPresetInputRenderer_simulation.set(this, void 0);
        _SimulationPresetInputRenderer_preset_dropdown.set(this, void 0);
        _SimulationPresetInputRenderer_apply_button.set(this, void 0);
        __classPrivateFieldSet(this, _SimulationPresetInputRenderer_simulation, simulation, "f");
        // saved renderers
        __classPrivateFieldSet(this, _SimulationPresetInputRenderer_preset_dropdown, this.setupPresetDropdown(), "f");
        __classPrivateFieldSet(this, _SimulationPresetInputRenderer_apply_button, this.setupApplyButton(), "f");
        // contents
        __classPrivateFieldGet(this, _SimulationPresetInputRenderer_preset_dropdown, "f").setParent(simulation_preset_input);
        __classPrivateFieldGet(this, _SimulationPresetInputRenderer_apply_button, "f").setParent(simulation_preset_input);
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
            const preset_name = __classPrivateFieldGet(this, _SimulationPresetInputRenderer_preset_dropdown, "f").getValue();
            const preset = TEMPORARY_PRESETS[preset_name];
            this.applyPreset(preset);
        });
        button.setID('simsetup_presets_button');
        return button;
    }
    applyPreset(preset) {
        // TODO
    }
}
_SimulationPresetInputRenderer_simulation = new WeakMap(), _SimulationPresetInputRenderer_preset_dropdown = new WeakMap(), _SimulationPresetInputRenderer_apply_button = new WeakMap();
class SimulationControlRenderer extends Renderer {
    constructor(simulation) {
        const simulation_settings = document.createElement('div');
        super(simulation_settings, '', 'simsetup_global_variables_wrapper');
        _SimulationControlRenderer_simulation.set(this, void 0);
        __classPrivateFieldSet(this, _SimulationControlRenderer_simulation, simulation, "f");
    }
}
_SimulationControlRenderer_simulation = new WeakMap();
class ParticlePointRenderer extends Renderer {
    constructor(particle, container) {
        const particle_element = document.createElement('div');
        super(particle_element, 'particle_element', `particle_element_id${particle.getID()}`);
        _ParticlePointRenderer_particle.set(this, void 0);
        _ParticlePointRenderer_container.set(this, void 0);
        __classPrivateFieldSet(this, _ParticlePointRenderer_particle, particle, "f");
        __classPrivateFieldSet(this, _ParticlePointRenderer_container, container, "f");
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
        if (__classPrivateFieldGet(this, _ParticlePointRenderer_container, "f") !== container)
            __classPrivateFieldSet(this, _ParticlePointRenderer_container, container, "f");
        const container_element = document.querySelector('.container_element');
        container_element === null || container_element === void 0 ? void 0 : container_element.appendChild(this.getElement());
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
        __classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f").setContainer(container);
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
        const details_dialog = new DialogRenderer(`particle_dialog_id${id}`);
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
class ParticleUnitGroupRenderer extends Renderer {
    constructor(grouping, ...p_renderers) {
        const particle_group_element = document.createElement('article');
        super(particle_group_element, 'parsetup_group', `parsetup_group_id${grouping.group_id}`);
        _ParticleUnitGroupRenderer_particle_renderers.set(this, void 0);
        _ParticleUnitGroupRenderer_icon.set(this, void 0);
        _ParticleUnitGroupRenderer_details_dialog.set(this, void 0);
        _ParticleUnitGroupRenderer_drag_button.set(this, void 0);
        _ParticleUnitGroupRenderer_unit_list.set(this, void 0);
        // Saved renderers
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_particle_renderers, p_renderers, "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_icon, this.createIcon(grouping.color), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_details_dialog, this.setupDetailsDialog(grouping.group_id), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_drag_button, this.setupDragButton(), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_unit_list, new ListRenderer(...p_renderers), "f");
        // Contents
        const header = document.createElement('header');
        header.appendChild(this.createTitleWrapper(grouping.group_id));
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
        const details_dialog = new DialogRenderer(`particle_group_dialog_id${group_id}`);
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
}
_ParticleUnitGroupRenderer_particle_renderers = new WeakMap(), _ParticleUnitGroupRenderer_icon = new WeakMap(), _ParticleUnitGroupRenderer_details_dialog = new WeakMap(), _ParticleUnitGroupRenderer_drag_button = new WeakMap(), _ParticleUnitGroupRenderer_unit_list = new WeakMap();
