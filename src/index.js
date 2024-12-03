"use strict";
showControlOption();
loadContainerElement(container);
simulationSettingsElementFunctions.loadPreset('sandbox');
function showControlOption() {
    const control_presets = document.getElementById('control_presets');
    const control_simulation = document.getElementById('control_simulation');
    const control_animation = document.getElementById('control_animation');
    const control_particles = document.getElementById('control_particles');
    const selected = document.querySelector('#control_display_options');
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
            console.log("No option selected.");
    }
}
