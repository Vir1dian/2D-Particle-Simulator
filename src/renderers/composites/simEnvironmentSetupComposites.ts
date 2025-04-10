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
  remove(): void {
    this.#inputs.clear();
    this.#input_table.remove();
    this.#sumbit_button.remove();
    super.remove();
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
  remove(): void {
    this.#preset_dropdown.remove();
    this.#apply_button.remove();
    super.remove();
  }
}