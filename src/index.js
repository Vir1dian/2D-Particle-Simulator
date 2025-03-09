"use strict";
document.addEventListener("DOMContentLoaded", loadAll);
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
    return function (reverse) {
        spin += reverse ? -180 : 180;
        if (icon)
            icon.style.transform = `${transform}(${spin}deg)`;
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
        control_item_elements[index].style.display = (elem == item && !item.isOpen) ? "block" : "none";
    });
    if (!spinHandlers.has(item.name)) {
        spinHandlers.set(item.name, handleIconSpin(control_item_icon, item.toggleAnimation));
    }
    const spinHandler = spinHandlers.get(item.name);
    spinHandler(item.isOpen);
    item.isOpen = !item.isOpen;
}
const setupElementRenderers = {
    ui: {},
    simulation: {
        loadPresets() {
            const preset_datalist_element = document.getElementById("simsetup_presets");
            Object.keys(presets).forEach((preset_name) => {
                const option_element = document.createElement('option');
                option_element.value = preset_name;
                preset_datalist_element.appendChild(option_element);
            });
        },
    },
    particle: {}
};
// Sets the initial state of all elements
function loadAll() {
    loadContainerElement(container);
    simulationSettingsElementFunctions.loadPreset('empty');
    openControlItem(control_items_data[1]);
    // Simulation Presets
    setupElementRenderers.simulation.loadPresets();
    const simsetup_presets_button = document.getElementById("simsetup_presets_button");
    const simsetup_presets_input = document.getElementById("simsetup_presets_input");
    simsetup_presets_button.addEventListener("click", () => simulationSettingsElementFunctions.loadPreset(simsetup_presets_input.value));
}
