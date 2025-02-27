showControlOption();
loadContainerElement(container);
simulationSettingsElementFunctions.loadPreset('empty');

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
control_items_data.forEach(item => {
  (control_bar_items_element.querySelector(`#control_button_${item.name}setup`) as HTMLButtonElement).addEventListener('click', () => {
    openControlItem(item);
  });
})

function openControlItem(item:control_item_data) {
  const control_item_icon: HTMLSpanElement = document.querySelector(`#control_button_${item.name}setup .icon`) as HTMLSpanElement;
  control_items_data.forEach((item, index) => {
    item.isOpen = false;
    control_item_icons[index].style.transform = `${item.toggleAnimation}(0deg)`;
    control_item_elements[index].style.display = "none";
  })

  // functionality of showControlOption moved here
  
  if (!item.isOpen) {
    control_item_icon.style.transform = `${item.toggleAnimation}(180deg)`;
  } else {
    control_item_icon.style.transform = `${item.toggleAnimation}(0deg)`;
  }
  item.isOpen = !item.isOpen;
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
