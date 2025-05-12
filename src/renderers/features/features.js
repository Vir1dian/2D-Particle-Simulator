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
var _UIControlRenderer_simulation, _ContainerRenderer_container, _ContainerRenderer_dark_overlay, _EnvironmentPanelRenderer_preset_handler, _EnvironmentPanelRenderer_environment_handler, _ParticlePanelRenderer_particles_handler, _ParticlePanelRenderer_container, _ParticlePanelRenderer_add_particles_dialog, _ParticlePanelRenderer_create_group_dialog, _ParticlePanelRenderer_group_list;
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
class ContainerRenderer extends Renderer {
    constructor(simulation) {
        const container_element = document.createElement('div');
        super(container_element, "container_element");
        _ContainerRenderer_container.set(this, void 0);
        _ContainerRenderer_dark_overlay.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _ContainerRenderer_container, simulation.getContainer(), "f");
        simulation.getObservers().add(SimEvent.Update_Container, () => { this.resize(__classPrivateFieldGet(this, _ContainerRenderer_container, "f")); });
        __classPrivateFieldSet(this, _ContainerRenderer_dark_overlay, this.setupDarkOverlay(), "f");
        // Content
        this.getElement().appendChild(__classPrivateFieldGet(this, _ContainerRenderer_dark_overlay, "f"));
        container_element.style.width = `${__classPrivateFieldGet(this, _ContainerRenderer_container, "f").x_max - __classPrivateFieldGet(this, _ContainerRenderer_container, "f").x_min}px`;
        container_element.style.height = `${__classPrivateFieldGet(this, _ContainerRenderer_container, "f").y_max - __classPrivateFieldGet(this, _ContainerRenderer_container, "f").y_min}px`;
    }
    setupDarkOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'container_dark_overlay';
        return overlay;
    }
    resize(container) {
        console.log(container);
        this.getElement().style.width = `${container.x_max - container.x_min}px`;
        this.getElement().style.height = `${container.y_max - container.y_min}px`;
    }
    toggle_dark_overlay(value = true) {
        __classPrivateFieldGet(this, _ContainerRenderer_dark_overlay, "f").style.display = value ? 'block' : 'none';
    }
    getContainer() {
        return __classPrivateFieldGet(this, _ContainerRenderer_container, "f");
    }
    remove() {
        __classPrivateFieldGet(this, _ContainerRenderer_dark_overlay, "f").remove();
        super.remove();
    }
}
_ContainerRenderer_container = new WeakMap(), _ContainerRenderer_dark_overlay = new WeakMap();
class EnvironmentPanelRenderer extends Renderer {
    constructor(simulation) {
        const environment_panel = document.createElement('article');
        super(environment_panel, 'control_item', 'control_simsetup');
        _EnvironmentPanelRenderer_preset_handler.set(this, void 0);
        _EnvironmentPanelRenderer_environment_handler.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _EnvironmentPanelRenderer_preset_handler, new PresetInputRenderer(simulation), "f");
        __classPrivateFieldSet(this, _EnvironmentPanelRenderer_environment_handler, new EnvironmentSetupRenderer(simulation), "f");
        // Content
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
_EnvironmentPanelRenderer_preset_handler = new WeakMap(), _EnvironmentPanelRenderer_environment_handler = new WeakMap();
// Particle Interface Renderers
/**
 * Helper class for SimulationRenderer
 * Handles ParticleUnitGroupRenderers which
 * collectively send changes to Simulation's
 * #particle_groups property.
 */
class ParticlePanelRenderer extends Renderer {
    constructor(particles_handler, container) {
        const particle_panel = document.createElement('article');
        super(particle_panel, 'control_item', 'control_parsetup');
        _ParticlePanelRenderer_particles_handler.set(this, void 0);
        _ParticlePanelRenderer_container.set(this, void 0);
        _ParticlePanelRenderer_add_particles_dialog.set(this, void 0);
        _ParticlePanelRenderer_create_group_dialog.set(this, void 0);
        _ParticlePanelRenderer_group_list.set(this, void 0);
        // Saved Data
        __classPrivateFieldSet(this, _ParticlePanelRenderer_particles_handler, particles_handler, "f");
        this.setupObservers(container);
        __classPrivateFieldSet(this, _ParticlePanelRenderer_container, container, "f");
        __classPrivateFieldSet(this, _ParticlePanelRenderer_add_particles_dialog, this.setupAddParticlesDialog(), "f");
        __classPrivateFieldSet(this, _ParticlePanelRenderer_create_group_dialog, this.setupCreateGroupDialog(), "f");
        __classPrivateFieldSet(this, _ParticlePanelRenderer_group_list, new ListRenderer(...Array.from(particles_handler.getGroups(), ([group_id, group]) => new ParticleUnitGroupRenderer(group, particles_handler, container))), "f");
        // Content
        const header = document.createElement('header');
        header.innerHTML = "Particle Setup";
        particle_panel.appendChild(header);
        particle_panel.appendChild(this.createButtonsWrapper());
        __classPrivateFieldGet(this, _ParticlePanelRenderer_add_particles_dialog, "f").setParent(particle_panel);
        __classPrivateFieldGet(this, _ParticlePanelRenderer_create_group_dialog, "f").setParent(particle_panel);
        const list_wrapper = document.createElement('div');
        list_wrapper.id = "parsetup_groups_wrapper";
        __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").setParent(list_wrapper);
        particle_panel.appendChild(list_wrapper);
    }
    setupObservers(container) {
        const obs = __classPrivateFieldGet(this, _ParticlePanelRenderer_particles_handler, "f").getObservers();
        obs.add(ParticleHandlerEvent.Add_Group, (payload) => { this.addGroup(payload.group); });
        obs.add(ParticleHandlerEvent.Delete_Group, (payload) => { this.deleteGroup(payload.group, container); });
        obs.add(ParticleHandlerEvent.Overwrite_Groups, () => { this.overwriteGroupList(); });
    }
    setupAddParticlesDialog() {
        const body = new AddParticleMenuRenderer(__classPrivateFieldGet(this, _ParticlePanelRenderer_particles_handler, "f"), __classPrivateFieldGet(this, _ParticlePanelRenderer_container, "f").getContainer());
        const dialog = new StandardDialogRenderer(body, 'parsetup_add_particle_dialog', 'Add Particles', true);
        dialog.getOpenButton().setLabel("Add Particles");
        dialog.getCloseButton().setLabel("close", true);
        return dialog;
    }
    setupCreateGroupDialog() {
        const body = new CreateGroupMenuRenderer(__classPrivateFieldGet(this, _ParticlePanelRenderer_particles_handler, "f"), __classPrivateFieldGet(this, _ParticlePanelRenderer_container, "f").getContainer());
        const dialog = new StandardDialogRenderer(body, 'parsetup_add_group_dialog', 'Create Group', true);
        dialog.getOpenButton().setLabel("Create Group");
        dialog.getCloseButton().setLabel("close", true);
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
    addGroup(group) {
        console.log("adding a group");
        __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").push(new ParticleUnitGroupRenderer(group, __classPrivateFieldGet(this, _ParticlePanelRenderer_particles_handler, "f"), __classPrivateFieldGet(this, _ParticlePanelRenderer_container, "f")));
    }
    editGroup(group, changes_log) {
        console.log("editing a group");
        const group_renderer = __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").find(item => item
            .getParticleGroup()
            .getGrouping()
            .group_id
            ===
                group
                    .getGrouping()
                    .group_id);
        // uses a changes_log to only refresh changed properties without affecting resetting unchanged 
        if (!group_renderer)
            throw new Error("Group not found.");
        // physical properties of Particle units in the Simulation container such as radius, color, and position
        group_renderer.refresh(changes_log);
    }
    deleteGroup(group, container) {
        console.log("deleting a group");
        const group_renderer = __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").find(item => item.getParticleGroup() === group);
        if (!group_renderer)
            throw new Error("Group not found.");
        __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").removeItem(group_renderer);
        container.toggle_dark_overlay(false);
    }
    overwriteGroupList() {
        console.log("overwriting a group");
        __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").empty();
        Array.from(__classPrivateFieldGet(this, _ParticlePanelRenderer_particles_handler, "f").getGroups(), ([group_id, group]) => new ParticleUnitGroupRenderer(group, __classPrivateFieldGet(this, _ParticlePanelRenderer_particles_handler, "f"), __classPrivateFieldGet(this, _ParticlePanelRenderer_container, "f"))).forEach(group_renderer => __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").push(group_renderer));
    }
    remove() {
        __classPrivateFieldGet(this, _ParticlePanelRenderer_add_particles_dialog, "f").remove();
        __classPrivateFieldGet(this, _ParticlePanelRenderer_create_group_dialog, "f").remove();
        __classPrivateFieldGet(this, _ParticlePanelRenderer_group_list, "f").remove();
        super.remove();
    }
}
_ParticlePanelRenderer_particles_handler = new WeakMap(), _ParticlePanelRenderer_container = new WeakMap(), _ParticlePanelRenderer_add_particles_dialog = new WeakMap(), _ParticlePanelRenderer_create_group_dialog = new WeakMap(), _ParticlePanelRenderer_group_list = new WeakMap();
