"use strict";
class Particle {
    constructor(mass = 1, radius = 5, position = { x: 0, y: 0 }, velocity = { x: 0, y: 0 }, acceleration = { x: 0, y: 0 }) {
        this.mass = mass;
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
    }
    collide() {
    }
    move() {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
