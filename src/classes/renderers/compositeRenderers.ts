
// Helper classes for SimulationRenderer, the ULTIMATE RENDERER!!!

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


}

/**
 * Helper class for EnvironmentPanelRenderer.
 * Handles user inputs and sends changes to
 * Simulation's #environment property as a
 * partial preset object.
 */
class EnvironmentSetupRenderer extends Renderer {
  #simulation: Simulation;
  #inputs: Map<string, InputRenderer | NumberInputRenderer>;  // still have access to the inputs in this way
  #input_table: TableRenderer;
  #sumbit_button: ButtonRenderer;

  constructor(simulation: Simulation) {
    const simulation_settings: HTMLDivElement = document.createElement('div');
    super(simulation_settings, '', 'simsetup_global_variables_wrapper');

    // Saved Data
    simulation.add_observer(SimEvent.Update_Environment, this.refreshInputs.bind(this));
    this.#simulation = simulation;
    this.#inputs = new Map();
    this.#input_table = this.populateInputTable();
    this.#sumbit_button = new ButtonRenderer(this.submitChanges.bind(this));

    // Content
    this.#input_table.setParent(simulation_settings);
    const buttons_wrapper: HTMLDivElement = document.createElement('div');
    buttons_wrapper.id = "simsetup_env_button_wrapper";
    this.#sumbit_button.getElement().textContent = "Apply Changes";
    this.#sumbit_button.setParent(buttons_wrapper);
    simulation_settings.appendChild(buttons_wrapper);
  }
  private populateInputTable(): TableRenderer {
    const statics = this.#simulation.getEnvironment().statics;  // statics for now because dynamics is still empty
    if (!statics) return new TableRenderer();

    const env_setup_data: string[] = Object.keys(statics);

    // 1 extra row for table headings, 2 columns for labels and inputs
    const input_table: TableRenderer = new TableRenderer(env_setup_data.length + 1, 2)  
    
    env_setup_data.forEach((key, index) => {
      const value: number | Vector2D | undefined = statics[key as keyof typeof statics];
      if (typeof value === 'number') {
        const input = new NumberInputRenderer(`input_id_${key}`, value);
        input.getLabelElement().innerText = prettifyKey(key);
        input_table.getCell(index, 0).setContent(input.getLabelElement()); 
        input_table.getCell(index, 1).setContent(input); 
        this.#inputs.set(key, input);
      }
      else if (isObject(value) && "x" in value && "y" in value) {
        const input_x = new NumberInputRenderer(`input_x_id_${key}`, value.x);
        const input_y = new NumberInputRenderer(`input_y_id_${key}`, value.y);
        const input_wrapper = document.createElement('div');
        input_wrapper.className = "input_wrapper_xy";

        input_x.getLabelElement().innerText = "x:";
        input_y.getLabelElement().innerText = "y:";

        input_wrapper.appendChild(input_x.getLabelElement());
        input_x.setParent(input_wrapper);
        input_wrapper.appendChild(input_y.getLabelElement());
        input_y.setParent(input_wrapper);

        const label_xy: HTMLLabelElement = document.createElement('label');
        label_xy.htmlFor = `input_x_id_${key}`;
        label_xy.innerText = prettifyKey(key);
        input_table.getCell(index, 0).setContent(label_xy);
        input_table.getCell(index, 1).setContent(input_wrapper);
        this.#inputs.set(`${key}_x`, input_x);
        this.#inputs.set(`${key}_y`, input_y);
      }
    });

    return input_table;
  }
  private submitChanges(): void {
    const statics = structuredClone(this.#simulation.getEnvironment().statics!);  // statics for now because dynamics is still empty
    const changes: SimPreset = { environment: { statics: {}, dynamics: {} } };
    const input_keys: string[] = [...this.#inputs.keys()];  
    // Properties of type Vector2D in this.#inputs are represented by two InputRenderers instead of one,
    // one for the x component, and the other for the y component, one after the other.

    for (let i = 0; i < input_keys.length; i++) {
      const key = input_keys[i];
      const input = this.#inputs.get(key)!;
      input.refreshValue();
  
      if (key.endsWith("_x")) {  // Detect x component, y is always next
        const baseKey = key.slice(0, -2); // Remove "_x" to get the property name
        const next_input = this.#inputs.get(input_keys[++i])!;
        next_input.refreshValue();
        
        const x = parseFloat(input.getValue());
        const y = parseFloat(next_input.getValue());

        if (
          (statics[baseKey as keyof typeof statics] as Vector2D).x === x && 
          (statics[baseKey as keyof typeof statics] as Vector2D).y === y
        ) continue;
  
        if (!changes.environment) continue;
        if (!changes.environment.statics) continue;
        (changes.environment.statics[baseKey as keyof typeof statics] as {x: number, y: number}) = { x, y };
      } 
      else {
        const val = parseFloat(input.getValue());
        if (statics[key as keyof typeof statics] as number === val) continue;

        if (!changes.environment) continue;
        if (!changes.environment.statics) continue;
        (changes.environment!.statics[key as keyof typeof statics] as number) = val;
      }
    }
    this.#simulation.setPreset(changes);
  }

  getInputs(): Map<string, InputRenderer | NumberInputRenderer> {
    return this.#inputs;
  }
  getTable(): TableRenderer {
    return this.#input_table;
  }
  getSubmitButton(): ButtonRenderer {
    return this.#sumbit_button;
  }
  refreshInputs(): void {
    const statics = structuredClone(this.#simulation.getEnvironment().statics!);  // statics for now because dynamics is still empty
    const input_keys: string[] = [...this.#inputs.keys()];  
    // Properties of type Vector2D in this.#inputs are represented by two InputRenderers instead of one,
    // one for the x component, and the other for the y component, one after the other.

    for (let i = 0; i < input_keys.length; i++) {
      const key = input_keys[i];
      const input = this.#inputs.get(key)!;
  
      if (key.endsWith("_x")) {  // Detect x component, y is always next
        const baseKey = key.slice(0, -2); // Remove "_x" to get the property name
        const next_input = this.#inputs.get(input_keys[++i])!;

        const vector = (statics[baseKey as keyof typeof statics] as Vector2D);
        
        input.setValue(vector.x.toString());
        next_input.setValue(vector.y.toString());
      } 
      else {
        const scalar = statics[key as keyof typeof statics] as number;
        input.setValue(scalar.toString());
      }
    }
  }
}

/**
 * Helper class for EnvironmentPanelRenderer.
 * Handles a DatalistInputRenderer to allow 
 * user selection of existing Simulation
 * presets. Sends changes to Simulation's 
 * properties as a preset object.
 */
class PresetInputRenderer extends Renderer { 
  #simulation: Simulation;
  #preset_dropdown: DatalistInputRenderer;
  #apply_button: ButtonRenderer;
  constructor(simulation: Simulation) {
    const simulation_preset_input_wrapper: HTMLDivElement = document.createElement('div');
    super(simulation_preset_input_wrapper, '', 'simsetup_presets_wrapper');
    this.#simulation = simulation;
    // saved renderers
    this.#preset_dropdown = this.setupPresetDropdown();
    this.#apply_button = this.setupApplyButton();
    // contents
    this.#preset_dropdown.setParent(simulation_preset_input_wrapper);
    this.#apply_button.setParent(simulation_preset_input_wrapper);
  }
  private setupPresetDropdown(): DatalistInputRenderer {
    const preset_data: OptionRenderer[] = [];
    Object.keys(TEMPORARY_PRESETS).forEach((preset_name, preset) => {
      preset_data.push(new OptionRenderer(preset_name, ''));
    });
    const dropdown: DatalistInputRenderer = new DatalistInputRenderer('simsetup_presets_input', preset_data, 'simsetup_presets');
    dropdown.getElement().placeholder = "Preset";
    return dropdown;
  }
  private setupApplyButton(): ButtonRenderer {
    const button: ButtonRenderer = new ButtonRenderer(
      () => {
        this.#preset_dropdown.refreshValue();
        const preset_name: string = this.#preset_dropdown.getValue();
        const preset: SimPreset = TEMPORARY_PRESETS[preset_name];
        this.#simulation.setPreset(preset);
      }
    )
    button.setID('simsetup_presets_button');
    button.getElement().textContent = "Apply";
    return button;
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
  #add_particles_dialog: DialogRenderer;
  #create_group_dialog: DialogRenderer;
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

    const list_wrapper: HTMLDivElement = document.createElement('div');
    list_wrapper.id = "parsetup_groups_wrapper";
    this.#group_list.setParent(list_wrapper);
    particle_panel.appendChild(list_wrapper);
  }
  private setupAddParticlesDialog(): DialogRenderer {
    const dialog = new DialogRenderer('parsetup_add_particle_dialog');
    dialog.getOpenButton().getElement().textContent = "Add Particles";
    
    // Entire setup for dialog details

    return dialog;
  }
  private setupCreateGroupDialog(): DialogRenderer {
    const dialog = new DialogRenderer('parsetup_add_group_dialog');
    dialog.getOpenButton().getElement().textContent = "Create Group";

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
  #details_dialog: DialogRenderer;
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
    this.#unit_list.setParent(particle_group_element);
  }
  private createIcon(color: string): Renderer {
    const icon = new Renderer(document.createElement("span"));
    icon.setClassName("parsetup_group_icon");
    icon.getElement().style.backgroundColor = color;
    return icon;
  };
  private setupDetailsDialog(group_id: string): DialogRenderer {
    const details_dialog = new DialogRenderer(`particle_group_${group_id}`);
    details_dialog.getOpenButton().setClassName("material-symbols-sharp icon");
    details_dialog.getOpenButton().getElement().innerHTML = "expand_content";

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
    const details_dialog = new DialogRenderer(`particle_${id}`);
    details_dialog.getOpenButton().setClassName("material-symbols-sharp icon");
    details_dialog.getOpenButton().getElement().innerHTML = "expand_content";

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


