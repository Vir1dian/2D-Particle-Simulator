"use strict";
showControlOption();
loadContainerElement(container);
simulationSettingsElementFunctions.loadPreset('empty');
const control_items = [
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
    const control_items_element = document.getElementById("setting_icons");
    control_items_element.querySelector(`#control_button_${item.name}setup`).addEventListener('click', () => {
        openControlItem(item.name);
    });
});
function openControlItem(test) {
    console.log(test);
}
// TO BE OVERHAULED
function showControlOption() {
    const control_presets = document.getElementById('control_presets');
    const control_simulation = document.getElementById('control_simulation');
    const control_timer = document.getElementById('control_timer');
    const control_particles = document.getElementById('control_particles');
    const selected = document.querySelector('#control_display_options');
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
            console.log("No option selected.");
    }
}
