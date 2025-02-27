showControlOption();
loadContainerElement(container);
simulationSettingsElementFunctions.loadPreset('empty');

const control_items: {
  name: string,
  isOpen: boolean,
  toggleAnimation: string
}[] = [
  {
    name: "ui",
    isOpen: false,
    toggleAnimation: "rotate" // 180deg
  },
  {
    name: "sim",
    isOpen: false,
    toggleAnimation: "rotateY" // 180deg
  },
  {
    name: "par",
    isOpen: false,
    toggleAnimation: "rotate" // 180deg
  }
];
control_items.forEach(item => {
  const control_items_element: HTMLSpanElement = document.getElementById("setting_icons") as HTMLSpanElement;
  (control_items_element.querySelector(`#control_button_${item.name}setup`) as HTMLButtonElement).addEventListener('click', () => {
    openControlItem(item.name);
  });
})

function openControlItem(test:string) {
  console.log(test);
}


// TO BE OVERHAULED
function showControlOption() {
  const control_presets : HTMLElement = document.getElementById('control_presets') as HTMLElement;
  const control_simulation : HTMLElement = document.getElementById('control_simulation') as HTMLElement;
  const control_timer : HTMLElement = document.getElementById('control_timer') as HTMLElement;
  const control_particles : HTMLElement = document.getElementById('control_particles') as HTMLElement;

  const selected : HTMLInputElement = document.querySelector('#control_display_options') as HTMLInputElement;
  switch (selected.value) {
    case "all":
      control_presets.style.display = "flex";
      control_simulation.style.display = "flex";
      control_timer.style.display = "flex";
      control_particles.style.display = "flex";
      break;
    case "presets":
      control_presets.style.display = "flex";
      control_simulation.style.display = "none";
      control_timer.style.display = "none";
      control_particles.style.display = "none";
      break;
    case "simulation":
      control_presets.style.display = "none";
      control_simulation.style.display = "flex";
      control_timer.style.display = "none";
      control_particles.style.display = "none";
      break;
    case "animation":
      control_presets.style.display = "none";
      control_simulation.style.display = "none";
      control_timer.style.display = "flex";
      control_particles.style.display = "none";
      break;
    case "particles":
      control_presets.style.display = "none";
      control_simulation.style.display = "none";
      control_timer.style.display = "none";
      control_particles.style.display = "flex";
      break;
    default:
      control_presets.style.display = "none";
      control_simulation.style.display = "none";
      control_timer.style.display = "none";
      control_particles.style.display = "none";
      console.log("No option selected.")
  }
}
