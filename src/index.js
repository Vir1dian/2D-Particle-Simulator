"use strict";
document.addEventListener("DOMContentLoaded", loadAll);
const control_bar_items_element = document.getElementById("setting_icons"); // not including the timer
const control_item_icons = control_bar_items_element.querySelectorAll(`.icon`);
let control_item_elements = document.querySelectorAll(".control_item");
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
        loadAvailablePresets() {
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
    simulationSettingsElementFunctionsOld.loadPreset('empty');
    const sim = new Simulation(TEMPORARY_PRESETS["sandbox"]);
    const anim = new AnimationController(sim);
    const anim_element = new AnimationControllerRenderer(anim);
    const environment_panel = new EnvironmentPanelRenderer(sim);
    const particle_panel = new ParticlePanelRenderer(sim.getParticlesHandler(), sim.getContainer());
    const control_bar_item = document.getElementById("setting_timer");
    anim_element.setParent(control_bar_item);
    const control_panel_element = document.querySelector(".control_items_wrapper");
    environment_panel.setParent(control_panel_element);
    particle_panel.setParent(control_panel_element);
    // Temporary fix for spin icon buttons, fix soon
    control_item_elements = document.querySelectorAll(".control_item");
    openControlItem(control_items_data[2]); // For DEV: Default opened settings upon refresh: 0 for visuals, 1 for simulation, 2 for particle
}
