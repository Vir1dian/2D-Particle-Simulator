"use strict";
/**
 * Updates an element representing a moving particle in the HTML body, used for frame-by-frame animation
 *
 * @param {number} id number associated with the selected particle
 * @param {number} ui_courseness defines how often display values change as the selected particle changes position
 */
function updateParticleElement(selected_particle, ui_courseness = 1) {
    // Update the location of the selected particle's element
    const particle_element = document.querySelector(`#particle_element_id${selected_particle.id}`);
    particle_element.style.left = `${(selected_particle.position.x - selected_particle.radius) - container.x_min}px`;
    particle_element.style.top = `${container.y_max - (selected_particle.position.y + selected_particle.radius)}px`;
    // Update displayed data for the selected particle
    const courseness_factor = Math.pow(10, ui_courseness);
    const newX = Math.floor(selected_particle.position.x / courseness_factor) * courseness_factor;
    const newY = Math.floor(selected_particle.position.y / courseness_factor) * courseness_factor;
    const x_input = document.querySelector(`#set_x_id${selected_particle.id}`);
    const y_input = document.querySelector(`#set_y_id${selected_particle.id}`);
    x_input.value = newX.toString();
    y_input.value = newY.toString();
}
let start;
let particle_movement;
function step(timestamp) {
    start = timestamp;
    simulation_particles.forEach((particle) => {
        particle.move();
        particle.collide_elastic(container);
        updateParticleElement(particle);
    });
    particle_movement = window.requestAnimationFrame(step);
}
/**
 * Runs the particle simulation and toggles the control buttons
 */
function runSimulation() {
    // Change animation state
    simulation_particles.forEach((particle) => {
        particle.setVelocity('random', 3);
    });
    window.requestAnimationFrame(step);
    // Update buttons in the HTML body
    const run_button = document.querySelector('#control_button_run');
    const pause_button = document.querySelector('#control_button_pause');
    const stop_button = document.querySelector('#control_button_stop');
    run_button.style.display = "none";
    pause_button.style.display = "";
    stop_button.style.display = "";
}
/**
 * Pauses the particle simulation and toggles the control buttons
 */
function pauseSimulation() {
    // Change animation state
    cancelAnimationFrame(particle_movement);
    // Update buttons in the HTML body
    const run_button = document.querySelector('#control_button_run');
    const pause_button = document.querySelector('#control_button_pause');
    run_button.style.display = "";
    pause_button.style.display = "none";
}
/**
 * TODO: Implement RESETTING THE SIM
 * Stops the particle simulation and toggles the control buttons
 */
function stopSimulation() {
    // Change animation state
    cancelAnimationFrame(particle_movement);
    // Update buttons in the HTML body
    const run_button = document.querySelector('#control_button_run');
    const pause_button = document.querySelector('#control_button_pause');
    const stop_button = document.querySelector('#control_button_stop');
    run_button.style.display = "";
    pause_button.style.display = "none";
    stop_button.style.display = "none";
}
