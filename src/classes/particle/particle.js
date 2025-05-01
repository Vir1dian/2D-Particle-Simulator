"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _Particle_instance_count, _Particle_id, _Particle_group_id;
const PARTICLE_COLORS = ['black', 'gray', 'blue', 'red', 'pink', 'green', 'yellow', 'orange', 'violet', 'purple', 'brown'];
var ParticleEvent;
(function (ParticleEvent) {
    ParticleEvent[ParticleEvent["Update"] = 0] = "Update";
    ParticleEvent[ParticleEvent["Edit"] = 1] = "Edit";
    ParticleEvent[ParticleEvent["Delete"] = 2] = "Delete";
    ParticleEvent[ParticleEvent["Move"] = 3] = "Move";
})(ParticleEvent || (ParticleEvent = {}));
;
class Particle {
    constructor(grouping = DEFAULT_GROUPING) {
        var _b;
        var _c, _d;
        _Particle_id.set(this, void 0);
        _Particle_group_id.set(this, void 0);
        __classPrivateFieldSet(this, _Particle_id, __classPrivateFieldSet(_c = _a, _a, (_d = __classPrivateFieldGet(_c, _a, "f", _Particle_instance_count), ++_d), "f", _Particle_instance_count), "f");
        __classPrivateFieldSet(this, _Particle_group_id, grouping.group_id, "f");
        this.radius = this.resolveValue(grouping.radius, DEFAULT_GROUPING.radius, () => Math.floor(Math.random() * (20 - 5 + 1) + 5));
        this.position = this.resolveVector(grouping.position, DEFAULT_GROUPING.position, 250 - this.radius);
        this.velocity = this.resolveVector(grouping.velocity, DEFAULT_GROUPING.velocity);
        this.mass = this.resolveValue(grouping.mass, DEFAULT_GROUPING.mass, () => Math.floor(Math.random() * (10 - 1 + 1) + 1));
        this.charge = this.resolveValue(grouping.charge, DEFAULT_GROUPING.charge, () => Math.floor(Math.random() * (10 - 1 + 1) + 1));
        this.color = this.resolveColor(grouping.color);
        this.enable_path_tracing = (_b = grouping.enable_path_tracing) !== null && _b !== void 0 ? _b : DEFAULT_GROUPING.enable_path_tracing;
    }
    resolveValue(value, default_value, randomizer) {
        if (!value)
            return default_value;
        if (value === 'random')
            return randomizer();
        return value;
    }
    resolveVector(vector, default_vector, rand_range = 100) {
        if (!vector)
            return default_vector.clone();
        if (vector === 'random')
            return Vector2D.randomize_int(rand_range);
        return vector.clone();
    }
    resolveColor(color) {
        if (!color)
            return DEFAULT_GROUPING.color;
        if (color === 'random')
            return PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        if (!PARTICLE_COLORS.includes(color))
            return "black";
        return color;
    }
    getID() {
        return __classPrivateFieldGet(this, _Particle_id, "f");
    }
    getGroupID() {
        return __classPrivateFieldGet(this, _Particle_group_id, "f");
    }
    // Behavior (Called repeatedly by animation.js)
    collideContainer(container) {
        let hasCollided = false;
        if (this.position.x + this.radius > container.x_max) { // collision with right (totally elastic)
            this.velocity.x = -this.velocity.x;
            this.position.x = container.x_max - this.radius;
            hasCollided = true;
        }
        if (this.position.x - this.radius < container.x_min) { // collision with left (totally elastic)
            this.velocity.x = -this.velocity.x;
            this.position.x = container.x_min + this.radius;
            hasCollided = true;
        }
        if (this.position.y + this.radius > container.y_max) { // collision with top (totally elastic)
            this.velocity.y = -this.velocity.y;
            this.position.y = container.y_max - this.radius;
            hasCollided = true;
        }
        if (this.position.y - this.radius < container.y_min) { // collision with bottom (totally elastic)
            this.velocity.y = -this.velocity.y;
            this.position.y = container.y_min + this.radius;
            hasCollided = true;
        }
        return hasCollided;
    }
    collideParticle(otherParticle, elasticity = 1) {
        if (elasticity < 0 || elasticity > 1) {
            throw new Error("Invalid elasticity value.");
        }
        const distance_vector = this.position.subtract(otherParticle.position);
        const distance = distance_vector.magnitude();
        if (distance === 0) { // Handles particles in the same location (i.e. instantiated in the same position)
            let random_direction = new Vector2D(Math.random(), Math.random());
            random_direction = random_direction.normalize();
            const minimum_separation = (this.radius + otherParticle.radius) / 2;
            this.position = this.position.add(random_direction.scalarMultiply(minimum_separation));
            otherParticle.position = otherParticle.position.subtract(random_direction.scalarMultiply(minimum_separation));
            return false;
        }
        if (distance <= this.radius + otherParticle.radius) {
            // Positional correction using projection method
            // const penetration_normal: Vector2D = distance_vector.scalarMultiply((this.radius + otherParticle.radius - distance) / 2);
            // this.position = this.position.add(penetration_normal);
            // otherParticle.position = otherParticle.position.subtract(penetration_normal);
            // Velocity correction using impulse method
            const normal = distance_vector.normalize(); // n
            const relative_velocity = this.velocity.subtract(otherParticle.velocity); // v_ab = v_a - v_b
            const normal_velocity = relative_velocity.dotProduct(normal); // v_n = v_ab * n
            if (normal_velocity > 0) {
                return false;
            }
            const impulse = -(1 + elasticity) * normal_velocity
                / ((1 / this.mass) + (1 / otherParticle.mass));
            // J = -(1+e)v_ab*n / (n*n*(1/m_a + 1/m_b)) where n*n = 1 since n is already a unit vector
            this.velocity = this.velocity.add(normal.scalarMultiply(impulse / this.mass));
            otherParticle.velocity = otherParticle.velocity.subtract(normal.scalarMultiply(impulse / otherParticle.mass));
            return true;
        }
        return false;
    }
    /**
     * "Moves" or changes the particle's kinematic properties given some time span
     * @param {number} dt The time change that the movement occurs, more accurate the smaller the value is
     * @param {number} t The total time elapsed, used for oscillation only (WIP)
     * @param {'euler' | 'rungekutta'} method The calculation used, euler by default
     */
    move(dt, t, method = 'euler') {
        // dv/dt = g - (b/m)*v
        const gravity = simulation_settings.environment.acceleration; // Currently a global constant, will replace with inputs soon
        const dragOverMass = simulation_settings.environment.drag / this.mass;
        if (method === 'euler') {
            const drag_force = this.velocity.scalarMultiply(-dragOverMass);
            const new_acceleration = gravity.add(drag_force);
            this.velocity = this.velocity.add(new_acceleration.scalarMultiply(dt));
            this.position = this.position.add(this.velocity.scalarMultiply(dt));
        }
        else if (method === 'rungekutta') {
            const new_acceleration = (vel) => gravity.add(vel.scalarMultiply(-dragOverMass));
            const k1_velocity = this.velocity;
            const k1_acceleration = new_acceleration(k1_velocity);
            const k2_velocity = this.velocity.add(k1_acceleration.scalarMultiply(0.5 * dt));
            const k2_acceleration = new_acceleration(k2_velocity);
            const k3_velocity = this.velocity.add(k2_acceleration.scalarMultiply(0.5 * dt));
            const k3_acceleration = new_acceleration(k3_velocity);
            const k4_velocity = this.velocity.add(k3_acceleration.scalarMultiply(dt));
            const k4_acceleration = new_acceleration(k4_velocity);
            this.velocity = this.velocity.add(k1_acceleration.add(k2_acceleration.scalarMultiply(2))
                .add(k3_acceleration.scalarMultiply(2))
                .add(k4_acceleration)
                .scalarMultiply(dt / 6));
            this.position = this.position.add(k1_velocity.add(k2_velocity.scalarMultiply(2))
                .add(k3_velocity.scalarMultiply(2))
                .add(k4_velocity)
                .scalarMultiply(dt / 6));
        }
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
            this.position = Vector2D.randomize_int(max);
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
            this.velocity = Vector2D.randomize_int(max);
        }
        else {
            this.velocity.x = a;
            this.velocity.y = b;
        }
    }
}
_a = Particle, _Particle_id = new WeakMap(), _Particle_group_id = new WeakMap();
_Particle_instance_count = { value: 0 };
