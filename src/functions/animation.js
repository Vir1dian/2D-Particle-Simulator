"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AnimationControllerRenderer_controller, _AnimationControllerRenderer_timer_element, _AnimationControllerRenderer_run_button, _AnimationControllerRenderer_pause_button, _AnimationControllerRenderer_stop_button, _AnimationController_simulation, _AnimationController_state, _AnimationController_time_elapsed;
class AnimationControllerRenderer extends Renderer {
    // #observers: ObserverHandler<>;
    constructor(controller) {
        const wrapper = document.createElement('div');
        super(wrapper, '', "control_timer");
        _AnimationControllerRenderer_controller.set(this, void 0);
        _AnimationControllerRenderer_timer_element.set(this, void 0);
        _AnimationControllerRenderer_run_button.set(this, void 0);
        _AnimationControllerRenderer_pause_button.set(this, void 0);
        _AnimationControllerRenderer_stop_button.set(this, void 0);
        // Saved Data
        __classPrivateFieldSet(this, _AnimationControllerRenderer_controller, controller, "f");
        __classPrivateFieldSet(this, _AnimationControllerRenderer_timer_element, this.SetupTimerElement(controller.getTimeElapsed()), "f");
        __classPrivateFieldSet(this, _AnimationControllerRenderer_run_button, this.SetupRunButton(controller), "f");
        __classPrivateFieldSet(this, _AnimationControllerRenderer_pause_button, this.SetupPauseButton(controller), "f");
        __classPrivateFieldSet(this, _AnimationControllerRenderer_stop_button, this.SetupStopButton(controller), "f");
        // DOM Content
        const wrapper_table = document.createElement('table');
        const timer_wrapper_row = document.createElement('tr');
        const cell0 = document.createElement('td');
        cell0.colSpan = 3;
        cell0.appendChild(__classPrivateFieldGet(this, _AnimationControllerRenderer_timer_element, "f"));
        timer_wrapper_row.appendChild(cell0);
        const buttons_wrapper_row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        const cell3 = document.createElement('td');
        __classPrivateFieldGet(this, _AnimationControllerRenderer_run_button, "f").setParent(cell1);
        __classPrivateFieldGet(this, _AnimationControllerRenderer_pause_button, "f").setParent(cell2);
        __classPrivateFieldGet(this, _AnimationControllerRenderer_stop_button, "f").setParent(cell3);
        buttons_wrapper_row.appendChild(cell1);
        buttons_wrapper_row.appendChild(cell2);
        buttons_wrapper_row.appendChild(cell3);
        wrapper_table.appendChild(timer_wrapper_row);
        wrapper_table.appendChild(buttons_wrapper_row);
        wrapper.appendChild(wrapper_table);
    }
    SetupTimerElement(time_elapsed) {
        const timer_element = document.createElement('div');
        timer_element.id = "animation_timer";
        timer_element.innerHTML = this.FormatTime(time_elapsed);
        return timer_element;
    }
    SetupRunButton(controller) {
        const button = new ButtonRenderer(() => {
        });
        button.setLabel("play_arrow", true);
        button.setID("control_button_run");
        return button;
    }
    SetupPauseButton(controller) {
        const button = new ButtonRenderer(() => {
        });
        button.setLabel("pause", true);
        button.setID("control_button_pause");
        return button;
    }
    SetupStopButton(controller) {
        const button = new ButtonRenderer(() => {
        });
        button.setLabel("stop", true);
        button.setID("control_button_stop");
        return button;
    }
    FormatTime(time) {
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor(time / 60) % 60;
        let seconds = Math.round(time) % 60;
        console.log(hours);
        console.log(minutes);
        console.log(seconds);
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}
_AnimationControllerRenderer_controller = new WeakMap(), _AnimationControllerRenderer_timer_element = new WeakMap(), _AnimationControllerRenderer_run_button = new WeakMap(), _AnimationControllerRenderer_pause_button = new WeakMap(), _AnimationControllerRenderer_stop_button = new WeakMap();
var AnimationState;
(function (AnimationState) {
    AnimationState[AnimationState["Stopped"] = 0] = "Stopped";
    AnimationState[AnimationState["Running"] = 1] = "Running";
    AnimationState[AnimationState["Paused"] = 2] = "Paused";
})(AnimationState || (AnimationState = {}));
class AnimationController {
    constructor(simulation) {
        _AnimationController_simulation.set(this, void 0);
        _AnimationController_state.set(this, void 0);
        _AnimationController_time_elapsed.set(this, void 0); // in total number of seconds
        __classPrivateFieldSet(this, _AnimationController_simulation, simulation, "f");
        __classPrivateFieldSet(this, _AnimationController_state, AnimationState.Stopped, "f");
        __classPrivateFieldSet(this, _AnimationController_time_elapsed, 0, "f");
    }
    getState() {
        return __classPrivateFieldGet(this, _AnimationController_state, "f");
    }
    getTimeElapsed() {
        return __classPrivateFieldGet(this, _AnimationController_time_elapsed, "f");
    }
}
_AnimationController_simulation = new WeakMap(), _AnimationController_state = new WeakMap(), _AnimationController_time_elapsed = new WeakMap();
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
let time_previous = 0, time_elapsed = 0, time_paused = 0;
let simulation_state = SimulationState.Stopped;
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
function step(timestamp) {
    // Time update for differential and movement caluclations
    if (!time_previous)
        time_previous = timestamp;
    const dt = Math.min((timestamp - time_previous) / 1000, 1 / 60); // Using this line instead of 1/60 for higher accuracy, in seconds. Capped to 1/60
    time_previous = timestamp; // Update the previous timestamp for the next frame
    time_elapsed += dt; // Update total elapsed time in seconds
    // console.log(dt + ' ' + elapsedTime);
    // Collision
    start = timestamp;
    simulation_particles.forEach((particle) => {
        particle.move(dt, time_elapsed);
        if (particle.collideContainer(container) && particle.trajectory) {
            particleElementFunctionsOld.eraseTrajectory(particle.id);
            particleElementFunctionsOld.drawTrajectory(particle, time_elapsed, simulation_settings.environment.trajectory_step);
        }
        ;
        simulation_particles.forEach((otherParticle) => {
            if (otherParticle !== particle) {
                if (particle.collideParticle(otherParticle, simulation_settings.environment.elasticity)) {
                    if (particle.trajectory) {
                        particleElementFunctionsOld.eraseTrajectory(particle.id);
                        particleElementFunctionsOld.drawTrajectory(particle, time_elapsed, simulation_settings.environment.trajectory_step);
                    }
                    if (otherParticle.trajectory) {
                        particleElementFunctionsOld.eraseTrajectory(otherParticle.id);
                        particleElementFunctionsOld.drawTrajectory(otherParticle, time_elapsed, simulation_settings.environment.trajectory_step);
                    }
                }
            }
        });
        updateParticleElement(particle);
    });
    particle_movement = window.requestAnimationFrame(step);
}
const timer_element = document.querySelector('#simulation_timer');
let timer;
// let timer_elapsed: number = 0;
/**
 * Runs the particle simulation and toggles the control buttons
 */
function runSimulation() {
    // ignore if simulation has no particles
    if (!simulation_particles.length || simulation_state === SimulationState.Running) {
        return;
    }
    if (time_paused) {
        const pauseDuration = (performance.now() - time_paused) / 1000; // Time paused in seconds
        time_previous += pauseDuration * 1000; // Adjust previousTime by pause duration
        time_paused = 0; // Reset pauseTime
    }
    // start a timer
    if (!timer) {
        timer = setInterval(() => {
            let hours = Math.floor(time_elapsed / 3600);
            if (hours / 10 < 1) {
                hours = "0" + hours;
            }
            let minutes = Math.floor(time_elapsed / 60) % 60;
            if (minutes / 10 < 1) {
                minutes = "0" + minutes;
            }
            let seconds = Math.round(time_elapsed) % 60;
            if (seconds / 10 < 1) {
                seconds = "0" + seconds;
            }
            timer_element.innerHTML = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    }
    // Change animation state
    window.requestAnimationFrame(step);
    simulation_state = SimulationState.Running;
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
    if (simulation_state === SimulationState.Paused || simulation_state === SimulationState.Stopped) {
        return;
    }
    // Pause a timer
    clearInterval(timer);
    timer = null;
    // Record the pause time
    if (time_elapsed) {
        time_paused = performance.now();
    }
    // Change animation state
    cancelAnimationFrame(particle_movement);
    simulation_state = SimulationState.Paused;
    // Update buttons in the HTML body
    const run_button = document.querySelector('#control_button_run');
    const pause_button = document.querySelector('#control_button_pause');
    run_button.disabled = false;
    pause_button.disabled = true;
}
/**
 * Stops the particle simulation and toggles the control buttons
 */
function stopSimulation() {
    // Stop a timer
    clearInterval(timer);
    timer = null;
    timer_element.innerHTML = '00:00:00';
    // Change animation state
    time_previous = 0;
    time_elapsed = 0;
    time_paused = 0;
    simulation_state = SimulationState.Stopped;
    cancelAnimationFrame(particle_movement);
    // Empty simulation data
    simulation_particles.length = 0;
    // Empty simulation elements
    const particle_elements = document.querySelectorAll('.particle_element');
    const control_particle_elements = document.querySelectorAll('.control_particle');
    const trajectory_points = document.querySelectorAll('.point');
    trajectory_points.forEach(element => {
        element.remove();
    });
    particle_elements.forEach(element => {
        element.remove();
    });
    control_particle_elements.forEach(element => {
        element.remove();
    });
    // Update buttons in the HTML body
    const run_button = document.querySelector('#control_button_run');
    const pause_button = document.querySelector('#control_button_pause');
    const stop_button = document.querySelector('#control_button_stop');
    run_button.disabled = false;
    pause_button.disabled = true;
    stop_button.disabled = true;
}
