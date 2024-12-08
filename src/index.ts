showControlOption();
loadContainerElement(container);
simulationSettingsElementFunctions.loadPreset('empty');

function showControlOption() {
  const control_presets : HTMLElement = document.getElementById('control_presets') as HTMLElement;
  const control_simulation : HTMLElement = document.getElementById('control_simulation') as HTMLElement;
  const control_animation : HTMLElement = document.getElementById('control_animation') as HTMLElement;
  const control_particles : HTMLElement = document.getElementById('control_particles') as HTMLElement;

  const selected : HTMLInputElement = document.querySelector('#control_display_options') as HTMLInputElement;
  switch (selected.value) {
    case "all":
      control_presets.style.display = "flex";
      control_simulation.style.display = "flex";
      control_animation.style.display = "flex";
      control_particles.style.display = "flex";
      break;
    case "presets":
      control_presets.style.display = "flex";
      control_simulation.style.display = "none";
      control_animation.style.display = "none";
      control_particles.style.display = "none";
      break;
    case "simulation":
      control_presets.style.display = "none";
      control_simulation.style.display = "flex";
      control_animation.style.display = "none";
      control_particles.style.display = "none";
      break;
    case "animation":
      control_presets.style.display = "none";
      control_simulation.style.display = "none";
      control_animation.style.display = "flex";
      control_particles.style.display = "none";
      break;
    case "particles":
      control_presets.style.display = "none";
      control_simulation.style.display = "none";
      control_animation.style.display = "none";
      control_particles.style.display = "flex";
      break;
    default:
      control_presets.style.display = "none";
      control_simulation.style.display = "none";
      control_animation.style.display = "none";
      control_particles.style.display = "none";
      console.log("No option selected.")
  }
}