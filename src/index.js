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
    control_bar_items_element.querySelector(`#control_button_${item.name}setup`).addEventListener('click', () => {
        openControlItem(item);
    });
});
// Handles animation of UI icons when clicked
const spinHandlers = new Map();
function handleIconSpin(icon, transform = "rotate") {
    let spin = 0;
    console.log(spin);
    return function (reverse) {
        spin += reverse ? -180 : 180;
        if (icon)
            icon.style.transform = `${transform}(${spin}deg)`;
        console.log(spin);
    };
}
function openControlItem(item) {
    const control_item_icon = document.querySelector(`#control_button_${item.name}setup .icon`);
    if (!control_item_icon) {
        console.warn(`Icon for ${item.name} not found.`);
        return;
    }
    control_items_data.forEach((elem, index) => {
        if (elem != item)
            elem.isOpen = false;
        control_item_elements[index].style.display = "none";
    });
    if (!spinHandlers.has(item.name)) {
        spinHandlers.set(item.name, handleIconSpin(control_item_icon, item.toggleAnimation));
    }
    // functionality of showControlOption moved here
    const spinHandler = spinHandlers.get(item.name);
    spinHandler(item.isOpen);
    console.log(item.isOpen);
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
