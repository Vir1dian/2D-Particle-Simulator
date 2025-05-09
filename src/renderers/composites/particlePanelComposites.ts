class AddParticleMenuRenderer extends Renderer {
  // To be placed inside an existing StandardDialogRenderer
  #particles_handler: ParticlesHandler;
  #group_selector: SelectRenderer;
  #input_table: InputTableRenderer<string | boolean | number | Vector2D>;  
  #amount_input: NumberInputRenderer;
  #submit_button: ButtonRenderer;

  constructor(particles_handler: ParticlesHandler, container: BoxSpace) {
    const menu_wrapper: HTMLDivElement = document.createElement('div');
    super(menu_wrapper, 'dialog_menu', 'dialog_menu_add_particle');

    // Stored Data
    this.#particles_handler = particles_handler;
    this.setupParticleHandlerObservers();
    this.#input_table = this.setupInputTable(container);
    this.#group_selector = this.setupGroupSelector();  // must be setup after input_table due to the disableFields callback
    this.#amount_input = this.setupAmountInput();
    this.#submit_button = this.setupSubmitButton();

    // DOM Content
    const select_wrapper: HTMLDivElement = document.createElement('div');
    select_wrapper.className = 'menu_item';
    this.#group_selector.getLabelElement().innerText = "Group: ";
    select_wrapper.appendChild(this.#group_selector.getLabelElement());
    this.#group_selector.setParent(select_wrapper);
    menu_wrapper.appendChild(select_wrapper);

    const table_wrapper: HTMLDivElement = document.createElement('div');
    table_wrapper.className = 'menu_item';
    this.#input_table.setParent(table_wrapper);
    menu_wrapper.appendChild(table_wrapper);

    const amount_input_wrapper: HTMLDivElement = document.createElement('div');
    amount_input_wrapper.className = 'menu_item';
    this.#amount_input.getLabelElement().innerText = "Amount: ";
    amount_input_wrapper.appendChild(this.#amount_input.getLabelElement());
    this.#amount_input.setParent(amount_input_wrapper);
    menu_wrapper.appendChild(amount_input_wrapper);

    const submit_wrapper = document.createElement('div');
    submit_wrapper.style.display = 'flex';
    submit_wrapper.style.justifyContent = 'center';
    submit_wrapper.style.marginTop = '8px';
    this.#submit_button.setParent(submit_wrapper);
    menu_wrapper.appendChild(submit_wrapper);
  }
  private setupParticleHandlerObservers(): void {
    const handler_obs = this.#particles_handler.getObservers();
    handler_obs.add(
      ParticleHandlerEvent.Add_Group, 
      (payload) => { 
        this.refresh(ParticleHandlerEvent.Add_Group, payload.group) 
      }
    );
    handler_obs.add(
      ParticleHandlerEvent.Delete_Group, 
      (payload) => { 
        this.refresh(ParticleHandlerEvent.Delete_Group, payload.group) 
      }
    );
    handler_obs.add(
      ParticleHandlerEvent.Overwrite_Groups, 
      () => { 
        this.refresh(ParticleHandlerEvent.Overwrite_Groups) 
      }
    );
  }
  private setupGroupSelector(): SelectRenderer {
    const selector = new SelectRenderer(
      'menu_group_selector_add_particle', 
      Array.from(
        this.#particles_handler.getGroups() as Map<string, ParticleGroup>,
        ([group_id, group]) => new OptionRenderer(group_id)
      )
    );
    const callback = () => {
      const group = this.#particles_handler.getGroups().get(selector.getElement().value);
      if (group) {
        const grouping = group.getGrouping();
        const all_properties = (({group_id, enable_path_tracing, ...exposed_properties}) => exposed_properties)(DEFAULT_GROUPING);
        this.#input_table.setProperties({...grouping}, all_properties);
        this.disableFields(grouping);
      }
    }
    selector.setOnchangeCallback(callback);
    selector.getElement().addEventListener('change', selector.getOnchangeCallback());
    selector.setSelected(0);
    return selector;
  }
  // Actively disable fields depending on the selected group
  private setupInputTable(container: BoxSpace): InputTableRenderer<string | boolean | number | Vector2D> {
    const all_properties = (({group_id, enable_path_tracing, ...exposed_properties}) => exposed_properties)(DEFAULT_GROUPING);
    const input_table = new InputTableRenderer('addParticle', all_properties, true, 'random');
    input_table.setNumberInputBounds(
      ...DEFAULT_BOUNDS, 
      { 
        key: "position", 
        min: {
          x: container.x_min, 
          y: container.y_min
        }, 
        max: {
          x: container.x_max, 
          y: container.y_max
        } 
      }
    );
    return input_table;
  }
  private setupAmountInput(): NumberInputRenderer {
    const input = new NumberInputRenderer('create_particles_amount', 1, 1, 50);
    return input;
  }
  private setupSubmitButton(): ButtonRenderer {
    const button: ButtonRenderer = new ButtonRenderer(this.submit.bind(this));
    button.setLabel('Submit');
    return button;
  }
  private disableFields(grouping: ParticleGrouping): void {
    const disable_keys: string[] = [];
    (Object.keys(grouping) as (keyof ParticleGrouping)[]).forEach(
      property => {
        const grouping_value = grouping[property];
        if (grouping_value !== undefined && grouping_value !== 'random')
          disable_keys.push(property);  // disable edits to particle properties already specified by the group
      }
    );
    this.#input_table.syncDisabled(disable_keys);
  }
  refresh(event: ParticleHandlerEvent, group?: ParticleGroup): void {
    if (event === ParticleHandlerEvent.Add_Group)
      this.#group_selector.addOption(new OptionRenderer((group as ParticleGroup).getGrouping().group_id));
      // something happens here when you add an option and messes up the selector callbacks, FIX IT!
    else if (event === ParticleHandlerEvent.Delete_Group)
      this.#group_selector.removeOption(group?.getGrouping().group_id as string);
    else if (event === ParticleHandlerEvent.Overwrite_Groups) {
      this.#group_selector.empty();
      for (const key of this.#particles_handler.getGroups().keys()) 
        this.#group_selector.addOption(new OptionRenderer(key));
    }
    const current_group = this.#particles_handler.getGroups().get(this.#group_selector.getElement().value);
    if (current_group) {
      this.disableFields(current_group.getGrouping());
    }
  }
  submit(): void {
    const group = this.#particles_handler.getGroups().get(this.#group_selector.getElement().value);
    if (!group) throw new Error("Group id not found in ParticleHandler.");
    for (let i = 0; i < this.#amount_input.getNumberValue(); i++) {
      const new_particle = new Particle(
        { group_id: this.#group_selector.getElement().value, ...this.#input_table.prepareChanges() }
      );
      this.#particles_handler.addParticle(new_particle, group);
    }
  }
  remove(): void {
    this.#group_selector.getElement().removeEventListener('change', this.#group_selector.getOnchangeCallback());
    this.#group_selector.remove();
    this.#input_table.remove();
    this.#amount_input.remove();
    this.#submit_button.remove();
    super.remove();
  }
}

class CreateGroupMenuRenderer extends Renderer {
  // To be placed inside an existing StandardDialogRenderer
  #particles_handler: ParticlesHandler;
  #input_table: InputTableRenderer<string | boolean | number | Vector2D>;  
  #submit_button: ButtonRenderer;

  constructor(particles_handler: ParticlesHandler, container: BoxSpace) {
    const menu_wrapper: HTMLDivElement = document.createElement('div');
    super(menu_wrapper, 'dialog_menu', 'dialog_menu_create_group');

    // Stored Data
    this.#particles_handler = particles_handler;
    this.#input_table = this.setupInputTable(container);
    this.#submit_button = this.setupSubmitButton();

    // DOM Content
    const table_wrapper: HTMLDivElement = document.createElement('div');
    table_wrapper.className = 'menu_item';
    this.#input_table.setParent(table_wrapper);
    menu_wrapper.appendChild(table_wrapper);

    const submit_wrapper = document.createElement('div');
    submit_wrapper.style.display = 'flex';
    submit_wrapper.style.justifyContent = 'center';
    submit_wrapper.style.marginTop = '8px';
    this.#submit_button.setParent(submit_wrapper);
    menu_wrapper.appendChild(submit_wrapper);
  }
  private setupInputTable(container: BoxSpace): InputTableRenderer<string | boolean | number | Vector2D> {
    const properties = (({enable_path_tracing, ...exposed_properties}) => exposed_properties)(DEFAULT_GROUPING);
    const input_table = new InputTableRenderer('createGroup', properties, true, 'random', 'unspecified');
    input_table.setNumberInputBounds(
      ...DEFAULT_BOUNDS, 
      { 
        key: "position", 
        min: {
          x: container.x_min, 
          y: container.y_min
        }, 
        max: {
          x: container.x_max, 
          y: container.y_max
        } 
      }
    );
    return input_table;
  }
  private setupSubmitButton(): ButtonRenderer {
    const button: ButtonRenderer = new ButtonRenderer(this.submit.bind(this));
    button.setLabel('Submit');
    return button;
  }
  submit(): void {
    // make sure to validate group_id if it already exists or not
    // make group_id snake case
    const changes: ParticleGrouping = structuredCloneCustom(this.#input_table.prepareChanges() as unknown as ParticleGrouping);
    this.#particles_handler.addGroup(changes);
  }
  remove(): void {
    this.#input_table.remove();
    this.#submit_button.remove();
    super.remove();
  }
}

class EditGroupMenuRenderer extends Renderer {
  #group: ParticleGroup;
  #particles_handler: ParticlesHandler;
  #input_table: InputTableRenderer<string | boolean | number | Vector2D>;  
  #submit_button: ButtonRenderer;
  #delete_button: ButtonRenderer;
  constructor(group: ParticleGroup, particles_handler: ParticlesHandler, container: BoxSpace) {
    const menu_wrapper: HTMLDivElement = document.createElement('div');
    super(menu_wrapper, 'dialog_menu', `dialog_menu_edit_group_id_${0}`);

    // Stored Data
    this.#group = group;
    this.#particles_handler = particles_handler;
    this.#input_table = this.setupInputTable(container);
    this.#submit_button = this.setupSubmitButton();
    this.#delete_button = this.setupDeleteButton();

    // DOM Content
    const table_wrapper: HTMLDivElement = document.createElement('div');
    table_wrapper.className = 'menu_item';
    this.#input_table.setParent(table_wrapper);
    menu_wrapper.appendChild(table_wrapper);

    const buttons_wrapper = document.createElement('div');
    buttons_wrapper.style.display = 'flex';
    buttons_wrapper.style.justifyContent = 'center';
    buttons_wrapper.style.marginTop = '8px';
    this.#submit_button.setParent(buttons_wrapper);
    this.#delete_button.setParent(buttons_wrapper);
    menu_wrapper.appendChild(buttons_wrapper);
  }
  private setupInputTable(container: BoxSpace): InputTableRenderer<string | boolean | number | Vector2D> {
    const all_properties = (({group_id, enable_path_tracing, ...exposed_properties}) => exposed_properties)(DEFAULT_GROUPING);  
    const input_table = new InputTableRenderer(`editGroupId${this.#group.getGrouping().group_id}`, all_properties, true, 'random', 'unspecified');
    input_table.setNumberInputBounds(
      ...DEFAULT_BOUNDS, 
      { 
        key: "position", 
        min: {
          x: container.x_min, 
          y: container.y_min
        }, 
        max: {
          x: container.x_max, 
          y: container.y_max
        } 
      }
    );
    const properties = (({group_id, enable_path_tracing, ...exposed_properties}) => exposed_properties)(this.#group.getGrouping());
    input_table.setProperties(properties, all_properties);
    return input_table;
  }
  private setupSubmitButton(): ButtonRenderer {
    const button: ButtonRenderer = new ButtonRenderer(this.submit.bind(this));
    button.setLabel('Submit');
    return button;
  }
  private setupDeleteButton(): ButtonRenderer {
    const button: ButtonRenderer = new ButtonRenderer(this.submitDelete.bind(this));
    button.setLabel('Delete');
    button.setClassName('delete_button');
    return button;
  }
  refresh(): void {
    const all_properties = (({group_id, enable_path_tracing, ...exposed_properties}) => exposed_properties)(DEFAULT_GROUPING);  
    this.#input_table.setProperties({...this.#group.getGrouping()}, all_properties);
  }
  submit(): void {
    const group_id_pair = { group_id: this.#group.getGrouping().group_id };  // group_id cannot be changed at this point
    const changes: ParticleGrouping = structuredCloneCustom({...group_id_pair, ...this.#input_table.prepareChanges()} as unknown as ParticleGrouping);
    this.#group.edit(changes);
  }
  submitDelete(): void {
    this.#particles_handler.deleteGroup(this.#group);
  }
  remove(): void {
    this.#input_table.remove()
    this.#submit_button.remove();
    this.#delete_button.remove();
    super.remove();
  }
}

class EditParticleMenuRenderer extends Renderer {
  // To be placed inside an existing StandardDialogRenderer
  // input_table again
  // option to delete the Particle
  // "Focus" on the corresponding particle in the container when this window is open
  #particle: Particle;
  #group: ParticleGroup;
  #input_table: InputTableRenderer<string | boolean | number | Vector2D>;  
  #submit_button: ButtonRenderer;
  #delete_button: ButtonRenderer;
  constructor(particle: Particle, group: ParticleGroup, container: BoxSpace) {
    const menu_wrapper: HTMLDivElement = document.createElement('div');
    super(menu_wrapper, 'dialog_menu', `dialog_menu_edit_particle_id_${0}`);

    // Stored Data
    this.#particle = particle;
    this.#group = group;
    this.#input_table = this.setupInputTable(container);
    this.#submit_button = this.setupSubmitButton();
    this.#delete_button = this.setupDeleteButton();

    this.disableFields(group.getGrouping());

    // DOM Content
    const table_wrapper: HTMLDivElement = document.createElement('div');
    table_wrapper.className = 'menu_item';
    this.#input_table.setParent(table_wrapper);
    menu_wrapper.appendChild(table_wrapper);

    const buttons_wrapper = document.createElement('div');
    buttons_wrapper.style.display = 'flex';
    buttons_wrapper.style.justifyContent = 'center';
    buttons_wrapper.style.marginTop = '8px';
    this.#submit_button.setParent(buttons_wrapper);
    this.#delete_button.setParent(buttons_wrapper);
    menu_wrapper.appendChild(buttons_wrapper);
  }
  private setupInputTable(container: BoxSpace): InputTableRenderer<string | boolean | number | Vector2D> {
    const properties = (({enable_path_tracing, ...exposed_properties}) => exposed_properties)(this.#particle);
    // allow only some fields to be editable depending on what is unspecified or randomized by the group
    const input_table = new InputTableRenderer(`editParticleId${this.#particle.getID()}`, properties);
    input_table.setNumberInputBounds(
      ...DEFAULT_BOUNDS, 
      { 
        key: "position", 
        min: {
          x: container.x_min, 
          y: container.y_min
        }, 
        max: {
          x: container.x_max, 
          y: container.y_max
        } 
      }
    );
    return input_table;
  }
  private setupSubmitButton(): ButtonRenderer {
    const button: ButtonRenderer = new ButtonRenderer(this.submit.bind(this));
    button.setLabel('Submit');
    return button;
  }
  private setupDeleteButton(): ButtonRenderer {
    const button: ButtonRenderer = new ButtonRenderer(this.submitDelete.bind(this));
    button.setLabel('Delete');
    button.setClassName('delete_button');
    return button;
  }
  disableFields(grouping: ParticleGrouping): void {
    const disable_keys: string[] = [];
    (Object.keys(grouping) as (keyof ParticleGrouping)[]).forEach(
      property => {
        const grouping_value = grouping[property];
        if (grouping_value !== undefined && grouping_value !== 'random')
          disable_keys.push(property);  // disable edits to particle properties already specified by the group
      }
    );
    this.#input_table.syncDisabled(disable_keys);
  }
  refresh(): void {
    const properties = (({enable_path_tracing, ...exposed_properties}) => exposed_properties)(this.#particle);
    this.#input_table.setProperties(properties, properties);
  }
  moveUpdate(): void {
    this.#input_table.updateVectorInput('position', this.#particle.position);
    this.#input_table.updateVectorInput('velocity', this.#particle.velocity);
  }
  submit(): void {
    console.log(this.#input_table.prepareChanges() as Record<string, keyof Particle>)
    this.#particle.edit(this.#input_table.prepareChanges() as Record<string, keyof Particle>);
  }
  submitDelete(): void {
    this.#group.removeParticle(this.#particle);
  }
  remove(): void {
    this.#input_table.remove();
    this.#submit_button.remove();
    this.#delete_button.remove();
    super.remove();
  }
}

/**
 * Helper class for ParticleSetup Renderer.
 * Handles a set of Renderers that represents the 
 * user control interface for a ParticleGroup.
 * Handles ParticleUnitRenderers.
 */
class ParticleUnitGroupRenderer extends Renderer {
  #group: ParticleGroup;
  #icon: Renderer;
  #details_dialog: StandardDialogRenderer<EditGroupMenuRenderer>;  // maybe make this non-modal to edit outside of the popup?
  #drag_button: ButtonRenderer;
  #unit_list: ListRenderer<ParticleUnitRenderer>;
  
  constructor(group: ParticleGroup, particles_handler: ParticlesHandler, container: ContainerRenderer) {
    const particle_group_element: HTMLElement = document.createElement('article');
    super(particle_group_element, 'parsetup_group', `parsetup_group_id${group.getGrouping().group_id}`);

    // Stored Data
    this.#group = group;
    this.setupObservers(container);
    this.#icon = this.createIcon(group.getGrouping().color as string);
    this.#details_dialog = this.setupDetailsDialog(group.getGrouping().group_id, particles_handler, container.getContainer());
    this.#drag_button = this.setupDragButton();
    this.#unit_list = new ListRenderer<ParticleUnitRenderer>(...Array.from(
      group.getParticles(), ([id, particle]) => new ParticleUnitRenderer(particle, group, container)
    ));
    // DOM Content
    const header: HTMLElement = document.createElement('header');
    header.appendChild(this.createTitleWrapper(group.getGrouping().group_id));
    header.appendChild(this.createButtonsWrapper());
    particle_group_element.appendChild(header);
    this.#details_dialog.setParent(particle_group_element);
    this.#unit_list.setParent(particle_group_element);
  }
  private setupObservers(container: ContainerRenderer): void {
    const obs = this.#group.getObservers();
    obs.add(ParticleGroupEvent.Add_Particle, (payload) => { this.addParticleUnit(payload.particle, this.#group, container) });
    obs.add(ParticleGroupEvent.Delete_Particle, (payload) => { this.deleteParticleUnit(payload.particle) });
    obs.add(ParticleGroupEvent.Edit, (payload) => { this.refresh(payload.change_flags) });
    obs.add(ParticleGroupEvent.Overwrite_Particles, () => {});
  }
  private createIcon(color: string): Renderer {
    const icon = new Renderer(document.createElement("span"));
    icon.setClassName("parsetup_group_icon");
    if (this.#group.getGrouping().group_id === DEFAULT_GROUPING.group_id)
      icon.getElement().style.display = 'none';
    else icon.getElement().style.backgroundColor = color;
    return icon;
  };
  private setupDetailsDialog(group_id: string, particles_handler: ParticlesHandler, container: BoxSpace): StandardDialogRenderer<EditGroupMenuRenderer> {
    const body = new EditGroupMenuRenderer(this.#group, particles_handler, container);
    const details_dialog = new StandardDialogRenderer(body, `particle_group_${group_id}`, `Group: ${group_id}`, true);
    details_dialog.getOpenButton().setLabel("expand_content", true);
    details_dialog.getCloseButton().setLabel("close", true);

    // Entire setup for dialog details

    return details_dialog;
  };
  private setupDragButton(): ButtonRenderer {
    const drag_button = new ButtonRenderer(
      ()=>{
        // Draggable button WIP (see Drag and Drop API)
      }, 
      'drag'  // Draggable button WIP (see Drag and Drop API)
    )
    drag_button.setClassName("material-symbols-sharp icon drag_icon");
    drag_button.getElement().innerHTML = "drag_handle";
    return drag_button;
  };
  private createTitleWrapper(group_id: string): HTMLDivElement {
    const title_wrapper : HTMLDivElement = document.createElement('div');
    title_wrapper.className = "parsetup_group_title_wrapper";
    this.#icon.setParent(title_wrapper);
    const title : HTMLSpanElement = document.createElement('span');
    title.className = "parsetup_group_title";
    title.innerHTML = group_id;
    title_wrapper.appendChild(title);
    return title_wrapper;
  };
  private createButtonsWrapper(): HTMLDivElement {
    const buttons_wrapper : HTMLDivElement = document.createElement('div');
    buttons_wrapper.className = "parsetup_group_buttons_wrapper";
    this.#details_dialog.getOpenButton().setParent(buttons_wrapper);
    this.#drag_button.setParent(buttons_wrapper);
    return buttons_wrapper;
  };
  getParticleGroup(): ParticleGroup {
    return this.#group;
  }
  getDetailsDialog(): StandardDialogRenderer<EditGroupMenuRenderer> {
    return this.#details_dialog;
  }
  getUnitList(): ListRenderer<ParticleUnitRenderer> {
    return this.#unit_list;
  }
  refresh(change_flags: { [K in keyof ParticleGrouping]: boolean }): void {
    const color = this.#group.getGrouping().color;
    this.#icon.getElement().style.backgroundColor = color === undefined || color === 'random' ? 'black' : color;
    this.#details_dialog.getBody().refresh();
    this.#unit_list.forEach(unit => {
      const unit_menu = unit.getDetailsDialog().getBody();
      unit_menu.refresh();
      unit_menu.disableFields(this.#group.getGrouping());
      unit.refresh(change_flags);
    });
  }
  addParticleUnit(particle: Particle, group: ParticleGroup, container: ContainerRenderer): void {
    this.#unit_list.push(new ParticleUnitRenderer(particle, group, container));
  }
  editParticleUnit(particle: Particle, change_flags: { [K in keyof Particle]: boolean }): void {
    const unit = this.#unit_list.find(r => r.getParticlePoint().getParticle() === particle);
    if (!unit) return;  // if particle not in this group
    unit.refresh(change_flags);
    console.log(this.#group.getParticles());  
  }
  deleteParticleUnit(particle: Particle): void {
    const unit_renderer = this.#unit_list.find(
      r => r.getParticlePoint().getParticle() === particle
    );
    if (!unit_renderer) throw new Error("Particle not found.");
    this.#unit_list.removeItem(unit_renderer);
  }
  remove(): void {
    this.#icon.remove();
    this.#details_dialog.remove();
    this.#drag_button.remove();
    this.#unit_list.remove();
    super.remove();
  }
}


/**
 * Helper class for ParticleUnitGroupRenderer.
 * Handles a set of Renderers that represents
 * the user control interface of a Particle.
 * Handles a single ParticlePointRenderer.
 */
class ParticleUnitRenderer extends Renderer {
  #particle_renderer: ParticlePointRenderer;
  #icon: Renderer;
  #details_dialog: StandardDialogRenderer<EditParticleMenuRenderer>;  // maybe make this non-modal to edit outside of the popup?
  #drag_button: ButtonRenderer;
  constructor(particle: Particle, group: ParticleGroup, container: ContainerRenderer) {
    const particle_control_element : HTMLDivElement = document.createElement('div');
    super(particle_control_element, 'parsetup_par', `parsetup_par_id${particle.getID()}`);

    // Stored Data
    this.setupObservers(particle);
    this.#particle_renderer = new ParticlePointRenderer(particle, container);
    this.#icon = this.createIcon(particle.color);
    this.#details_dialog = this.setupDetailsDialog(particle.getID(), group, container.getContainer());
    this.#drag_button = this.setupDragButton(); 

    // DOM Content
    particle_control_element.appendChild(this.createTitleWrapper(particle.getID()));
    particle_control_element.appendChild(this.createButtonsWrapper());
    this.#details_dialog.setParent(particle_control_element);
  }
  private setupObservers(particle: Particle): void {
    const obs = particle.getObservers();
    obs.add(ParticleEvent.Edit, (payload) => { this.refresh(payload.change_flags) });
    obs.add(ParticleEvent.Move, () => { this.moveUpdate() });
  }
  private createIcon(color: string): Renderer {
    const icon = new Renderer(document.createElement("span"));
    icon.setClassName("parsetup_par_icon");
    icon.getElement().style.backgroundColor = color;
    return icon;
  }
  private setupDetailsDialog(id: number, group: ParticleGroup, container: BoxSpace): StandardDialogRenderer<EditParticleMenuRenderer> {
    const body = new EditParticleMenuRenderer(this.#particle_renderer.getParticle(), group, container);
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
  private setupDragButton(): ButtonRenderer {
    const drag_button = new ButtonRenderer(
      ()=>{
        // Draggable button WIP (see Drag and Drop API)
      }, 
      'drag'  // Draggable button WIP (see Drag and Drop API) // might have to do manually
    )
    drag_button.setClassName("material-symbols-sharp icon drag_icon");
    drag_button.getElement().innerHTML = "drag_handle";
    return drag_button;
  }
  private createTitleWrapper(id: number): HTMLDivElement {
    const title_wrapper : HTMLDivElement = document.createElement('div');
    title_wrapper.className = "parsetup_par_title_wrapper";
    this.#icon.setParent(title_wrapper);
    const title : HTMLSpanElement = document.createElement('span');
    title.className = "parsetup_par_title";
    title.innerHTML = id.toString();
    title_wrapper.appendChild(title);
    return title_wrapper;
  }
  private createButtonsWrapper(): HTMLDivElement {
    const buttons_wrapper : HTMLDivElement = document.createElement('div');
    buttons_wrapper.className = "parsetup_par_buttons_wrapper";
    this.#details_dialog.getOpenButton().setParent(buttons_wrapper);
    this.#drag_button.setParent(buttons_wrapper);
    return buttons_wrapper;
  }
  getElement(): HTMLDivElement {
    return super.getElement() as HTMLDivElement;
  }
  getParticlePoint(): ParticlePointRenderer {
    return this.#particle_renderer;
  }
  getDetailsDialog(): StandardDialogRenderer<EditParticleMenuRenderer> {
    return this.#details_dialog;
  }
  refresh(change_flags: { [K in keyof (Particle | ParticleGrouping)]: boolean }): void {
    const change_params: ('radius' | 'position' | 'color')[] = [];
    if (change_flags.radius) change_params.push('radius');
    if (change_flags.position) change_params.push('position');
    if (change_flags.color) change_params.push('color');
    if (change_params.includes('color')) 
      this.#icon.getElement().style.backgroundColor = this.#particle_renderer.getParticle().color;
    this.#details_dialog.getBody().refresh();
    this.#particle_renderer.update(...change_params);
  }
  moveUpdate(): void {
    this.#details_dialog.getBody().moveUpdate();
    this.#particle_renderer.update('position');
  }
  remove(): void {
    this.#particle_renderer.remove();
    this.#icon.remove();
    this.#details_dialog.remove();
    this.#drag_button.remove();
    super.remove();
  }
}

/**
 * Helper class for ParticleUnitRenderer.
 * Handles a Renderer belonging to a Simulation container 
 * that represents a Particle as a circular point with
 * the correct styling. 
 */
class ParticlePointRenderer extends Renderer { 
  #particle: Particle;
  #container: BoxSpace;
  constructor(particle: Particle, container: ContainerRenderer) {
    const particle_element : HTMLDivElement = document.createElement('div');
    super(particle_element, 'particle_element', `particle_element_id${particle.getID()}`);

    this.#particle = particle;
    this.setupObservers();
    this.#container = container.getContainer();

    this.setParent(container);

    // shape
    particle_element.style.borderRadius = `${particle.radius}px`;
    particle_element.style.width = `${2*particle.radius}px`;
    particle_element.style.height = `${2*particle.radius}px`;
    // positioning
    particle_element.style.left = `${(particle.position.x - particle.radius) - container.getContainer().x_min}px`;
    particle_element.style.top = `${container.getContainer().y_max - (particle.position.y + particle.radius)}px`;
    // color
    particle_element.style.backgroundColor = particle.color;
  }
  private setupObservers(): void {
    const obs = this.#particle.getObservers();
    obs.add(ParticleEvent.Move, () => {this.update('position')});
  }

  getElement(): HTMLDivElement {
    return super.getElement() as HTMLDivElement;
  }
  getParticle(): Particle {
    return this.#particle;
  }
  setContainer(container: BoxSpace): void {
    if (this.#container === container) return;
    this.#container = container;
    const container_element : HTMLDivElement = document.querySelector('.container_element') as HTMLDivElement;
    container_element.appendChild(this.getElement());
  }
  update(...properties: ('radius' | 'position' | 'color')[]): void {
    const particle_element : HTMLDivElement = this.getElement() as HTMLDivElement;
    if (properties.includes('radius')) {
      particle_element.style.borderRadius = `${this.#particle.radius}px`;
      particle_element.style.width = `${2*this.#particle.radius}px`;
      particle_element.style.height = `${2*this.#particle.radius}px`;
    }
    if (properties.includes('position')) {
      particle_element.style.left = `${(this.#particle.position.x - this.#particle.radius) - this.#container.x_min}px`;
      particle_element.style.top = `${this.#container.y_max - (this.#particle.position.y + this.#particle.radius)}px`;
    }
    if (properties.includes('color')) {
      particle_element.style.backgroundColor = this.#particle.color;
    }
  }
}