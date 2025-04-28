document.addEventListener("DOMContentLoaded", loadAll);

interface control_item_data {
  name: string,
  isOpen: boolean,
  toggleAnimation: string
}

const control_bar_items_element: HTMLSpanElement = document.getElementById("setting_icons") as HTMLSpanElement;  // not including the timer
const control_item_icons: NodeListOf<HTMLSpanElement> = control_bar_items_element.querySelectorAll(`.icon`) as NodeListOf<HTMLSpanElement>;
let control_item_elements: NodeListOf<HTMLElement> = document.querySelectorAll(".control_item") as NodeListOf<HTMLElement>;

const control_items_data: control_item_data[] = [
  {
    name: "ui",
    isOpen: false,
    toggleAnimation: "rotateZ" // 180deg
  },
  {
    name: "sim",
    isOpen: false,
    toggleAnimation: "rotateY" // 180deg
  },
  {
    name: "par",
    isOpen: false,
    toggleAnimation: "rotateZ" // 180deg
  }
];
control_items_data.forEach(item => {
  (control_bar_items_element.querySelector(`#control_button_${item.name}setup`) as HTMLButtonElement).addEventListener('click', () => {
    openControlItem(item);
  });
})

// Handles animation of UI icons when clicked
const spinHandlers = new Map<string, (reverse: boolean) => void>();
function handleIconSpin(icon: HTMLSpanElement, transform: string = "rotate") {
  let spin = 0;
  return function (reverse: boolean) {
    spin += reverse ? -180 : 180;
    if (icon) icon.style.transform = `${transform}(${spin}deg)`;
  };
}


function openControlItem(item:control_item_data) {
  const control_item_icon: HTMLSpanElement = document.querySelector(`#control_button_${item.name}setup .icon`) as HTMLSpanElement;

  if (!control_item_icon) {
    console.warn(`Icon for ${item.name} not found.`);
    return;
  }

  control_items_data.forEach((elem, index) => {
    if (elem != item) elem.isOpen = false;
    control_item_elements[index].style.display = (elem == item && !item.isOpen) ? "block" : "none";
  });

  if (!spinHandlers.has(item.name)) {
    spinHandlers.set(item.name, handleIconSpin(control_item_icon, item.toggleAnimation));
  }
  
  const spinHandler = spinHandlers.get(item.name)!;
  spinHandler(item.isOpen);
  item.isOpen = !item.isOpen;
}

const setupElementRenderers = {
  ui : {

  },
  simulation : {
    loadAvailablePresets() {  // Old
      const preset_datalist_element : HTMLDataListElement = document.getElementById("simsetup_presets") as HTMLDataListElement;
      Object.keys(presets).forEach((preset_name: string) => {
        const option_element : HTMLOptionElement = document.createElement('option');
        option_element.value = preset_name;
        preset_datalist_element.appendChild(option_element);
      });
    },

  },
  particle : {
    
  }
}

// Sets the initial state of all elements
function loadAll() {
  loadContainerElement(container);
  simulationSettingsElementFunctionsOld.loadPreset('empty');

  const sim: Simulation = new Simulation(TEMPORARY_PRESETS["rybg"]);
  const environment_panel: EnvironmentPanelRenderer = new EnvironmentPanelRenderer(sim);
  const particle_panel: ParticlePanelRenderer = new ParticlePanelRenderer(sim.getParticlesHandler(), sim.getContainer());
  const control_panel_element: HTMLElement = document.querySelector(".control_items_wrapper") as HTMLElement;
  environment_panel.setParent(control_panel_element);
  particle_panel.setParent(control_panel_element);

  // Temporary fix for spin icon buttons, fix soon
  control_item_elements = document.querySelectorAll(".control_item") as NodeListOf<HTMLElement>;  

  openControlItem(control_items_data[2]);  // For DEV: Default opened settings upon refresh: 0 for visuals, 1 for simulation, 2 for particle

}