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
var _AddParticleMenuRenderer_particles_handler, _AddParticleMenuRenderer_group_selector, _AddParticleMenuRenderer_input_table, _AddParticleMenuRenderer_amount_input, _AddParticleMenuRenderer_submit_button, _CreateGroupMenuRenderer_particles_handler, _CreateGroupMenuRenderer_input_table, _CreateGroupMenuRenderer_submit_button, _EditGroupMenuRenderer_group, _EditGroupMenuRenderer_particles_handler, _EditGroupMenuRenderer_input_table, _EditGroupMenuRenderer_submit_button, _EditGroupMenuRenderer_delete_button, _EditParticleMenuRenderer_particle, _EditParticleMenuRenderer_group, _EditParticleMenuRenderer_input_table, _EditParticleMenuRenderer_submit_button, _EditParticleMenuRenderer_delete_button, _ParticleUnitGroupRenderer_group, _ParticleUnitGroupRenderer_icon, _ParticleUnitGroupRenderer_details_dialog, _ParticleUnitGroupRenderer_drag_button, _ParticleUnitGroupRenderer_unit_list, _ParticleUnitRenderer_particle_renderer, _ParticleUnitRenderer_icon, _ParticleUnitRenderer_details_dialog, _ParticleUnitRenderer_drag_button, _ParticlePointRenderer_particle, _ParticlePointRenderer_container, _ParticlePointRenderer_select_callback;
class AddParticleMenuRenderer extends Renderer {
    constructor(particles_handler, container) {
        const menu_wrapper = document.createElement('div');
        super(menu_wrapper, 'dialog_menu', 'dialog_menu_add_particle');
        // To be placed inside an existing StandardDialogRenderer
        _AddParticleMenuRenderer_particles_handler.set(this, void 0);
        _AddParticleMenuRenderer_group_selector.set(this, void 0);
        _AddParticleMenuRenderer_input_table.set(this, void 0);
        _AddParticleMenuRenderer_amount_input.set(this, void 0);
        _AddParticleMenuRenderer_submit_button.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _AddParticleMenuRenderer_particles_handler, particles_handler, "f");
        this.setupParticleHandlerObservers();
        __classPrivateFieldSet(this, _AddParticleMenuRenderer_input_table, this.setupInputTable(container), "f");
        __classPrivateFieldSet(this, _AddParticleMenuRenderer_group_selector, this.setupGroupSelector(), "f"); // must be setup after input_table due to the disableFields callback
        __classPrivateFieldSet(this, _AddParticleMenuRenderer_amount_input, this.setupAmountInput(), "f");
        __classPrivateFieldSet(this, _AddParticleMenuRenderer_submit_button, this.setupSubmitButton(container), "f");
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
    setupParticleHandlerObservers() {
        const handler_obs = __classPrivateFieldGet(this, _AddParticleMenuRenderer_particles_handler, "f").getObservers();
        handler_obs.add(ParticleHandlerEvent.Add_Group, (payload) => {
            this.refresh(ParticleHandlerEvent.Add_Group, payload.group);
        });
        handler_obs.add(ParticleHandlerEvent.Delete_Group, (payload) => {
            this.refresh(ParticleHandlerEvent.Delete_Group, payload.group);
        });
        handler_obs.add(ParticleHandlerEvent.Overwrite_Groups, () => {
            this.refresh(ParticleHandlerEvent.Overwrite_Groups);
        });
    }
    setupGroupSelector() {
        const selector = new SelectRenderer('menu_group_selector_add_particle', Array.from(__classPrivateFieldGet(this, _AddParticleMenuRenderer_particles_handler, "f").getGroups(), ([group_id, group]) => new OptionRenderer(group_id)));
        const callback = () => {
            const group = __classPrivateFieldGet(this, _AddParticleMenuRenderer_particles_handler, "f").getGroups().get(selector.getElement().value);
            if (group) {
                const grouping = group.getGrouping();
                const all_properties = ((_a) => {
                    var { group_id, enable_path_tracing } = _a, exposed_properties = __rest(_a, ["group_id", "enable_path_tracing"]);
                    return exposed_properties;
                })(DEFAULT_GROUPING);
                __classPrivateFieldGet(this, _AddParticleMenuRenderer_input_table, "f").setProperties(Object.assign({}, grouping), all_properties);
                this.disableFields(grouping);
            }
        };
        selector.setOnchangeCallback(callback);
        selector.getElement().addEventListener('change', selector.getOnchangeCallback());
        selector.setSelected(0);
        return selector;
    }
    // Actively disable fields depending on the selected group
    setupInputTable(container) {
        const all_properties = ((_a) => {
            var { group_id, enable_path_tracing } = _a, exposed_properties = __rest(_a, ["group_id", "enable_path_tracing"]);
            return exposed_properties;
        })(DEFAULT_GROUPING);
        const input_table = new InputTableRenderer('addParticle', all_properties, true, 'random');
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
    setupSubmitButton(container) {
        const button = new ButtonRenderer(() => { this.submit(container); });
        button.setLabel('Submit');
        return button;
    }
    disableFields(grouping) {
        const disable_keys = [];
        Object.keys(grouping).forEach(property => {
            const grouping_value = grouping[property];
            if (grouping_value !== undefined && grouping_value !== 'random')
                disable_keys.push(property); // disable edits to particle properties already specified by the group
        });
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_input_table, "f").syncDisabled(disable_keys);
    }
    refresh(event, group) {
        if (event === ParticleHandlerEvent.Add_Group)
            __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").addOption(new OptionRenderer(group.getGrouping().group_id));
        // something happens here when you add an option and messes up the selector callbacks, FIX IT!
        else if (event === ParticleHandlerEvent.Delete_Group)
            __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").removeOption(group === null || group === void 0 ? void 0 : group.getGrouping().group_id);
        else if (event === ParticleHandlerEvent.Overwrite_Groups) {
            __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").empty();
            for (const key of __classPrivateFieldGet(this, _AddParticleMenuRenderer_particles_handler, "f").getGroups().keys())
                __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").addOption(new OptionRenderer(key));
        }
        const current_group = __classPrivateFieldGet(this, _AddParticleMenuRenderer_particles_handler, "f").getGroups().get(__classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").getElement().value);
        if (current_group) {
            this.disableFields(current_group.getGrouping());
        }
    }
    submit(container) {
        const group = __classPrivateFieldGet(this, _AddParticleMenuRenderer_particles_handler, "f").getGroups().get(__classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").getElement().value);
        if (!group)
            throw new Error("Group id not found in ParticleHandler.");
        for (let i = 0; i < __classPrivateFieldGet(this, _AddParticleMenuRenderer_amount_input, "f").getNumberValue(); i++) {
            const new_particle = new Particle(container, Object.assign({ group_id: __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").getElement().value }, __classPrivateFieldGet(this, _AddParticleMenuRenderer_input_table, "f").prepareChanges()));
            __classPrivateFieldGet(this, _AddParticleMenuRenderer_particles_handler, "f").addParticle(new_particle, group);
        }
    }
    remove() {
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").getElement().removeEventListener('change', __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").getOnchangeCallback());
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_group_selector, "f").remove();
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_input_table, "f").remove();
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_amount_input, "f").remove();
        __classPrivateFieldGet(this, _AddParticleMenuRenderer_submit_button, "f").remove();
        super.remove();
    }
}
_AddParticleMenuRenderer_particles_handler = new WeakMap(), _AddParticleMenuRenderer_group_selector = new WeakMap(), _AddParticleMenuRenderer_input_table = new WeakMap(), _AddParticleMenuRenderer_amount_input = new WeakMap(), _AddParticleMenuRenderer_submit_button = new WeakMap();
class CreateGroupMenuRenderer extends Renderer {
    constructor(particles_handler, container) {
        const menu_wrapper = document.createElement('div');
        super(menu_wrapper, 'dialog_menu', 'dialog_menu_create_group');
        // To be placed inside an existing StandardDialogRenderer
        _CreateGroupMenuRenderer_particles_handler.set(this, void 0);
        _CreateGroupMenuRenderer_input_table.set(this, void 0);
        _CreateGroupMenuRenderer_submit_button.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _CreateGroupMenuRenderer_particles_handler, particles_handler, "f");
        __classPrivateFieldSet(this, _CreateGroupMenuRenderer_input_table, this.setupInputTable(container), "f");
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
        const changes = structuredCloneCustom(__classPrivateFieldGet(this, _CreateGroupMenuRenderer_input_table, "f").prepareChanges());
        __classPrivateFieldGet(this, _CreateGroupMenuRenderer_particles_handler, "f").addGroup(changes);
    }
    remove() {
        __classPrivateFieldGet(this, _CreateGroupMenuRenderer_input_table, "f").remove();
        __classPrivateFieldGet(this, _CreateGroupMenuRenderer_submit_button, "f").remove();
        super.remove();
    }
}
_CreateGroupMenuRenderer_particles_handler = new WeakMap(), _CreateGroupMenuRenderer_input_table = new WeakMap(), _CreateGroupMenuRenderer_submit_button = new WeakMap();
class EditGroupMenuRenderer extends Renderer {
    constructor(group, particles_handler, container) {
        const menu_wrapper = document.createElement('div');
        super(menu_wrapper, 'dialog_menu', `dialog_menu_edit_group_id_${0}`);
        _EditGroupMenuRenderer_group.set(this, void 0);
        _EditGroupMenuRenderer_particles_handler.set(this, void 0);
        _EditGroupMenuRenderer_input_table.set(this, void 0);
        _EditGroupMenuRenderer_submit_button.set(this, void 0);
        _EditGroupMenuRenderer_delete_button.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _EditGroupMenuRenderer_group, group, "f");
        __classPrivateFieldSet(this, _EditGroupMenuRenderer_particles_handler, particles_handler, "f");
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
        input_table.setProperties(properties, all_properties);
        return input_table;
    }
    setupSubmitButton() {
        const button = new ButtonRenderer(this.submit.bind(this));
        button.setLabel('Submit');
        return button;
    }
    setupDeleteButton() {
        const button = new ButtonRenderer(this.submitDelete.bind(this));
        button.setLabel('Delete');
        button.setClassName('delete_button');
        return button;
    }
    refresh() {
        const all_properties = ((_a) => {
            var { group_id, enable_path_tracing } = _a, exposed_properties = __rest(_a, ["group_id", "enable_path_tracing"]);
            return exposed_properties;
        })(DEFAULT_GROUPING);
        __classPrivateFieldGet(this, _EditGroupMenuRenderer_input_table, "f").setProperties(Object.assign({}, __classPrivateFieldGet(this, _EditGroupMenuRenderer_group, "f").getGrouping()), all_properties);
    }
    submit() {
        const group_id_pair = { group_id: __classPrivateFieldGet(this, _EditGroupMenuRenderer_group, "f").getGrouping().group_id }; // group_id cannot be changed at this point
        const changes = structuredCloneCustom(Object.assign(Object.assign({}, group_id_pair), __classPrivateFieldGet(this, _EditGroupMenuRenderer_input_table, "f").prepareChanges()));
        __classPrivateFieldGet(this, _EditGroupMenuRenderer_group, "f").edit(changes);
    }
    submitDelete() {
        __classPrivateFieldGet(this, _EditGroupMenuRenderer_particles_handler, "f").deleteGroup(__classPrivateFieldGet(this, _EditGroupMenuRenderer_group, "f"));
    }
    remove() {
        __classPrivateFieldGet(this, _EditGroupMenuRenderer_input_table, "f").remove();
        __classPrivateFieldGet(this, _EditGroupMenuRenderer_submit_button, "f").remove();
        __classPrivateFieldGet(this, _EditGroupMenuRenderer_delete_button, "f").remove();
        super.remove();
    }
}
_EditGroupMenuRenderer_group = new WeakMap(), _EditGroupMenuRenderer_particles_handler = new WeakMap(), _EditGroupMenuRenderer_input_table = new WeakMap(), _EditGroupMenuRenderer_submit_button = new WeakMap(), _EditGroupMenuRenderer_delete_button = new WeakMap();
class EditParticleMenuRenderer extends Renderer {
    constructor(particle, group, container) {
        const menu_wrapper = document.createElement('div');
        super(menu_wrapper, 'dialog_menu', `dialog_menu_edit_particle_id_${0}`);
        // To be placed inside an existing StandardDialogRenderer
        // input_table again
        // option to delete the Particle
        // "Focus" on the corresponding particle in the container when this window is open
        _EditParticleMenuRenderer_particle.set(this, void 0);
        _EditParticleMenuRenderer_group.set(this, void 0);
        _EditParticleMenuRenderer_input_table.set(this, void 0);
        _EditParticleMenuRenderer_submit_button.set(this, void 0);
        _EditParticleMenuRenderer_delete_button.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _EditParticleMenuRenderer_particle, particle, "f");
        __classPrivateFieldSet(this, _EditParticleMenuRenderer_group, group, "f");
        __classPrivateFieldSet(this, _EditParticleMenuRenderer_input_table, this.setupInputTable(container), "f");
        __classPrivateFieldSet(this, _EditParticleMenuRenderer_submit_button, this.setupSubmitButton(), "f");
        __classPrivateFieldSet(this, _EditParticleMenuRenderer_delete_button, this.setupDeleteButton(), "f");
        this.disableFields(group.getGrouping());
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
        const input_table = new InputTableRenderer(`editParticleId${__classPrivateFieldGet(this, _EditParticleMenuRenderer_particle, "f").getID()}`, properties);
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
    setupDeleteButton() {
        const button = new ButtonRenderer(this.submitDelete.bind(this));
        button.setLabel('Delete');
        button.setClassName('delete_button');
        return button;
    }
    disableFields(grouping) {
        const disable_keys = [];
        Object.keys(grouping).forEach(property => {
            const grouping_value = grouping[property];
            if (grouping_value !== undefined && grouping_value !== 'random')
                disable_keys.push(property); // disable edits to particle properties already specified by the group
        });
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_input_table, "f").syncDisabled(disable_keys);
    }
    refresh() {
        const properties = ((_a) => {
            var { enable_path_tracing } = _a, exposed_properties = __rest(_a, ["enable_path_tracing"]);
            return exposed_properties;
        })(__classPrivateFieldGet(this, _EditParticleMenuRenderer_particle, "f"));
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_input_table, "f").setProperties(properties, properties);
    }
    moveUpdate() {
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_input_table, "f").updateVectorInput('position', __classPrivateFieldGet(this, _EditParticleMenuRenderer_particle, "f").position);
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_input_table, "f").updateVectorInput('velocity', __classPrivateFieldGet(this, _EditParticleMenuRenderer_particle, "f").velocity);
    }
    submit() {
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_particle, "f").edit(__classPrivateFieldGet(this, _EditParticleMenuRenderer_input_table, "f").prepareChanges());
    }
    submitDelete() {
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_group, "f").removeParticle(__classPrivateFieldGet(this, _EditParticleMenuRenderer_particle, "f"));
    }
    remove() {
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_input_table, "f").remove();
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_submit_button, "f").remove();
        __classPrivateFieldGet(this, _EditParticleMenuRenderer_delete_button, "f").remove();
        super.remove();
    }
}
_EditParticleMenuRenderer_particle = new WeakMap(), _EditParticleMenuRenderer_group = new WeakMap(), _EditParticleMenuRenderer_input_table = new WeakMap(), _EditParticleMenuRenderer_submit_button = new WeakMap(), _EditParticleMenuRenderer_delete_button = new WeakMap();
/**
 * Helper class for ParticleSetup Renderer.
 * Handles a set of Renderers that represents the
 * user control interface for a ParticleGroup.
 * Handles ParticleUnitRenderers.
 */
