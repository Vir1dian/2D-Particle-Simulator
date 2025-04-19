class AddParticleMenuRenderer extends Renderer {
  // To be placed inside an existing StandardDialogRenderer
  #simulation: Simulation;
  #group_selector: SelectRenderer;
  #input_table: InputTableRenderer<string | boolean | number | Vector2D>;  
  #submit_button: ButtonRenderer;

  constructor(simulation: Simulation) {
    const menu_wrapper: HTMLDivElement = document.createElement('div');
    super(menu_wrapper, 'dialog_menu', 'dialog_menu_add_particle');

    // Stored Data
    simulation.add_observer(SimEvent.Overwrite_Particle_Groups, this.refresh.bind(this));
    simulation.add_observer(SimEvent.Edit_Particle_Groups, this.refresh.bind(this));
    this.#simulation = simulation;
    this.#group_selector = this.setupGroupSelector();
    this.#input_table = this.setupInputTable();
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

    const submit_wrapper = document.createElement('div');
    submit_wrapper.style.display = 'flex';
    submit_wrapper.style.justifyContent = 'center';
    submit_wrapper.style.marginTop = '8px';
    this.#submit_button.setParent(submit_wrapper);
    menu_wrapper.appendChild(submit_wrapper);
  }
  private setupGroupSelector(): SelectRenderer {
    const selector = new SelectRenderer(
      'menu_group_selector_add_particle', 
      Array.from(
        this.#simulation.getParticleGroups() as Map<string, ParticleGroup>,
        ([group_id, group]) => new OptionRenderer(group_id)
      )
    );
    selector.setSelected(0);
    return selector;
  }
  private setupInputTable(): InputTableRenderer<string | boolean | number | Vector2D> {
    const properties = (({group_id, enable_path_tracing, ...exposed_properties}) => exposed_properties)(DEFAULT_GROUPING);
    const input_table = new InputTableRenderer('addParticle', properties, true, 'random');
    input_table.setClassName('menu_table');
    return input_table;
  }
  private setupSubmitButton(): ButtonRenderer {
    const button: ButtonRenderer = new ButtonRenderer(
      () => {

      }
    );
    button.setLabel('Submit');
    return button;
  }
  refresh(): void {

  }
  submit(): void {

  }
}

class CreateGroupMenuRenderer extends Renderer {
  // To be placed inside an existing StandardDialogRenderer
  #simulation: Simulation;
  #input_table: InputTableRenderer<string | boolean | number | Vector2D>;  
  #submit_button: ButtonRenderer;

  constructor(simulation: Simulation) {
    const menu_wrapper: HTMLDivElement = document.createElement('div');
    super(menu_wrapper, 'dialog_menu', 'dialog_menu_create_group');

    // Stored Data
    this.#simulation = simulation;
    this.#input_table = this.setupInputTable();
    this.#submit_button = this.setupSubmitButton();

    // DOM Content

  }
  private setupInputTable(): InputTableRenderer<string | boolean | number | Vector2D> {
    const properties = (({enable_path_tracing, ...exposed_properties}) => exposed_properties)(DEFAULT_GROUPING);
    return new InputTableRenderer('createGroup', properties, true, 'random', 'unspecified');
  }
  private setupSubmitButton(): ButtonRenderer {
    return new ButtonRenderer(
      () => {

      }
    );
  }
  refresh(): void {

  }
  submit(): void {

  }
}

class EditGroupMenuRenderer extends Renderer {
  // To be placed inside an existing StandardDialogRenderer
  // maybe use checkboxes for users to tick if they want to specify/unspecify a property?
  // also option to delete the ParticleGroup
  // "Focus" on the corresponding group of particles in the container when this window is open
  constructor() {
    const menu_wrapper: HTMLDivElement = document.createElement('div');
    super(menu_wrapper, 'dialog_menu', `dialog_menu_edit_group_id_${0}`);

    // Stored Data


    // DOM Content


  }
}

class EditParticleMenuRenderer extends Renderer {
  // To be placed inside an existing StandardDialogRenderer
  // input_table again
  // option to delete the Particle
  // "Focus" on the corresponding particle in the container when this window is open
  constructor() {
    const menu_wrapper: HTMLDivElement = document.createElement('div');
    super(menu_wrapper, 'dialog_menu', `dialog_menu_edit_particle_id_${0}`);

    // Stored Data


    // DOM Content


  }
}

/**
 * Helper class for ParticleSetup Renderer.
 * Handles a set of Renderers that represents the 
 * user control interface for a ParticleGroup.
 * Handles ParticleUnitRenderers.
 */
class ParticleUnitGroupRenderer extends Renderer {
  #particle_group: ParticleGroup;
  #icon: Renderer;
  #details_dialog: StandardDialogRenderer<Renderer>;  // maybe make this non-modal to edit outside of the popup?
  #drag_button: ButtonRenderer;
  #unit_list: ListRenderer<ParticleUnitRenderer>;
  
