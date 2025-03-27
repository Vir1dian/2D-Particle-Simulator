// Other larger Renderer classes, may move to separate files
class UIControlRenderer extends Renderer {  // May extend from a TableRenderer or a ListRenderer instead
  // WIP: Will need methods to handle Simulation Class's calls
  #simulation: Simulation
  // may create a UIConfig class soon
  constructor(simulation: Simulation) {
    const ui_settings_element : HTMLDivElement = document.createElement('div');
    super(ui_settings_element);
    this.#simulation = simulation;
  }
}

class SimulationPresetInputRenderer extends Renderer { 
  #simulation: Simulation;
  #preset_dropdown: DatalistInputRenderer;
  #apply_button: ButtonRenderer;
  constructor(simulation: Simulation) {
    const simulation_preset_input: HTMLDivElement = document.createElement('div');
    super(simulation_preset_input, '', 'simsetup_presets_wrapper');
    this.#simulation = simulation;
    // saved renderers
    this.#preset_dropdown = this.setupPresetDropdown();
    this.#apply_button = this.setupApplyButton();
    // contents
    this.#preset_dropdown.setParent(simulation_preset_input);
    this.#apply_button.setParent(simulation_preset_input);
  }
  private setupPresetDropdown(): DatalistInputRenderer {
    const preset_data: OptionRenderer[] = [];
    Object.keys(TEMPORARY_PRESETS).forEach((preset_name, preset) => {
      preset_data.push(new OptionRenderer(preset_name, ''));
    });
    const dropdown: DatalistInputRenderer = new DatalistInputRenderer('simsetup_presets_input', preset_data, 'simsetup_presets');
    return dropdown;
  }
  private setupApplyButton(): ButtonRenderer {
    const button: ButtonRenderer = new ButtonRenderer(
      () => {
        const preset_name: string = this.#preset_dropdown.getValue();
        const preset: SimPreset = TEMPORARY_PRESETS[preset_name];
        this.applyPreset(preset);
      }
    )
    button.setID('simsetup_presets_button');
    return button;
  }

  applyPreset(preset: SimPreset): void {
    // TODO
  }
}

class SimulationControlRenderer extends Renderer {  // WIP: Will need methods to handle Simulation Class's calls
  #simulation: Simulation;
  constructor(simulation: Simulation) {
    const simulation_settings: HTMLDivElement = document.createElement('div');
    super(simulation_settings, '', 'simsetup_global_variables_wrapper');
    this.#simulation = simulation;
  }
}

class ParticlePointRenderer extends Renderer {  // WIP: Will need methods to handle Simulation Class's calls
  #particle: Particle;
  #container: BoxSpace;
  constructor(particle: Particle, container: BoxSpace) {
    const particle_element : HTMLDivElement = document.createElement('div');
    super(particle_element, 'particle_element', `particle_element_id${particle.getID()}`);
    this.#particle = particle;
    this.#container = container;
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
  setContainer(container: BoxSpace) {
    if (this.#container !== container) this.#container = container;
    const container_element : HTMLElement | null = document.querySelector('.container_element');
    container_element?.appendChild(this.getElement());
  }
  update() {
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

class ParticleUnitRenderer extends Renderer {  // WIP: Will need methods to handle Simulation Class's calls
  #particle_renderer: ParticlePointRenderer;
  #icon: Renderer;
  #details_dialog: DialogRenderer;
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
    this.#particle_renderer.setContainer(container);
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
  private setupDetailsDialog(id: number): DialogRenderer {
    const details_dialog = new DialogRenderer(`particle_dialog_id${id}`);
    details_dialog.getOpenButton().setClassName("material-symbols-sharp icon");
    details_dialog.getOpenButton().getElement().innerHTML = "visibility";

    // Entire setup for dialog details

    return details_dialog;
  }
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
}

class ParticleUnitGroupRenderer extends Renderer {  // WIP: Will need methods to handle Simulation Class's calls
  #particle_renderers: ParticleUnitRenderer[];
  #icon: Renderer;
  #details_dialog: DialogRenderer;
  #drag_button: ButtonRenderer;
  #unit_list: ListRenderer;
  
  constructor(grouping: ParticleGrouping, ...p_renderers: ParticleUnitRenderer[]) {
    const particle_group_element: HTMLElement = document.createElement('article');
    super(particle_group_element, 'parsetup_group', `parsetup_group_id${grouping.group_id}`);
    // Saved renderers
    this.#particle_renderers = p_renderers;
    this.#icon = this.createIcon(grouping.color as string);
    this.#details_dialog = this.setupDetailsDialog(grouping.group_id);
    this.#drag_button = this.setupDragButton();
    this.#unit_list = new ListRenderer(...p_renderers);
    // Contents
    const header: HTMLElement = document.createElement('header');
    header.appendChild(this.createTitleWrapper(grouping.group_id));
    header.appendChild(this.createButtonsWrapper());
    particle_group_element.appendChild(header);
    this.#unit_list.setParent(particle_group_element);
  }
  private createIcon(color: string): Renderer {
    const icon = new Renderer(document.createElement("span"));
    icon.setClassName("parsetup_group_icon");
    icon.getElement().style.backgroundColor = color;
    return icon;
  };
  private setupDetailsDialog(group_id: string): DialogRenderer {
    const details_dialog = new DialogRenderer(`particle_group_dialog_id${group_id}`);
    details_dialog.getOpenButton().setClassName("material-symbols-sharp icon");
    details_dialog.getOpenButton().getElement().innerHTML = "keyboard_arrow_down";

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
}