class ParticleUnitGroupRenderer extends Renderer {
    constructor(group, particles_handler, container) {
        const particle_group_element = document.createElement('article');
        super(particle_group_element, 'parsetup_group', `parsetup_group_id${group.getGrouping().group_id}`);
        _ParticleUnitGroupRenderer_group.set(this, void 0);
        _ParticleUnitGroupRenderer_icon.set(this, void 0);
        _ParticleUnitGroupRenderer_details_dialog.set(this, void 0); // maybe make this non-modal to edit outside of the popup?
        _ParticleUnitGroupRenderer_drag_button.set(this, void 0);
        _ParticleUnitGroupRenderer_unit_list.set(this, void 0);
        // Stored Data
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_group, group, "f");
        this.setupObservers(container);
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_icon, this.createIcon(group.getGrouping().color), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_details_dialog, this.setupDetailsDialog(group.getGrouping().group_id, particles_handler, container), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_drag_button, this.setupDragButton(), "f");
        __classPrivateFieldSet(this, _ParticleUnitGroupRenderer_unit_list, new ListRenderer(...Array.from(group.getParticles(), ([id, particle]) => new ParticleUnitRenderer(particle, group, container))), "f");
        // DOM Content
        const header = document.createElement('header');
        header.appendChild(this.createTitleWrapper(group.getGrouping().group_id));
        header.appendChild(this.createButtonsWrapper());
        particle_group_element.appendChild(header);
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_details_dialog, "f").setParent(particle_group_element);
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f").setParent(particle_group_element);
    }
    setupObservers(container) {
        const obs = __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_group, "f").getObservers();
        obs.add(ParticleGroupEvent.Add_Particle, (payload) => { this.addParticleUnit(payload.particle, __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_group, "f"), container); });
        obs.add(ParticleGroupEvent.Delete_Particle, (payload) => { this.deleteParticleUnit(payload.particle, container); });
        obs.add(ParticleGroupEvent.Edit, (payload) => { this.refresh(payload.change_flags); });
        obs.add(ParticleGroupEvent.Overwrite_Particles, () => { });
    }
    createIcon(color) {
        const icon = new Renderer(document.createElement("span"));
        icon.setClassName("parsetup_group_icon");
        if (__classPrivateFieldGet(this, _ParticleUnitGroupRenderer_group, "f").getGrouping().group_id === DEFAULT_GROUPING.group_id)
            icon.getElement().style.display = 'none';
        else
            icon.getElement().style.backgroundColor = color;
        return icon;
    }
    ;
    setupDetailsDialog(group_id, particles_handler, container) {
        const body = new EditGroupMenuRenderer(__classPrivateFieldGet(this, _ParticleUnitGroupRenderer_group, "f"), particles_handler, container.getContainer());
        const details_dialog = new StandardDialogRenderer(body, `particle_group_${group_id}`, `Group: ${group_id}`, true);
        const open_button = details_dialog.getOpenButton();
        const close_button = details_dialog.getCloseButton();
        open_button.setLabel("expand_content", true);
        const open_callback = open_button.getCallback();
        open_button.setCallback(() => {
            open_callback();
            for (const [id, particle] of __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_group, "f").getParticles())
                particle.highlight(true);
            container.toggle_dark_overlay(true);
        });
        close_button.setLabel("close", true);
        const close_callback = close_button.getCallback();
        close_button.setCallback(() => {
            close_callback();
            for (const [id, particle] of __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_group, "f").getParticles())
                particle.highlight(false);
            container.toggle_dark_overlay(false);
        });
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
        return __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_group, "f");
    }
    getDetailsDialog() {
        return __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_details_dialog, "f");
    }
    getUnitList() {
        return __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f");
    }
    refresh(change_flags) {
        const color = __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_group, "f").getGrouping().color;
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_icon, "f").getElement().style.backgroundColor = color === undefined || color === 'random' ? 'black' : color;
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_details_dialog, "f").getBody().refresh();
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f").forEach(unit => {
            const unit_menu = unit.getDetailsDialog().getBody();
            unit_menu.refresh();
            unit_menu.disableFields(__classPrivateFieldGet(this, _ParticleUnitGroupRenderer_group, "f").getGrouping());
            unit.refresh(change_flags);
        });
    }
    addParticleUnit(particle, group, container) {
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f").push(new ParticleUnitRenderer(particle, group, container));
    }
    editParticleUnit(particle, change_flags) {
        const unit = __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f").find(r => r.getParticlePoint().getParticle() === particle);
        if (!unit)
            return; // if particle not in this group
        unit.refresh(change_flags);
    }
    deleteParticleUnit(particle, container) {
        const unit_renderer = __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f").find(r => r.getParticlePoint().getParticle() === particle);
        if (!unit_renderer)
            throw new Error("Particle not found.");
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f").removeItem(unit_renderer);
        container.toggle_dark_overlay(false);
    }
    remove() {
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_icon, "f").remove();
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_details_dialog, "f").remove();
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_drag_button, "f").remove();
        __classPrivateFieldGet(this, _ParticleUnitGroupRenderer_unit_list, "f").remove();
        super.remove();
    }
}
_ParticleUnitGroupRenderer_group = new WeakMap(), _ParticleUnitGroupRenderer_icon = new WeakMap(), _ParticleUnitGroupRenderer_details_dialog = new WeakMap(), _ParticleUnitGroupRenderer_drag_button = new WeakMap(), _ParticleUnitGroupRenderer_unit_list = new WeakMap();
/**
 * Helper class for ParticleUnitGroupRenderer.
 * Handles a set of Renderers that represents
 * the user control interface of a Particle.
 * Handles a single ParticlePointRenderer.
 */
