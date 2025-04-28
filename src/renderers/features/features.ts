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

class EnvironmentPanelRenderer extends Renderer {
  #simulation: Simulation;
  #preset_handler: PresetInputRenderer;
  #environment_handler: EnvironmentSetupRenderer;
  constructor(simulation: Simulation) {
    const environment_panel: HTMLElement = document.createElement('article');
    super(environment_panel, 'control_item', 'control_simsetup');

    // Stored Data
    this.#simulation = simulation;
    this.#preset_handler = new PresetInputRenderer(simulation);
    this.#environment_handler = new EnvironmentSetupRenderer(simulation);

    // HTML Content
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
  #container: BoxSpace
  #add_particles_dialog: StandardDialogRenderer<AddParticleMenuRenderer>;
  #create_group_dialog: StandardDialogRenderer<CreateGroupMenuRenderer>;
  #group_list: ListRenderer<ParticleUnitGroupRenderer>;

  constructor(particles_handler: ParticlesHandler, container: BoxSpace) {
    const particle_panel: HTMLElement = document.createElement('article');
    super(particle_panel, 'control_item', 'control_parsetup');

    // Saved Data
    particles_handler.add_observer(ParticleEvent.Update_Particle_Groups, (payload?) => {
      if (payload?.operation === "add") this.addGroup(payload.data as ParticleGroup);
      else if (payload?.operation === "edit") this.editGroup(payload.data as ParticleGroup, payload.data2 as { [K in keyof ParticleGrouping]: boolean });
      else if (payload?.operation === "delete") this.deleteGroup(payload.data as string);
      else if (payload?.operation === "overwrite") this.overwriteGroupList();
    });
    this.#particles_handler = particles_handler;
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
  private setupAddParticlesDialog(): StandardDialogRenderer<AddParticleMenuRenderer> {
    const body = new AddParticleMenuRenderer(this.#particles_handler, this.#container);
    const dialog = new StandardDialogRenderer(body, 'parsetup_add_particle_dialog', 'Add Particles', true);
    dialog.getOpenButton().setLabel("Add Particles");
    dialog.getCloseButton().setLabel("close", true);
    return dialog;
  }
  private setupCreateGroupDialog(): StandardDialogRenderer<CreateGroupMenuRenderer> {
    const body = new CreateGroupMenuRenderer(this.#particles_handler, this.#container);
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
    group_renderer.refresh(changes_log);
  }
  deleteGroup(group_id: string): void {
    console.log("deleting a group")
    const group_renderer = this.#group_list.find(item => 
      item
      .getParticleGroup()
      .getGrouping()
      .group_id 
      === 
      group_id
    );
    this.#group_list.removeItem(group_renderer);
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