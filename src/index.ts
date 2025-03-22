document.addEventListener("DOMContentLoaded", loadAll);

interface control_item_data {
  name: string,
  isOpen: boolean,
  toggleAnimation: string
}

const control_bar_items_element: HTMLSpanElement = document.getElementById("setting_icons") as HTMLSpanElement;  // not including the timer
const control_item_icons: NodeListOf<HTMLSpanElement> = control_bar_items_element.querySelectorAll(`.icon`) as NodeListOf<HTMLSpanElement>;
const control_item_elements: NodeListOf<HTMLElement> = document.querySelectorAll(".control_item") as NodeListOf<HTMLElement>;

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
    loadAvailablePresets() {
      const preset_datalist_element : HTMLDataListElement = document.getElementById("simsetup_presets") as HTMLDataListElement;
      Object.keys(presets).forEach((preset_name: string) => {
        const option_element : HTMLOptionElement = document.createElement('option');
        option_element.value = preset_name;
        preset_datalist_element.appendChild(option_element);
      });
    },
  },
  particle : {
    testSetup() {
      // This is purely for testing the Renderer classes, final setup will likely be handled mostly in simulation
      const test_mass = 1;
      const test_radius = 5;
      const test_position = new Vector2D();
      const test_velocity = new Vector2D();
      const test_acceleration = new Vector2D();
      const test_oscillation = new Vector2D();
      const test_color = 'blue';
      const test_trajectory = false;

      const test_group_0: Particle[] = [
        new Particle(),
        new Particle(test_mass,test_radius,test_position,test_velocity,test_acceleration,test_oscillation,test_color,test_trajectory),
        new Particle('random',test_radius,test_position,'random',test_acceleration,test_oscillation,'random',test_trajectory),
        new Particle(test_mass,'random',test_position,test_velocity,'random',test_oscillation,'random',test_trajectory),
        new Particle(test_mass,test_radius,'random',test_velocity,'random',test_oscillation,'random',test_trajectory),
        new Particle('random',test_radius,test_position,'random',test_acceleration,test_oscillation,'random',test_trajectory),
        new Particle(test_mass,test_radius,test_position,test_velocity,'random',test_oscillation,test_color,test_trajectory),
        new Particle(test_mass,'random',test_position,test_velocity,test_acceleration,test_oscillation,'random',test_trajectory),
        new Particle(test_mass,test_radius,'random',test_velocity,test_acceleration,test_oscillation,test_color,test_trajectory)
      ];
      const test_group_1: Particle[] = [
        new Particle(test_mass,7,'random',test_velocity,test_acceleration,test_oscillation,test_color,test_trajectory, 1),
        new Particle(test_mass,7,'random',test_velocity,test_acceleration,test_oscillation,test_color,test_trajectory, 1),
        new Particle(test_mass,7,'random',test_velocity,test_acceleration,test_oscillation,test_color,test_trajectory, 1)
      ];
      const test_group_2: Particle[] = [
        new Particle(test_mass,10,'random',test_velocity,test_acceleration,test_oscillation,'red',test_trajectory, 2),
        new Particle(test_mass,10,'random',test_velocity,test_acceleration,test_oscillation,'red',test_trajectory, 2),
        new Particle(test_mass,10,'random',test_velocity,test_acceleration,test_oscillation,'red',test_trajectory, 2)
      ]

      
      const particle_groups: ParticleUnitGroupRenderer[] = [
        new ParticleUnitGroupRenderer(
          ...test_group_0.map(particle => new ParticleUnitRenderer(new ParticlePointRenderer(particle, container)))
        ),
        new ParticleUnitGroupRenderer(
          ...test_group_1.map(particle => new ParticleUnitRenderer(new ParticlePointRenderer(particle, container)))
        ),
        new ParticleUnitGroupRenderer(
          ...test_group_2.map(particle => new ParticleUnitRenderer(new ParticlePointRenderer(particle, container)))
        )
      ]
      
      const particle_set_element: ListRenderer = new ListRenderer(...particle_groups);
      const particle_setup: HTMLElement = document.getElementById("parsetup_groups_wrapper") as HTMLElement;
      particle_set_element.setParent(particle_setup);
    }
  }
}

// Sets the initial state of all elements
function loadAll() {
  loadContainerElement(container);
  simulationSettingsElementFunctionsOld.loadPreset('empty');

  openControlItem(control_items_data[2]);  // For DEV: Default opened settings upon refresh: 0 for visuals, 1 for simulation, 2 for particle

  // Simulation Presets
  setupElementRenderers.simulation.loadAvailablePresets();
  const simsetup_presets_button : HTMLButtonElement = document.getElementById("simsetup_presets_button") as HTMLButtonElement;
  const simsetup_presets_input : HTMLInputElement = document.getElementById("simsetup_presets_input") as HTMLInputElement;
  simsetup_presets_button.addEventListener("click", () => simulationSettingsElementFunctionsOld.loadPreset(simsetup_presets_input.value));

  // Particle Interface
  setupElementRenderers.particle.testSetup();
}