class ParticleUnitRenderer extends Renderer {
    constructor(particle, group, container) {
        const particle_control_element = document.createElement('div');
        super(particle_control_element, 'parsetup_par', `parsetup_par_id${particle.getID()}`);
        _ParticleUnitRenderer_particle_renderer.set(this, void 0);
        _ParticleUnitRenderer_icon.set(this, void 0);
        _ParticleUnitRenderer_details_dialog.set(this, void 0); // maybe make this non-modal to edit outside of the popup?
        _ParticleUnitRenderer_drag_button.set(this, void 0);
        // Stored Data
        this.setupObservers(particle);
        __classPrivateFieldSet(this, _ParticleUnitRenderer_particle_renderer, new ParticlePointRenderer(particle, container), "f");
        __classPrivateFieldSet(this, _ParticleUnitRenderer_icon, this.createIcon(particle.color), "f");
        __classPrivateFieldSet(this, _ParticleUnitRenderer_details_dialog, this.setupDetailsDialog(particle.getID(), group, container), "f");
        __classPrivateFieldSet(this, _ParticleUnitRenderer_drag_button, this.setupDragButton(), "f");
        // DOM Content
        particle_control_element.appendChild(this.createTitleWrapper(particle.getID()));
        particle_control_element.appendChild(this.createButtonsWrapper());
        __classPrivateFieldGet(this, _ParticleUnitRenderer_details_dialog, "f").setParent(particle_control_element);
    }
    setupObservers(particle) {
        const obs = particle.getObservers();
        obs.add(ParticleEvent.Edit, (payload) => { this.refresh(payload.change_flags); });
        obs.add(ParticleEvent.Move, () => { this.moveUpdate(); });
    }
    createIcon(color) {
        const icon = new Renderer(document.createElement("span"));
        icon.setClassName("parsetup_par_icon");
        icon.getElement().style.backgroundColor = color;
        return icon;
    }
    setupDetailsDialog(id, group, container) {
        const body = new EditParticleMenuRenderer(__classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f").getParticle(), group, container.getContainer());
        const details_dialog = new StandardDialogRenderer(body, `particle_${id}`, `Particle: ${id}`, true);
        const open_button = details_dialog.getOpenButton();
        const close_button = details_dialog.getCloseButton();
        open_button.setLabel("expand_content", true);
        const open_callback = open_button.getCallback();
        const new_open_callback = () => {
            open_callback();
            __classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f").getParticle().highlight(true);
            container.toggle_dark_overlay(true);
        };
        open_button.setCallback(new_open_callback);
        // Also open dialog when the particle point in the container is clicked
        __classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f").setSelectCallback(new_open_callback);
        close_button.setLabel("close", true);
        const close_callback = close_button.getCallback();
        close_button.setCallback(() => {
            close_callback();
            __classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f").getParticle().highlight(false);
            container.toggle_dark_overlay(false);
        });
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
    getDetailsDialog() {
        return __classPrivateFieldGet(this, _ParticleUnitRenderer_details_dialog, "f");
    }
    refresh(change_flags) {
        const change_params = [];
        if (change_flags.radius)
            change_params.push('radius');
        if (change_flags.position)
            change_params.push('position');
        if (change_flags.color)
            change_params.push('color');
        if (change_params.includes('color'))
            __classPrivateFieldGet(this, _ParticleUnitRenderer_icon, "f").getElement().style.backgroundColor = __classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f").getParticle().color;
        __classPrivateFieldGet(this, _ParticleUnitRenderer_details_dialog, "f").getBody().refresh();
        __classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f").update(...change_params);
    }
    moveUpdate() {
        __classPrivateFieldGet(this, _ParticleUnitRenderer_details_dialog, "f").getBody().moveUpdate();
        __classPrivateFieldGet(this, _ParticleUnitRenderer_particle_renderer, "f").update('position');
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
        _ParticlePointRenderer_select_callback.set(this, void 0);
        __classPrivateFieldSet(this, _ParticlePointRenderer_particle, particle, "f");
        this.setupParticleObservers();
        __classPrivateFieldSet(this, _ParticlePointRenderer_container, container.getContainer(), "f");
        __classPrivateFieldSet(this, _ParticlePointRenderer_select_callback, (e) => { }, "f");
        this.setParent(container);
        // shape
        particle_element.style.borderRadius = `${particle.radius}px`;
        particle_element.style.width = `${2 * particle.radius}px`;
        particle_element.style.height = `${2 * particle.radius}px`;
        // positioning
        particle_element.style.left = `${(particle.position.x - particle.radius) - container.getContainer().x_min}px`;
        particle_element.style.top = `${container.getContainer().y_max - (particle.position.y + particle.radius)}px`;
        // color
        particle_element.style.backgroundColor = particle.color;
    }
    setupParticleObservers() {
        const par_obs = __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").getObservers();
        par_obs.add(ParticleEvent.Move, () => { this.update('position'); });
        par_obs.add(ParticleEvent.Highlight, () => { this.highlight(); });
    }
    setSelectCallback(callback) {
        __classPrivateFieldSet(this, _ParticlePointRenderer_select_callback, (e) => {
            if (e.target === this.getElement()) {
                callback();
            }
        }, "f");
        this.getElement().addEventListener('click', __classPrivateFieldGet(this, _ParticlePointRenderer_select_callback, "f"));
    }
    setContainer(container) {
        if (__classPrivateFieldGet(this, _ParticlePointRenderer_container, "f") === container)
            return;
        __classPrivateFieldSet(this, _ParticlePointRenderer_container, container, "f");
        const container_element = document.querySelector('.container_element');
        container_element.appendChild(this.getElement());
    }
    update(...properties) {
        const particle_element = this.getElement();
        if (properties.includes('radius')) {
            particle_element.style.borderRadius = `${__classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").radius}px`;
            particle_element.style.width = `${2 * __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").radius}px`;
            particle_element.style.height = `${2 * __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").radius}px`;
        }
        if (properties.includes('position')) {
            particle_element.style.left = `${(__classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").position.x - __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").radius) - __classPrivateFieldGet(this, _ParticlePointRenderer_container, "f").x_min}px`;
            particle_element.style.top = `${__classPrivateFieldGet(this, _ParticlePointRenderer_container, "f").y_max - (__classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").position.y + __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").radius)}px`;
        }
        if (properties.includes('color')) {
            particle_element.style.backgroundColor = __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").color;
        }
    }
    highlight() {
        const particle_element = this.getElement();
        if (__classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f").is_highlighted()) {
            particle_element.classList.add("highlighted_particle_element");
            // particle_element.style.backgroundColor = ParticleHighlightMap[this.#particle.color];
        }
        else {
            particle_element.classList.remove("highlighted_particle_element");
            // particle_element.style.backgroundColor = this.#particle.color;
        }
    }
    getElement() {
        return super.getElement();
    }
    getParticle() {
        return __classPrivateFieldGet(this, _ParticlePointRenderer_particle, "f");
    }
    remove() {
        this.getElement().removeEventListener('click', __classPrivateFieldGet(this, _ParticlePointRenderer_select_callback, "f"));
        super.remove();
    }
}
_ParticlePointRenderer_particle = new WeakMap(), _ParticlePointRenderer_container = new WeakMap(), _ParticlePointRenderer_select_callback = new WeakMap();
