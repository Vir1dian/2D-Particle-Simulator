import { Vector2D } from "../../entities/vector2D";
import type { SimPreset } from "../../entities/simulation/simInterfaces";
import type { SimEvent } from "../../entities/simulation/simulation";
import { Simulation, DEFAULT_PRESET, TEMPORARY_PRESETS } from "../../entities/simulation/simulation";
import { Renderer } from "../renderer";
import { ButtonRenderer } from "../blocks";
import { TableRenderer, SelectRenderer, OptionRenderer, InputTableRenderer } from "../collections";

/**
 * Helper class for EnvironmentPanelRenderer.
 * Handles user inputs and sends changes to
 * Simulation's #environment property as a
 * partial preset object.
 */
class EnvironmentSetupRenderer extends Renderer {
  #simulation: Simulation;
  #input_table: InputTableRenderer<number | Vector2D>;
  #apply_button: ButtonRenderer;

  constructor(simulation: Simulation) {
    const environment_setup_wrapper: HTMLDivElement = document.createElement('div');
    super(environment_setup_wrapper, '', 'simsetup_global_variables_wrapper');

    // Saved Data
    simulation.getObservers().add(SimEvent.Update_Environment, this.refresh.bind(this));
    this.#simulation = simulation;
    this.#input_table = new InputTableRenderer('environmentSetup', simulation.getEnvironment().statics!);  // statics for now because dynamics is still empty
    this.#apply_button = new ButtonRenderer(this.submitChanges.bind(this)); // Manual config of submitButton so setPreset is used explicitly

    // Content
    this.#input_table.setParent(environment_setup_wrapper);
    const buttons_wrapper: HTMLDivElement = document.createElement('div');
    buttons_wrapper.id = "simsetup_env_button_wrapper";
    this.#apply_button.getElement().textContent = "Apply Changes";
    this.#apply_button.setParent(buttons_wrapper);
    environment_setup_wrapper.appendChild(buttons_wrapper);
  }
  private submitChanges(): void {
    const changes: SimPreset = { 
      environment: { 
        statics: this.#input_table.prepareChanges(), 
        dynamics: {} 
      } 
    };
    this.#simulation.setPreset(changes);
    this.#input_table.setProperties(this.#simulation.getEnvironment().statics!, {...DEFAULT_PRESET.environment?.statics});
  }

  getTable(): TableRenderer {
    return this.#input_table;
  }
  refresh(): void {
    this.#input_table.setProperties(this.#simulation.getEnvironment().statics!, {...DEFAULT_PRESET.environment?.statics});
  }
  remove(): void {
    this.#input_table.remove();
    this.#apply_button.remove();
    super.remove();
  }
};

/**
 * Helper class for EnvironmentPanelRenderer.
 * Handles a DatalistInputRenderer to allow 
 * user selection of existing Simulation
 * presets. Sends changes to Simulation's 
 * properties as a preset object.
 */
class PresetInputRenderer extends Renderer { 
  #simulation: Simulation;
  #preset_dropdown: SelectRenderer;
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
  private setupPresetDropdown(): SelectRenderer {
    const preset_data: OptionRenderer[] = [];
    Object.keys(TEMPORARY_PRESETS).forEach((preset_name, preset) => {
      preset_data.push(new OptionRenderer(preset_name, ''));
    });
    const dropdown: SelectRenderer = new SelectRenderer('simsetup_presets_dropdown', preset_data);
    return dropdown;
  }
  private setupApplyButton(): ButtonRenderer {
    const button: ButtonRenderer = new ButtonRenderer(
      () => {
        const preset_name: string = this.#preset_dropdown.getElement().value;
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
};

export {
  EnvironmentSetupRenderer,
  PresetInputRenderer
};