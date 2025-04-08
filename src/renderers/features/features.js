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
var _UIControlRenderer_simulation, _EnvironmentPanelRenderer_simulation, _EnvironmentPanelRenderer_preset_handler, _EnvironmentPanelRenderer_environment_handler, _ParticlePanelRenderer_simulation, _ParticlePanelRenderer_add_particles_dialog, _ParticlePanelRenderer_create_group_dialog, _ParticlePanelRenderer_group_list;
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
