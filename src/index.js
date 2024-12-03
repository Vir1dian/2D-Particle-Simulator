"use strict";
loadContainerElement(container);
simulationSettingsElementFunctions.loadSettings(simulation_settings);
simulationSettingsElementFunctions.applySettings(simulation_settings);
function showControlOption() {
    const control_simulation = document.getElementById('control_simulation');
    const control_animation = document.getElementById('control_animation');
    const control_add_particle = document.getElementById('control_add_particle');
    const control_particles = document.getElementById('control_particles');
    const selected = document.querySelector('#control_display_options');
    switch (selected.value) {
        case "simulation":
            control_simulation.style.display = "flex";
            control_animation.style.display = "none";
            control_add_particle.style.display = "none";
            control_particles.style.display = "none";
            break;
        case "animation":
            control_simulation.style.display = "none";
            control_animation.style.display = "flex";
            control_add_particle.style.display = "none";
            control_particles.style.display = "none";
            break;
        case "addParticle":
            control_simulation.style.display = "none";
            control_animation.style.display = "none";
            control_add_particle.style.display = "flex";
            control_particles.style.display = "none";
            break;
        case "particles":
            control_simulation.style.display = "none";
            control_animation.style.display = "none";
            control_add_particle.style.display = "none";
            control_particles.style.display = "flex";
            break;
        case "all":
            control_simulation.style.display = "flex";
            control_animation.style.display = "flex";
            control_add_particle.style.display = "flex";
            control_particles.style.display = "flex";
            break;
        default:
            console.log("No option selected.");
    }
}
