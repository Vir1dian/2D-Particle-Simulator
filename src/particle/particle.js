"use strict";
const simulation_particles = [];
class Particle {
    constructor(mass = 1, radius = 5, position = new Vector2D(), velocity = new Vector2D(), acceleration = new Vector2D()) {
        Particle.instance_count++;
        this.id = Particle.instance_count;
        if (mass <= 0) {
            throw new Error('Invalid mass argument.');
        }
        if (radius <= 0) {
            throw new Error('Invalid radius argument.');
        }
        this.mass = mass;
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        simulation_particles.push(this);
    }
    collideContainer(container) {
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
    collideParticle(otherParticle, elasticity = 1) {
        const distance_vector = this.position.subtract(otherParticle.position);
        const distance = distance_vector.magnitude();
        if (distance === 0) { // Handles particles in the same location (i.e. instantiated in the same position)
            const random_direction = new Vector2D(2 * Math.random(), 2 * Math.random()).normalize();
            const minimum_separation = (this.radius + otherParticle.radius) / 2;
            this.position = this.position.add(random_direction.scalarMultiply(minimum_separation));
            otherParticle.position = otherParticle.position.subtract(random_direction.scalarMultiply(minimum_separation));
            return;
        }
        if (distance < this.radius + otherParticle.radius) {
            // Positional correction using projection method
            const penetration_normal = distance_vector.scalarMultiply((this.radius + otherParticle.radius - distance) / 2);
            this.position = this.position.add(penetration_normal);
            otherParticle.position = otherParticle.position.subtract(penetration_normal);
            // Velocity correction using impulse method
            const normal = distance_vector.normalize(); // n
            const relative_velocity = this.velocity.subtract(otherParticle.velocity); // v_ab = v_a - v_b
            const normal_velocity = relative_velocity.dotProduct(normal); // v_n = v_ab * n
            if (normal_velocity > 0) {
                return;
            }
            const impulse = -(1 + elasticity) * normal_velocity
                / ((1 / this.mass) + (1 / otherParticle.mass));
            // J = -(1+e)v_ab*n / (n*n*(1/m_a + 1/m_b)) where n*n = 1 since n is already a unit vector
            this.velocity = this.velocity.add(normal.scalarMultiply(impulse / this.mass));
            otherParticle.velocity = otherParticle.velocity.subtract(normal.scalarMultiply(impulse / otherParticle.mass));
        }
    }
    move() {
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
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
            this.position = this.position.randomize(max);
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
            this.velocity = this.velocity.randomize(max);
        }
        else {
            this.velocity.x = a;
            this.velocity.y = b;
        }
    }
}
Particle.instance_count = 0;