  constructor(group: ParticleGroup, container: BoxSpace) {
    const particle_group_element: HTMLElement = document.createElement('article');
    super(particle_group_element, 'parsetup_group', `parsetup_group_id${group.getGrouping().group_id}`);

    this.#particle_group = group;

    // Saved renderers
    this.#icon = this.createIcon(group.getGrouping().color as string);
    this.#details_dialog = this.setupDetailsDialog(group.getGrouping().group_id);
    this.#drag_button = this.setupDragButton();
    this.#unit_list = new ListRenderer<ParticleUnitRenderer>(...group.getParticles().map(particle => {
      return new ParticleUnitRenderer(particle, container);
    }));
    // Contents
    const header: HTMLElement = document.createElement('header');
    header.appendChild(this.createTitleWrapper(group.getGrouping().group_id));
    header.appendChild(this.createButtonsWrapper());
    particle_group_element.appendChild(header);
    this.#details_dialog.setParent(particle_group_element);
    this.#unit_list.setParent(particle_group_element);
  }
  private createIcon(color: string): Renderer {
    const icon = new Renderer(document.createElement("span"));
    icon.setClassName("parsetup_group_icon");
    if (this.#particle_group.getGrouping().group_id === DEFAULT_GROUPING.group_id)
      icon.getElement().style.display = 'none';
    else icon.getElement().style.backgroundColor = color;
    return icon;
  };
  private setupDetailsDialog(group_id: string): StandardDialogRenderer<Renderer> {
    const body = new Renderer(document.createElement('div'));
    const details_dialog = new StandardDialogRenderer(body, `particle_group_${group_id}`, group_id, true);
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
    return this.#particle_group;
  }
  getUnitList(): ListRenderer<ParticleUnitRenderer> {
    return this.#unit_list;
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
  #details_dialog: StandardDialogRenderer<Renderer>;  // maybe make this non-modal to edit outside of the popup?
  #drag_button: ButtonRenderer;
  constructor(particle: Particle, container: BoxSpace) {
    const particle_control_element : HTMLDivElement = document.createElement('div');
    super(particle_control_element, 'parsetup_par', `parsetup_par_id${particle.getID()}`);
    // Saved renderers
    this.#particle_renderer = new ParticlePointRenderer(particle, container);
    this.#icon = this.createIcon(particle.color);
    this.#details_dialog = this.setupDetailsDialog(particle.getID());
    this.#drag_button = this.setupDragButton(); 
    // Contents
    particle_control_element.appendChild(this.createTitleWrapper(particle.getID()));
    particle_control_element.appendChild(this.createButtonsWrapper());
    this.#details_dialog.setParent(particle_control_element);
  }
  private createIcon(color: string): Renderer {
    const icon = new Renderer(document.createElement("span"));
    icon.setClassName("parsetup_par_icon");
    icon.getElement().style.backgroundColor = color;
    return icon;
  }
  private setupDetailsDialog(id: number): StandardDialogRenderer<Renderer> {
    const body = new Renderer(document.createElement('div'));
    const details_dialog = new StandardDialogRenderer(body, `particle_${id}`, `Particle ${id}`, true);
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
  constructor(particle: Particle, container: BoxSpace) {
    const particle_element : HTMLDivElement = document.createElement('div');
    super(particle_element, 'particle_element', `particle_element_id${particle.getID()}`);
    this.#particle = particle;
    this.#container = container;

    const container_element : HTMLDivElement = document.querySelector('.container_element') as HTMLDivElement;
    container_element.appendChild(particle_element);

    // shape
    particle_element.style.borderRadius = `${particle.radius}px`;
    particle_element.style.width = `${2*particle.radius}px`;
    particle_element.style.height = `${2*particle.radius}px`;
    // positioning
    particle_element.style.left = `${(particle.position.x - particle.radius) - container.x_min}px`;
    particle_element.style.top = `${container.y_max - (particle.position.y + particle.radius)}px`;
    // color
    particle_element.style.backgroundColor = particle.color;
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
  update(): void {
    const particle_element : HTMLDivElement = this.getElement() as HTMLDivElement;
    // shape
    particle_element.style.borderRadius = `${this.#particle.radius}px`;
    particle_element.style.width = `${2*this.#particle.radius}px`;
    particle_element.style.height = `${2*this.#particle.radius}px`;
    // positioning
    particle_element.style.left = `${(this.#particle.position.x - this.#particle.radius) - this.#container.x_min}px`;
    particle_element.style.top = `${this.#container.y_max - (this.#particle.position.y + this.#particle.radius)}px`;
    // color
    particle_element.style.backgroundColor = this.#particle.color;
  }
}