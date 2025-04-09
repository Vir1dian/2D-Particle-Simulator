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
  #simulation: Simulation;
  #add_particles_dialog: StandardDialogRenderer;
  #create_group_dialog: StandardDialogRenderer;
  #group_list: ListRenderer<ParticleUnitGroupRenderer>;

  constructor(simulation: Simulation) {
    const particle_panel: HTMLElement = document.createElement('article');
    super(particle_panel, 'control_item', 'control_parsetup');

    // Saved Data
    simulation.add_observer(SimEvent.Overwrite_Particle_Groups, this.overwriteGroupList.bind(this));
    this.#simulation = simulation;
    this.#add_particles_dialog = this.setupAddParticlesDialog();
    this.#create_group_dialog = this.setupCreateGroupDialog();
    this.#group_list = new ListRenderer<ParticleUnitGroupRenderer>(...Array.from(
      simulation.getParticleGroups() as Map<string, ParticleGroup>, 
      ([group_id, group]) => new ParticleUnitGroupRenderer(group, simulation.getContainer())
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
  private setupAddParticlesDialog(): StandardDialogRenderer {
    const body = new Renderer(document.createElement('div'));
    const dialog = new StandardDialogRenderer(body, 'parsetup_add_particle_dialog', 'Add Particles', true);
    dialog.setOpenButtonLabel("Add Particles");
    dialog.setCloseButtonLabel("close", true);
    
    // Entire setup for dialog details
    

    return dialog;
  }
  private setupCreateGroupDialog(): StandardDialogRenderer {
    const body = new Renderer(document.createElement('div'));
    const dialog = new StandardDialogRenderer(body, 'parsetup_add_group_dialog', 'Create Group', true);
    dialog.setOpenButtonLabel("Create Group");
    dialog.setCloseButtonLabel("close", true);

    // Entire setup for dialog details

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
  overwriteGroupList(): void {
    this.#group_list.empty();
    Array.from(
      this.#simulation.getParticleGroups() as Map<string, ParticleGroup>, 
      ([group_id, group]) => new ParticleUnitGroupRenderer(group, this.#simulation.getContainer())
    ).forEach(group_renderer => this.#group_list.push(group_renderer));
  }
  remove(): void {
    this.#add_particles_dialog.remove();
    this.#create_group_dialog.remove();
    this.#group_list.remove();
    super.remove();
  }
}