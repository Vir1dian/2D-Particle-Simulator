import { Simulation, TEMPORARY_PRESETS } from "./classes/entities/simulation/simulation";
import { AnimationControllerRenderer, AnimationController } from "./classes/entities/animation";
import { ContainerRenderer, EnvironmentPanelRenderer, ParticlePanelRenderer } from "./classes/renderers/features";

document.addEventListener("DOMContentLoaded", loadAll);

interface control_item_data {
  name: string,
  isOpen: boolean,
  toggleAnimation: string
}

const control_bar_items_element: HTMLSpanElement = document.getElementById("setting_icons") as HTMLSpanElement;  // not including the timer
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

// Sets the initial state of all elements
function loadAll() {
  const sim = new Simulation(TEMPORARY_PRESETS["empty"]);
  const cont = new ContainerRenderer(sim);
  const anim = new AnimationController(sim);
  const anim_element = new AnimationControllerRenderer(anim);
  const environment_panel = new EnvironmentPanelRenderer(sim);
  const particle_panel = new ParticlePanelRenderer(sim.getParticlesHandler(), cont);

  const sim_container_wrapper = document.querySelector('.simulation_wrapper') as HTMLDivElement;
  cont.setParent(sim_container_wrapper);

  const control_bar_item = document.getElementById("setting_timer") as HTMLSpanElement;
  anim_element.setParent(control_bar_item);

  const control_panel_element = document.querySelector(".control_items_wrapper") as HTMLElement;
  environment_panel.setParent(control_panel_element);
  particle_panel.setParent(control_panel_element);

  // Temporary fix for spin icon buttons, fix soon
  control_item_elements = document.querySelectorAll(".control_item") as NodeListOf<HTMLElement>;  

  openControlItem(control_items_data[1]);  // For DEV: Default opened settings upon refresh: 0 for visuals, 1 for simulation, 2 for particle

  // const test_sprite = new Sprite();
  // test_sprite.setStyle({ 
  //   backgroundColor: 'gray', 
  //   height: '100px', 
  //   width: '100px',
  // });
  // test_sprite.translate({x: 100,y: 300}).rotate(45).scale({x: 1,y: 1.5})
  // test_sprite.setParent(cont);

  // const test_arrow = new XYArrowSprite();
  // requestAnimationFrame(() => {
  //   test_arrow.setColor('green');
  //   test_arrow.rotate(90);
  // })
  // test_arrow.setParent(cont);

  // const test_z_arrow = new ZArrowSprite(false);
  // requestAnimationFrame(() => {
  //   test_z_arrow.translateCenter(new Vector2D(250, 250)).setColor('purple');
  // })
  // test_z_arrow.setParent(cont);

  // sim.setPreset({container: {x_min: 100, x_max: 100, y_min: 100, y_max: 100}});
}