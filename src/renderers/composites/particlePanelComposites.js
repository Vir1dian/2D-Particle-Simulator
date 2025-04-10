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
var _ParticleUnitGroupRenderer_particle_group, _ParticleUnitGroupRenderer_icon, _ParticleUnitGroupRenderer_details_dialog, _ParticleUnitGroupRenderer_drag_button, _ParticleUnitGroupRenderer_unit_list, _ParticleUnitRenderer_particle_renderer, _ParticleUnitRenderer_icon, _ParticleUnitRenderer_details_dialog, _ParticleUnitRenderer_drag_button, _ParticlePointRenderer_particle, _ParticlePointRenderer_container;
class AddParticleWindowRenderer extends Renderer {
}
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
        _ParticleUnitGroupRenderer_details_dialog.set(this, void 0); // maybe make this non-modal to edit outside of the popup?
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
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_details_dialog, "f").setParent(particle_group_element);
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f").setParent(particle_group_element);
    }
    createIcon(color) {
        const icon = new Renderer(document.createElement("span"));
        icon.setClassName("parsetup_group_icon");
        if (__classPrivateFieldGet(this, _ParticleUnitGroupRenderer_particle_group, "f").getGrouping().group_id === DEFAULT_GROUPING.group_id)
            icon.getElement().style.display = 'none';
        else
            icon.getElement().style.backgroundColor = color;
        return icon;
    }
    ;
    setupDetailsDialog(group_id) {
        const body = new Renderer(document.createElement('div'));
        const details_dialog = new StandardDialogRenderer(body, `particle_group_${group_id}`, group_id, true);
        details_dialog.setOpenButtonLabel("expand_content", true);
        details_dialog.setCloseButtonLabel("close", true);
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
        _ParticleUnitRenderer_details_dialog.set(this, void 0); // maybe make this non-modal to edit outside of the popup?
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
        const body = new Renderer(document.createElement('div'));
        const details_dialog = new StandardDialogRenderer(body, `particle_${id}`, `Particle ${id}`, true);
        details_dialog.setOpenButtonLabel("expand_content", true);
        details_dialog.setCloseButtonLabel("close", true);
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
        }, 'drag' // Draggable button WIP (see Drag and Drop API) // might have to do manually
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
