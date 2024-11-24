"use strict";
const simulation_particles = [];
class Particle {
    constructor(mass = 1, radius = 5, position = { x: 0, y: 0 }, velocity = { x: 0, y: 0 }, acceleration = { x: 0, y: 0 }) {
        Particle.instance_count++;
        this.id = Particle.instance_count;
        this.mass = mass;
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        simulation_particles.push(this);
    }
    collide_elastic(container) {
        if (this.position.x + this.radius > container.x_max) { // collision with right (totally elastic)
            this.velocity.x = -this.velocity.x;
            this.position.x = container.x_max - this.radius;
        }
        else if (this.position.x - this.radius < container.x_min) { // collision with left (totally elastic)
            this.velocity.x = -this.velocity.x;
            this.position.x = container.x_min + this.radius;
        }
        if (this.position.y + this.radius > container.y_max) { // collision with top (totally elastic)
            this.velocity.y = -this.velocity.y;
            this.position.y = container.y_max - this.radius;
        }
        else if (this.position.y - this.radius < container.y_min) { // collision with bottom (totally elastic)
            this.velocity.y = -this.velocity.y;
            this.position.y = container.y_min + this.radius;
        }
    }
    move() {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    /**
     * Sets a new position in a 2D space for a particle
     *
     * @param {number | 'random'} a Either the position of the particle in the x-axis, or the setting for randomizing the particle position
     * @param {number} b Either the position of the particle in the y-axis, or the set range (-max to +max) that the particle position can be randomized
     */
    setPosition(a = 0, b = 0) {
        if (a === 'random') {
            let max = b === 0 ? 1 : b;
            this.position.x = -max + Math.random() * 2 * max;
            this.position.y = -max + Math.random() * 2 * max;
        }
        else {
            this.position.x = a;
            this.position.y = b;
        }
    }
    /**
     * Sets a new velocity in a 2D space for a particle
     *
     * @param {number | 'random'} a Either the velocity of the particle in the x-axis, or the setting for randomizing the particle velocity
     * @param {number} b Either the velocity of the particle in the y-axis, or the set range (-max to +max) that the particle velocity can be randomized
     */
    setVelocity(a = 0, b = 0) {
        if (a === 'random') {
            let max = b === 0 ? 1 : b;
            this.velocity.x = -max + Math.random() * 2 * max;
            this.velocity.y = -max + Math.random() * 2 * max;
        }
        else {
            this.velocity.x = a;
            this.velocity.y = b;
        }
    }
}
Particle.instance_count = 0;
