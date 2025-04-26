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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _AddParticleMenuRenderer_simulation, _AddParticleMenuRenderer_group_selector, _AddParticleMenuRenderer_input_table, _AddParticleMenuRenderer_amount_input, _AddParticleMenuRenderer_submit_button, _CreateGroupMenuRenderer_simulation, _CreateGroupMenuRenderer_input_table, _CreateGroupMenuRenderer_submit_button, _EditGroupMenuRenderer_group, _EditGroupMenuRenderer_input_table, _EditGroupMenuRenderer_submit_button, _EditGroupMenuRenderer_delete_button, _EditParticleMenuRenderer_particle, _EditParticleMenuRenderer_input_table, _EditParticleMenuRenderer_submit_button, _EditParticleMenuRenderer_delete_button, _ParticleUnitGroupRenderer_particle_group, _ParticleUnitGroupRenderer_icon, _ParticleUnitGroupRenderer_details_dialog, _ParticleUnitGroupRenderer_drag_button, _ParticleUnitGroupRenderer_unit_list, _ParticleUnitRenderer_particle_renderer, _ParticleUnitRenderer_icon, _ParticleUnitRenderer_details_dialog, _ParticleUnitRenderer_drag_button, _ParticlePointRenderer_particle, _ParticlePointRenderer_container;
class AddParticleMenuRenderer extends Renderer {
    constructor(simulation) {
        const menu_wrapper = document.createElement('div');
        super(menu_wrapper, 'dialog_menu', 'dialog_menu_add_particle');
        // To be placed inside an existing StandardDialogRenderer
        _AddParticleMenuRenderer_simulation.set(this, void 0);
        _AddParticleMenuRenderer_group_selector.set(this, void 0);
        _AddParticleMenuRenderer_input_table.set(this, void 0);
        _AddParticleMenuRenderer_amount_input.set(this, void 0);
        _AddParticleMenuRenderer_submit_button.set(this, void 0);
        // Stored Data
        simulation.add_observer(SimEvent.Update_Particle_Groups, (payload) => {
            this.refresh(payload);
        });
        __classPrivateFieldSet(this, _AddParticleMenuRenderer_simulation, simulation, "f");
        __classPrivateFieldSet(this, _AddParticleMenuRenderer_group_selector, this.setupGroupSelector(), "f");
        __classPrivateFieldSet(this, _AddParticleMenuRenderer_input_table, this.setupInputTable(simulation.getContainer()), "f");
        __classPrivateFieldSet(this, _AddParticleMenuRenderer_amount_input, this.setupAmountInput(), "f");
        __classPrivateFieldSet(this, _AddParticleMenuRenderer_submit_button, this.setupSubmitButton(), "f");
        // DOM Content
        const select_wrapper = document.createElement('div');
        select_wrapper.className = 'menu_item';
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").getLabelElement().innerText = "Group: ";
        select_wrapper.appendChild(__classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").getLabelElement());
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").setParent(select_wrapper);
        menu_wrapper.appendChild(select_wrapper);
        const table_wrapper = document.createElement('div');
        table_wrapper.className = 'menu_item';
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_input_table, "f").setParent(table_wrapper);
        menu_wrapper.appendChild(table_wrapper);
        const amount_input_wrapper = document.createElement('div');
        amount_input_wrapper.className = 'menu_item';
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_amount_input, "f").getLabelElement().innerText = "Amount: ";
        amount_input_wrapper.appendChild(__classPrivateFieldGet(this, _AddParticleMenuRenderer_amount_input, "f").getLabelElement());
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_amount_input, "f").setParent(amount_input_wrapper);
        menu_wrapper.appendChild(amount_input_wrapper);
        const submit_wrapper = document.createElement('div');
        submit_wrapper.style.display = 'flex';
        submit_wrapper.style.justifyContent = 'center';
        submit_wrapper.style.marginTop = '8px';
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_submit_button, "f").setParent(submit_wrapper);
        menu_wrapper.appendChild(submit_wrapper);
    }
    setupGroupSelector() {
        const selector = new SelectRenderer('menu_group_selector_add_particle', Array.from(__classPrivateFieldGet(this, _AddParticleMenuRenderer_simulation, "f").getParticleGroups(), ([group_id, group]) => new OptionRenderer(group_id)));
        selector.setSelected(0);
        return selector;
    }
    setupInputTable(container) {
        const properties = ((_a) => {
            var { group_id, enable_path_tracing } = _a, exposed_properties = __rest(_a, ["group_id", "enable_path_tracing"]);
            return exposed_properties;
        })(DEFAULT_GROUPING);
        const input_table = new InputTableRenderer('addParticle', properties, true, 'random');
        input_table.setNumberInputBounds(...DEFAULT_BOUNDS, {
            key: "position",
            min: {
                x: container.x_min,
                y: container.y_min
            },
            max: {
                x: container.x_max,
                y: container.y_max
            }
        });
        return input_table;
    }
    setupAmountInput() {
        const input = new NumberInputRenderer('create_particles_amount', 1, 1, 50);
        return input;
    }
    setupSubmitButton() {
        const button = new ButtonRenderer(() => {
            console.log(__classPrivateFieldGet(this, _AddParticleMenuRenderer_input_table, "f").prepareChanges());
        });
        button.setLabel('Submit');
        return button;
    }
    refresh(payload) {
        if ((payload === null || payload === void 0 ? void 0 : payload.operation) === 'add') {
            console.log("adding a group");
            __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").addOption(new OptionRenderer(payload.data.getGrouping().group_id));
        }
        else if ((payload === null || payload === void 0 ? void 0 : payload.operation) === 'edit') {
            console.log("editing a group");
        }
        else if ((payload === null || payload === void 0 ? void 0 : payload.operation) === 'delete') {
            console.log("deleting a group");
        }
        else if ((payload === null || payload === void 0 ? void 0 : payload.operation) === 'overwrite') {
            console.log("overwriting a group");
            __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").empty();
            for (const key of __classPrivateFieldGet(this, _AddParticleMenuRenderer_simulation, "f").getParticleGroups().keys())
                __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").addOption(new OptionRenderer(key));
        }
    }
    submit() {
    }
}
_AddParticleMenuRenderer_simulation = new WeakMap(), _AddParticleMenuRenderer_group_selector = new WeakMap(), _AddParticleMenuRenderer_input_table = new WeakMap(), _AddParticleMenuRenderer_amount_input = new WeakMap(), _AddParticleMenuRenderer_submit_button = new WeakMap();
class CreateGroupMenuRenderer extends Renderer {
    constructor(simulation) {
        const menu_wrapper = document.createElement('div');
        super(menu_wrapper, 'dialog_menu', 'dialog_menu_create_group');
        // To be placed inside an existing StandardDialogRenderer
        _CreateGroupMenuRenderer_simulation.set(this, void 0);
        _CreateGroupMenuRenderer_input_table.set(this, void 0);
        _CreateGroupMenuRenderer_submit_button.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _CreateGroupMenuRenderer_simulation, simulation, "f");
        __classPrivateFieldSet(this, _CreateGroupMenuRenderer_input_table, this.setupInputTable(simulation.getContainer()), "f");
        __classPrivateFieldSet(this, _CreateGroupMenuRenderer_submit_button, this.setupSubmitButton(), "f");
        // DOM Content
        const table_wrapper = document.createElement('div');
        table_wrapper.className = 'menu_item';
        __classPrivateFieldGet(this, _CreateGroupMenuRenderer_input_table, "f").setParent(table_wrapper);
        menu_wrapper.appendChild(table_wrapper);
        const submit_wrapper = document.createElement('div');
        submit_wrapper.style.display = 'flex';
        submit_wrapper.style.justifyContent = 'center';
        submit_wrapper.style.marginTop = '8px';
        __classPrivateFieldGet(this, _CreateGroupMenuRenderer_submit_button, "f").setParent(submit_wrapper);
        menu_wrapper.appendChild(submit_wrapper);
    }
    setupInputTable(container) {
        const properties = ((_a) => {
            var { enable_path_tracing } = _a, exposed_properties = __rest(_a, ["enable_path_tracing"]);
            return exposed_properties;
        })(DEFAULT_GROUPING);
        const input_table = new InputTableRenderer('createGroup', properties, true, 'random', 'unspecified');
        input_table.setNumberInputBounds(...DEFAULT_BOUNDS, {
            key: "position",
            min: {
                x: container.x_min,
                y: container.y_min
            },
            max: {
                x: container.x_max,
                y: container.y_max
            }
        });
        return input_table;
    }
    setupSubmitButton() {
        const button = new ButtonRenderer(this.submit.bind(this));
        button.setLabel('Submit');
        return button;
    }
    submit() {
        // make sure to validate group_id if it already exists or not
        // make group_id snake case
        console.log(__classPrivateFieldGet(this, _CreateGroupMenuRenderer_input_table, "f").prepareChanges());
        const changes = structuredCloneCustom(__classPrivateFieldGet(this, _CreateGroupMenuRenderer_input_table, "f").prepareChanges());
        __classPrivateFieldGet(this, _CreateGroupMenuRenderer_simulation, "f").addGroup(changes);
    }
}
_CreateGroupMenuRenderer_simulation = new WeakMap(), _CreateGroupMenuRenderer_input_table = new WeakMap(), _CreateGroupMenuRenderer_submit_button = new WeakMap();
class EditGroupMenuRenderer extends Renderer {
    constructor(group, container) {
        const menu_wrapper = document.createElement('div');
        super(menu_wrapper, 'dialog_menu', `dialog_menu_edit_group_id_${0}`);
        // To be placed inside an existing StandardDialogRenderer
        // maybe use checkboxes for users to tick if they want to specify/unspecify a property?
        // also option to delete the ParticleGroup
        // "Focus" on the corresponding group of particles in the container when this window is open
        _EditGroupMenuRenderer_group.set(this, void 0);
        _EditGroupMenuRenderer_input_table.set(this, void 0);
        _EditGroupMenuRenderer_submit_button.set(this, void 0);
        _EditGroupMenuRenderer_delete_button.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _EditGroupMenuRenderer_group, group, "f");
        __classPrivateFieldSet(this, _EditGroupMenuRenderer_input_table, this.setupInputTable(container), "f");
        __classPrivateFieldSet(this, _EditGroupMenuRenderer_submit_button, this.setupSubmitButton(), "f");
        __classPrivateFieldSet(this, _EditGroupMenuRenderer_delete_button, this.setupDeleteButton(), "f");
        // DOM Content
        const table_wrapper = document.createElement('div');
        table_wrapper.className = 'menu_item';
        __classPrivateFieldGet(this, _EditGroupMenuRenderer_input_table, "f").setParent(table_wrapper);
        menu_wrapper.appendChild(table_wrapper);
        const buttons_wrapper = document.createElement('div');
        buttons_wrapper.style.display = 'flex';
        buttons_wrapper.style.justifyContent = 'center';
        buttons_wrapper.style.marginTop = '8px';
        __classPrivateFieldGet(this, _EditGroupMenuRenderer_submit_button, "f").setParent(buttons_wrapper);
        __classPrivateFieldGet(this, _EditGroupMenuRenderer_delete_button, "f").setParent(buttons_wrapper);
        menu_wrapper.appendChild(buttons_wrapper);
    }
    setupInputTable(container) {
        const all_properties = ((_a) => {
            var { group_id, enable_path_tracing } = _a, exposed_properties = __rest(_a, ["group_id", "enable_path_tracing"]);
            return exposed_properties;
        })(DEFAULT_GROUPING);
        const input_table = new InputTableRenderer(`editGroupId${__classPrivateFieldGet(this, _EditGroupMenuRenderer_group, "f").getGrouping().group_id}`, all_properties, true, 'random', 'unspecified');
        input_table.setNumberInputBounds(...DEFAULT_BOUNDS, {
            key: "position",
            min: {
                x: container.x_min,
                y: container.y_min
            },
            max: {
                x: container.x_max,
                y: container.y_max
            }
        });
        const properties = ((_a) => {
            var { group_id, enable_path_tracing } = _a, exposed_properties = __rest(_a, ["group_id", "enable_path_tracing"]);
            return exposed_properties;
        })(__classPrivateFieldGet(this, _EditGroupMenuRenderer_group, "f").getGrouping());
        input_table.setProperties(properties);
        return input_table;
    }
    setupSubmitButton() {
        const button = new ButtonRenderer(() => {
            console.log(__classPrivateFieldGet(this, _EditGroupMenuRenderer_input_table, "f").prepareChanges());
        });
        button.setLabel('Submit');
        return button;
    }
    setupDeleteButton() {
        const button = new ButtonRenderer(() => {
        });
        button.setLabel('Delete');
        button.setClassName('delete_button');
        return button;
    }
    refresh() {
    }
    submit() {
        // call ParticleGroup::setGrouping for the following group by sending the changes to Simulation
    }
}
_EditGroupMenuRenderer_group = new WeakMap(), _EditGroupMenuRenderer_input_table = new WeakMap(), _EditGroupMenuRenderer_submit_button = new WeakMap(), _EditGroupMenuRenderer_delete_button = new WeakMap();
class EditParticleMenuRenderer extends Renderer {
    constructor(particle, container) {
        const menu_wrapper = document.createElement('div');
        super(menu_wrapper, 'dialog_menu', `dialog_menu_edit_particle_id_${0}`);
        // To be placed inside an existing StandardDialogRenderer
        // input_table again
        // option to delete the Particle
        // "Focus" on the corresponding particle in the container when this window is open
        _EditParticleMenuRenderer_particle.set(this, void 0);
        _EditParticleMenuRenderer_input_table.set(this, void 0);
        _EditParticleMenuRenderer_submit_button.set(this, void 0);
        _EditParticleMenuRenderer_delete_button.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _EditParticleMenuRenderer_particle, particle, "f");
        __classPrivateFieldSet(this, _EditParticleMenuRenderer_input_table, this.setupInputTable(container), "f");
        __classPrivateFieldSet(this, _EditParticleMenuRenderer_submit_button, this.setupSubmitButton(), "f");
        __classPrivateFieldSet(this, _EditParticleMenuRenderer_delete_button, this.setupDeleteButton(), "f");
        // DOM Content
        const table_wrapper = document.createElement('div');
        table_wrapper.className = 'menu_item';
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_input_table, "f").setParent(table_wrapper);
        menu_wrapper.appendChild(table_wrapper);
        const buttons_wrapper = document.createElement('div');
        buttons_wrapper.style.display = 'flex';
        buttons_wrapper.style.justifyContent = 'center';
        buttons_wrapper.style.marginTop = '8px';
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_submit_button, "f").setParent(buttons_wrapper);
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_delete_button, "f").setParent(buttons_wrapper);
        menu_wrapper.appendChild(buttons_wrapper);
    }
    setupInputTable(container) {
        const properties = ((_a) => {
            var { enable_path_tracing } = _a, exposed_properties = __rest(_a, ["enable_path_tracing"]);
            return exposed_properties;
        })(__classPrivateFieldGet(this, _EditParticleMenuRenderer_particle, "f"));
        // allow only some fields to be editable depending on what is unspecified or randomized by the group
        const input_table = new InputTableRenderer('editParticle', properties);
        input_table.setNumberInputBounds(...DEFAULT_BOUNDS, {
            key: "position",
            min: {
                x: container.x_min,
                y: container.y_min
            },
            max: {
                x: container.x_max,
                y: container.y_max
            }
        });
        return input_table;
    }
    setupSubmitButton() {
        const button = new ButtonRenderer(() => {
            console.log(__classPrivateFieldGet(this, _EditParticleMenuRenderer_input_table, "f").prepareChanges());
        });
        button.setLabel('Submit');
        return button;
    }
    setupDeleteButton() {
        const button = new ButtonRenderer(() => {
        });
        button.setLabel('Delete');
        button.setClassName('delete_button');
        return button;
    }
    refresh() {
    }
    submit() {
    }
}
_EditParticleMenuRenderer_particle = new WeakMap(), _EditParticleMenuRenderer_input_table = new WeakMap(), _EditParticleMenuRenderer_submit_button = new WeakMap(), _EditParticleMenuRenderer_delete_button = new WeakMap();
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
        // Stored Data
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_particle_group, group, "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_icon, this.createIcon(group.getGrouping().color), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_details_dialog, this.setupDetailsDialog(group.getGrouping().group_id, container), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_drag_button, this.setupDragButton(), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_unit_list, new ListRenderer(...group.getParticles().map(particle => {
            return new ParticleUnitRenderer(particle, container);
        })), "f");
        // DOM Content
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
    setupDetailsDialog(group_id, container) {
        const body = new EditGroupMenuRenderer(__classPrivateFieldGet(this, _ParticleUnitGroupRenderer_particle_group, "f"), container);
        const details_dialog = new StandardDialogRenderer(body, `particle_group_${group_id}`, `Group: ${group_id}`, true);
        details_dialog.getOpenButton().setLabel("expand_content", true);
        details_dialog.getCloseButton().setLabel("close", true);
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
        // Stored Data
        __classPrivateFieldSet(this, _ParticleUnitRenderer_particle_renderer, new ParticlePointRenderer(particle, container), "f");
        __classPrivateFieldSet(this, _ParticleUnitRenderer_icon, this.createIcon(particle.color), "f");
        __classPrivateFieldSet(this, _ParticleUnitRenderer_details_dialog, this.setupDetailsDialog(particle.getID(), container), "f");
        __classPrivateFieldSet(this, _ParticleUnitRenderer_drag_button, this.setupDragButton(), "f");
        // DOM Content
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
    setupDetailsDialog(id, container) {
        const body = new EditParticleMenuRenderer(__classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f").getParticle(), container);
        const details_dialog = new StandardDialogRenderer(body, `particle_${id}`, `Particle: ${id}`, true);
        details_dialog.getOpenButton().setLabel("expand_content", true);
        details_dialog.getCloseButton().setLabel("close", true);
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
