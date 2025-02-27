"use strict";
showControlOption();
loadContainerElement(container);
simulationSettingsElementFunctions.loadPreset('empty');
const control_bar_items_element = document.getElementById("setting_icons"); // not including the timer
const control_item_icons = control_bar_items_element.querySelectorAll(`.icon`);
const control_item_elements = document.querySelectorAll(".control_item");
const control_items_data = [
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
    control_bar_items_element.querySelector(`#control_button_${item.name}setup`).addEventListener('click', () => {
        openControlItem(item);
    });
});
function openControlItem(item) {
    const control_item_icon = document.querySelector(`#control_button_${item.name}setup .icon`);
    control_items_data.forEach((item, index) => {
        item.isOpen = false;
        control_item_icons[index].style.transform = `${item.toggleAnimation}(0deg)`;
        control_item_elements[index].style.display = "none";
    });
    // functionality of showControlOption moved here
    if (!item.isOpen) {
        control_item_icon.style.transform = `${item.toggleAnimation}(180deg)`;
    }
    else {
        control_item_icon.style.transform = `${item.toggleAnimation}(0deg)`;
    }
    item.isOpen = !item.isOpen;
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
