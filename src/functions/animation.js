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
    const courseness_factor_pos = Math.pow(10, ui_courseness);
    const courseness_factor_vel = Math.pow(10, ui_courseness - 3);
    const newX = Math.floor(selected_particle.position.x / courseness_factor_pos) * courseness_factor_pos;
    const newY = Math.floor(selected_particle.position.y / courseness_factor_pos) * courseness_factor_pos;
    const newVX = Math.floor(selected_particle.velocity.x / courseness_factor_vel) * courseness_factor_vel;
    const newVY = Math.floor(selected_particle.velocity.y / courseness_factor_vel) * courseness_factor_vel;
    const view_x_input = document.querySelector(`#view_x_id${selected_particle.id}`);
    const view_y_input = document.querySelector(`#view_y_id${selected_particle.id}`);
    const x_input = document.querySelector(`#set_x_id${selected_particle.id}`);
    const y_input = document.querySelector(`#set_y_id${selected_particle.id}`);
    const vx_input = document.querySelector(`#set_vx_id${selected_particle.id}`);
    const vy_input = document.querySelector(`#set_vy_id${selected_particle.id}`);
    view_x_input.value = newX.toString();
    view_y_input.value = newY.toString();
    x_input.value = newX.toString();
    y_input.value = newY.toString();
    vx_input.value = newVX.toString();
    vy_input.value = newVY.toString();
}
let start;
let particle_movement;
/**
 * Literally the slowest and most inefficient possible way to calculate collisions
 * TODO: Implement a different algorithm, consider:
 * 1. Sweep and Prune
 * 2. Uniform Grid Space
 * 3. KD Trees
 * 4. Bounding Volume Hierarchies
 *
 * @param timestamp
 */
let dt = 0;
function step(timestamp) {
    dt += 1 / 60;
    start = timestamp;
    simulation_particles.forEach((particle) => {
        particle.move(dt);
        particle.collideContainer(container);
        simulation_particles.forEach((otherParticle) => {
            if (otherParticle !== particle) {
                particle.collideParticle(otherParticle, 0.6);
            }
        });
        updateParticleElement(particle);
    });
    particle_movement = window.requestAnimationFrame(step);
}
const timer_element = document.querySelector('#simulation_timer');
let timer, time_elapsed = 0;
/**
 * Runs the particle simulation and toggles the control buttons
 */
function runSimulation() {
    // ignore if simulation has no particles
    if (!simulation_particles.length) {
        return;
    }
    // start a timer
    if (!timer) {
        timer = setInterval(() => {
            time_elapsed++;
            let hours = Math.floor(time_elapsed / 3600);
            if (hours / 10 < 1) {
                hours = "0" + hours;
            }
            let minutes = Math.floor(time_elapsed / 60) % 60;
            if (minutes / 10 < 1) {
                minutes = "0" + minutes;
            }
            let seconds = time_elapsed % 60;
            if (seconds / 10 < 1) {
                seconds = "0" + seconds;
            }
            timer_element.innerHTML = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    }
    // Change animation state
    window.requestAnimationFrame(step);
    // Update buttons in the HTML body
    const run_button = document.querySelector('#control_button_run');
    const pause_button = document.querySelector('#control_button_pause');
    const stop_button = document.querySelector('#control_button_stop');
    run_button.disabled = true;
    pause_button.disabled = false;
    stop_button.disabled = false;
}
/**
 * Pauses the particle simulation and toggles the control buttons
 */
function pauseSimulation() {
    // Pause a timer
    clearInterval(timer);
    timer = null;
    // Change animation state
    cancelAnimationFrame(particle_movement);
    // Update buttons in the HTML body
    const run_button = document.querySelector('#control_button_run');
    const pause_button = document.querySelector('#control_button_pause');
    run_button.disabled = false;
    pause_button.disabled = true;
}
/**
 * Stops the particle simulation and toggles the control buttons
 */
function stopSimulation(setting = '') {
    // Stop a timer
    clearInterval(timer);
    timer = null;
    time_elapsed = 0;
    timer_element.innerHTML = '00:00:00';
    // Change animation state
    dt = 0;
    cancelAnimationFrame(particle_movement);
    if (setting !== 'soft') {
        // Empty simulation data
        simulation_particles.length = 0;
        // Empty simulation elements
        const particle_elements = document.querySelectorAll('.particle_element');
        const control_particle_elements = document.querySelectorAll('.control_particle');
        particle_elements.forEach(element => {
            element.remove();
        });
        control_particle_elements.forEach(element => {
            element.remove();
        });
    }
    // Update buttons in the HTML body
    const run_button = document.querySelector('#control_button_run');
    const pause_button = document.querySelector('#control_button_pause');
    const stop_button = document.querySelector('#control_button_stop');
    run_button.disabled = false;
    pause_button.disabled = true;
    stop_button.disabled = true;
}
