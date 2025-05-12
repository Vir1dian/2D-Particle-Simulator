// UI Config Renderers -- May implement a separate UIHandler class from Simulation
class UIControlRenderer extends Renderer {  // May extend from a TableRenderer or a ListRenderer instead
  // WIP: Will need methods to handle Simulation Class's calls
  #simulation: Simulation
  // may create a UIConfig class soon
  constructor(simulation: Simulation) {
    const ui_settings_element : HTMLDivElement = document.createElement('div');
    super(ui_settings_element);
    this.#simulation = simulation;
  }

  remove(): void {
    super.remove();
  }
}

class ContainerRenderer extends Renderer {
  #container: BoxSpace;
  #grav_field: XYVectorField;
  #elec_field: XYVectorField;
  #mag_field: ZVectorField;
  #dark_overlay: HTMLDivElement;
  constructor(simulation: Simulation) {
    const container_element : HTMLElement = document.createElement('div');
    super(container_element, "container_element");

    // Stored Data
    this.#container = simulation.getContainer();
    simulation.getObservers().add(
      SimEvent.Update_Container, 
      () => {this.resize(this.#container)}
    );
    this.#grav_field = this.setupGravField(simulation);
    this.#elec_field = this.setupElecField(simulation);
    this.#mag_field = this.setupMagField(simulation);
    this.#dark_overlay = this.setupDarkOverlay();

    // Content
    this.#grav_field.setArrowsParent(this);
    this.#elec_field.setArrowsParent(this);
    this.#mag_field.setArrowsParent(this);
    this.getElement().appendChild(this.#dark_overlay);
    container_element.style.width = `${this.#container.x_max - this.#container.x_min}px`;
    container_element.style.height = `${this.#container.y_max - this.#container.y_min}px`;
  }
  private setupGravField(simulation: Simulation): XYVectorField {
    const field = new XYVectorField(this.#container, 60, 20);
    const vector = simulation.getEnvironment()!.statics!.gravity!;
    field.setMagnitude(vector.magnitude());
    field.pointAt(vector);
    field.setColor('thistle');

    // TODO: set color to purple, add observers for resize + simulation environment events

    return field;
  }
  private setupElecField(simulation: Simulation): XYVectorField {
    const field = new XYVectorField(this.#container, 60, 40);
    const vector = simulation.getEnvironment()!.statics!.electric_field!;
    field.setMagnitude(vector.magnitude());
    field.pointAt(vector);
    field.setColor('lightsalmon');

    // TODO: set color to red, add observers for resize + simulation environment events

    return field;
  }
  private setupMagField(simulation: Simulation): ZVectorField {
    const scalar = simulation.getEnvironment()!.statics!.magnetic_field!;
    const field = new ZVectorField(this.#container, 60, 60, scalar, 'turquoise');

    // TODO: set color to blue, add observers for resize + simulation environment events

    return field;
  }
  private setupDarkOverlay(): HTMLDivElement {
    const overlay = document.createElement('div');
    overlay.className = 'container_dark_overlay';
    return overlay;
  }
  resize(container: BoxSpace): void {
    console.log(container);
    this.getElement().style.width = `${container.x_max - container.x_min}px`;
    this.getElement().style.height = `${container.y_max - container.y_min}px`;
  }
  toggle_dark_overlay(value: boolean = true): void {
    this.#dark_overlay.style.display = value ? 'block' : 'none';
  }
  getContainer(): BoxSpace {
    return this.#container;
  }
  remove(): void {
    this.#dark_overlay.remove();
    super.remove();
  }
}

class EnvironmentPanelRenderer extends Renderer {
  #preset_handler: PresetInputRenderer;
  #environment_handler: EnvironmentSetupRenderer;
  constructor(simulation: Simulation) {
    const environment_panel: HTMLElement = document.createElement('article');
    super(environment_panel, 'control_item', 'control_simsetup');

    // Stored Data
    this.#preset_handler = new PresetInputRenderer(simulation);
    this.#environment_handler = new EnvironmentSetupRenderer(simulation);

    // Content
    const header: HTMLElement = document.createElement('header');
    header.innerHTML = "Environment Setup";
    environment_panel.appendChild(header);
    this.#preset_handler.setParent(environment_panel);
    this.#environment_handler.setParent(environment_panel);
  }

  remove(): void {
    this.#preset_handler.remove();
    this.#environment_handler.remove();
    super.remove();
  }
}

// Particle Interface Renderers
/**
 * Helper class for SimulationRenderer
 * Handles ParticleUnitGroupRenderers which
 * collectively send changes to Simulation's
 * #particle_groups property.
 */
class ParticlePanelRenderer extends Renderer {  // TODO: Add particles/groups, dialogs
  #particles_handler: ParticlesHandler;
  #container: ContainerRenderer;
  #add_particles_dialog: StandardDialogRenderer<AddParticleMenuRenderer>;
  #create_group_dialog: StandardDialogRenderer<CreateGroupMenuRenderer>;
  #group_list: ListRenderer<ParticleUnitGroupRenderer>;

  constructor(particles_handler: ParticlesHandler, container: ContainerRenderer) {
    const particle_panel: HTMLElement = document.createElement('article');
    super(particle_panel, 'control_item', 'control_parsetup');

    // Saved Data
    this.#particles_handler = particles_handler;
    this.setupObservers(container);
    this.#container = container;
    this.#add_particles_dialog = this.setupAddParticlesDialog();
    this.#create_group_dialog = this.setupCreateGroupDialog();
    this.#group_list = new ListRenderer<ParticleUnitGroupRenderer>(...Array.from(
      particles_handler.getGroups() as Map<string, ParticleGroup>, 
      ([group_id, group]) => new ParticleUnitGroupRenderer(group, particles_handler, container)
    ));

    // Content
    const header: HTMLElement = document.createElement('header');
    header.innerHTML = "Particle Setup";
    particle_panel.appendChild(header);

    particle_panel.appendChild(this.createButtonsWrapper());
    this.#add_particles_dialog.setParent(particle_panel);
    this.#create_group_dialog.setParent(particle_panel);

    const list_wrapper: HTMLDivElement = document.createElement('div');
    list_wrapper.id = "parsetup_groups_wrapper";
    this.#group_list.setParent(list_wrapper);
    particle_panel.appendChild(list_wrapper);
  }
  private setupObservers(container: ContainerRenderer): void {
    const obs = this.#particles_handler.getObservers();
    obs.add(ParticleHandlerEvent.Add_Group, (payload) => { this.addGroup(payload.group) });
    obs.add(ParticleHandlerEvent.Delete_Group, (payload) => { this.deleteGroup(payload.group, container) });
    obs.add(ParticleHandlerEvent.Overwrite_Groups, () => { this.overwriteGroupList() });
  }
  private setupAddParticlesDialog(): StandardDialogRenderer<AddParticleMenuRenderer> {
    const body = new AddParticleMenuRenderer(this.#particles_handler, this.#container.getContainer());
    const dialog = new StandardDialogRenderer(body, 'parsetup_add_particle_dialog', 'Add Particles', true);
    dialog.getOpenButton().setLabel("Add Particles");
    dialog.getCloseButton().setLabel("close", true);
    return dialog;
  }
  private setupCreateGroupDialog(): StandardDialogRenderer<CreateGroupMenuRenderer> {
    const body = new CreateGroupMenuRenderer(this.#particles_handler, this.#container.getContainer());
    const dialog = new StandardDialogRenderer(body, 'parsetup_add_group_dialog', 'Create Group', true);
    dialog.getOpenButton().setLabel("Create Group");
    dialog.getCloseButton().setLabel("close", true);

    return dialog;
  }
  private createButtonsWrapper(): HTMLDivElement {
    const buttons_wrapper : HTMLDivElement = document.createElement('div');
    buttons_wrapper.id = "parsetup_buttons_wrapper";
    this.#add_particles_dialog.getOpenButton().setParent(buttons_wrapper);
    this.#create_group_dialog.getOpenButton().setParent(buttons_wrapper);
    return buttons_wrapper;
  }
  getGroupList(): ListRenderer<ParticleUnitGroupRenderer> {
    return this.#group_list;
  }
  addGroup(group: ParticleGroup): void {
    console.log("adding a group")
    this.#group_list.push(new ParticleUnitGroupRenderer(group, this.#particles_handler, this.#container));
  }
  editGroup(group: ParticleGroup, changes_log: { [K in keyof ParticleGrouping]: boolean }): void {
    console.log("editing a group")
    const group_renderer = this.#group_list.find(item => 
      item
      .getParticleGroup()
      .getGrouping()
      .group_id 
      === 
      group
      .getGrouping()
      .group_id
    );
    // uses a changes_log to only refresh changed properties without affecting resetting unchanged 
    if (!group_renderer) throw new Error("Group not found.");
    // physical properties of Particle units in the Simulation container such as radius, color, and position
    group_renderer.refresh(changes_log);
  }
  deleteGroup(group: ParticleGroup, container: ContainerRenderer): void {
    console.log("deleting a group")
    const group_renderer = this.#group_list.find(item => 
      item.getParticleGroup() === group
    );
    if (!group_renderer) throw new Error("Group not found.");
    this.#group_list.removeItem(group_renderer);
    container.toggle_dark_overlay(false);
  }
  overwriteGroupList(): void {
    console.log("overwriting a group")
    this.#group_list.empty();
    Array.from(
      this.#particles_handler.getGroups() as Map<string, ParticleGroup>, 
      ([group_id, group]) => new ParticleUnitGroupRenderer(group, this.#particles_handler, this.#container)
    ).forEach(group_renderer => this.#group_list.push(group_renderer));
  }
  remove(): void {
    this.#add_particles_dialog.remove();
    this.#create_group_dialog.remove();
    this.#group_list.remove();
    super.remove();
  }
}