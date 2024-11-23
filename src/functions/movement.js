"use strict";
let start;
let particle_movement;
let progress;
let isRunning = false;
function setRandomVelocity() {
    let max = 3;
    particle_a.velocity[0] = -max + Math.random() * 2 * max; // ranges from +max to -max
    particle_a.velocity[1] = -max + Math.random() * 2 * max;
}
function simpleMovement(gravity = 0) {
    particle_a.position[0] += particle_a.velocity[0];
    particle_a.position[1] += particle_a.velocity[1];
    if (gravity === 1) {
        particle_a.velocity[1] += particle_a.acceleration[1];
    }
}
/**
 * TODO: Implement continuous collision detection
 *
 * @param {*} dampening
 */
function collision(dampening = 1) {
    if (particle_a.position[0] + particle_a.radius >= container.x_max) { // collision with right (totally elastic)
        particle_a.velocity[0] = -particle_a.velocity[0] * dampening;
    }
    else if (particle_a.position[0] - particle_a.radius <= container.x_min) { // collision with left (totally elastic)
        particle_a.velocity[0] = -particle_a.velocity[0] * dampening;
    }
    if (particle_a.position[1] + particle_a.radius >= container.x_max) { // collision with top and bottom (totally elastic)
        particle_a.velocity[1] = -particle_a.velocity[1] * dampening;
    }
    else if (particle_a.position[1] - particle_a.radius <= container.x_min) { // collision with bottom (totally elastic)
        particle_a.velocity[1] = -particle_a.velocity[1] * dampening;
    }
    if (dampening !== 1) {
        if (Math.abs(particle_a.velocity[0]) < 0.0001) {
            particle_a.velocity[0] = 0;
            particle_a.acceleration[0] = 0;
        }
        if (Math.abs(particle_a.velocity[1]) < 0.0001) {
            particle_a.velocity[1] = 0;
            particle_a.acceleration[1] = 0;
        }
    }
}
function updateParticle() {
    const visual_particle = document.querySelector('.visual_particle');
    visual_particle.style.left = `${(particle_a.position[0] - particle_a.radius) - container.x_min}px`;
    visual_particle.style.top = `${container.y_max - (particle_a.position[1] + particle_a.radius)}px`;
    const x_input = document.querySelector('#set_x');
    const y_input = document.querySelector('#set_y');
    x_input.value = Math.floor(particle_a.position[0] / 10) * 10;
    y_input.value = Math.floor(particle_a.position[1] / 10) * 10;
}
function step(timestamp) {
    start = timestamp;
    simpleMovement(1);
    collision(0.9);
    updateParticle();
    particle_movement = window.requestAnimationFrame(step);
}
function runSimulation() {
    if (!isRunning) {
        setRandomVelocity();
        isRunning = true;
        window.requestAnimationFrame(step);
    }
    else {
        isRunning = false;
        cancelAnimationFrame(stopID);
    }
}
