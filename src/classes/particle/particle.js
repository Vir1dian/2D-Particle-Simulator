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
var _a, _Particle_instance_count, _Particle_observers, _Particle_id, _Particle_group_id, _Particle_is_highlighted;
const PARTICLE_COLORS = ['black', 'gray', 'blue', 'red', 'pink', 'green', 'yellow', 'orange', 'violet', 'purple', 'brown'];
// const ParticleHighlightMap: Record<string, string> = {
//   black: 'gray',
//   gray: 'lightgray',
//   blue: 'cornflowerblue',
//   red: 'crimson',
//   pink: 'hotpink',
//   green: 'limegreen',
//   yellow: 'gold',
//   orange: 'darkorange',
//   violet: 'orchid',
//   purple: 'mediumorchid',
//   brown: 'peru'
// }
var ParticleEvent;
(function (ParticleEvent) {
    ParticleEvent[ParticleEvent["Update"] = 0] = "Update";
    ParticleEvent[ParticleEvent["Edit"] = 1] = "Edit";
    ParticleEvent[ParticleEvent["Move"] = 2] = "Move";
    ParticleEvent[ParticleEvent["Highlight"] = 3] = "Highlight";
})(ParticleEvent || (ParticleEvent = {}));
;
class Particle {
    constructor(grouping = DEFAULT_GROUPING, container) {
        var _b;
        var _c, _d;
        _Particle_observers.set(this, void 0);
        _Particle_id.set(this, void 0);
        _Particle_group_id.set(this, void 0);
        _Particle_is_highlighted.set(this, void 0);
        __classPrivateFieldSet(this, _Particle_observers, new ObserverHandler(ParticleEvent), "f");
        __classPrivateFieldSet(this, _Particle_id, __classPrivateFieldSet(_c = _a, _a, (_d = __classPrivateFieldGet(_c, _a, "f", _Particle_instance_count), ++_d), "f", _Particle_instance_count), "f");
        __classPrivateFieldSet(this, _Particle_group_id, grouping.group_id, "f");
        this.radius = this.resolveValue(grouping.radius, DEFAULT_GROUPING.radius, () => Math.floor(Math.random() * (20 - 5 + 1) + 5));
        this.position = this.resolvePosition(grouping.position, DEFAULT_GROUPING.position, container);
        this.velocity = this.resolveVector(grouping.velocity, DEFAULT_GROUPING.velocity);
        this.mass = this.resolveValue(grouping.mass, DEFAULT_GROUPING.mass, () => Math.floor(Math.random() * (10 - 1 + 1) + 1));
        this.charge = this.resolveValue(grouping.charge, DEFAULT_GROUPING.charge, () => Math.floor(Math.random() * (10 - 1 + 1) + 1));
        this.color = this.resolveColor(grouping.color);
        this.enable_path_tracing = (_b = grouping.enable_path_tracing) !== null && _b !== void 0 ? _b : DEFAULT_GROUPING.enable_path_tracing;
        __classPrivateFieldSet(this, _Particle_is_highlighted, false, "f");
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
    resolvePosition(vector, default_vector, container) {
        if (!vector)
            return default_vector.clone();
        if (vector === 'random') {
            return new Vector2D(Math.floor(Math.random() * ((container.x_max - this.radius) - (container.x_min + this.radius) + 1) + (container.x_min + this.radius)), Math.floor(Math.random() * ((container.y_max - this.radius) - (container.y_min + this.radius) + 1) + (container.y_min + this.radius)));
        }
        return vector.clone();
    }
    getObservers() {
        return __classPrivateFieldGet(this, _Particle_observers, "f");
    }
    getID() {
        return __classPrivateFieldGet(this, _Particle_id, "f");
    }
    getGroupID() {
        return __classPrivateFieldGet(this, _Particle_group_id, "f");
    }
    edit(changes) {
        const change_flags = createKeyFlags(this);
        Object.keys(change_flags).forEach(property => {
            const new_value = changes[property];
            const current_value = this[property];
            if (isVectorLike(new_value) && isVectorLike(current_value)) {
                if (new_value.x !== current_value.x || new_value.y !== current_value.y) {
                    this[property] = new Vector2D(new_value.x, new_value.y);
                    change_flags[property] = true;
                }
            }
            else if (new_value !== current_value) {
                this[property] = new_value;
                change_flags[property] = true;
            }
        });
        // hard coded to disable path tracing unless specified in the preset
        this['enable_path_tracing'] = false;
        change_flags['enable_path_tracing'] = false;
        __classPrivateFieldGet(this, _Particle_observers, "f").notify(ParticleEvent.Update, undefined);
        __classPrivateFieldGet(this, _Particle_observers, "f").notify(ParticleEvent.Edit, { change_flags: change_flags });
    }
    clear() {
        __classPrivateFieldGet(this, _Particle_observers, "f").clearAll();
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
     * "Moves" or changes the particle's kinematic properties given some time span, calculated by Euler's method.
     * @param {SimEnvironment} environment Source of environmental variables such as gravity, electric field, etc.
     * @param {number} dt The time change that the movement occurs, more accurate the smaller the value is
     */
    eulerMove(environment, dt) {
        var _b, _c, _d, _e, _f, _g;
        const g_vec = (_c = (_b = environment.statics) === null || _b === void 0 ? void 0 : _b.gravity) !== null && _c !== void 0 ? _c : new Vector2D();
        // const dragOverMass = environment.statics!.drag! / this.mass;
        // const drag_force = this.velocity.scalarMultiply(-dragOverMass);
        // const new_acceleration = gravity.add(drag_force);
        const e_field = (_e = (_d = environment.statics) === null || _d === void 0 ? void 0 : _d.electric_field) !== null && _e !== void 0 ? _e : new Vector2D();
        const b_field = (_g = (_f = environment.statics) === null || _f === void 0 ? void 0 : _f.magnetic_field) !== null && _g !== void 0 ? _g : 0;
        // biot-savart and coulombs not included here (too computationally expensive)
        // F_g = m * g, F_e = E * q, F_b = q * v x b
        // m * a = F_g + F_e + F_b
        // a = (F_g + F_e + F_b) / m
        const f_g = g_vec.scalarMultiply(this.mass);
        const f_e = e_field.scalarMultiply(this.charge);
        const f_b = this.velocity.crossProduct(b_field).scalarMultiply(this.charge);
        const new_acceleration = f_g.add(f_e).add(f_b).scalarMultiply(1 / this.mass);
        this.position = this.position.add(this.velocity.scalarMultiply(dt));
        this.velocity = this.velocity.add(new_acceleration.scalarMultiply(dt));
        __classPrivateFieldGet(this, _Particle_observers, "f").notify(ParticleEvent.Update, undefined);
        __classPrivateFieldGet(this, _Particle_observers, "f").notify(ParticleEvent.Move, undefined);
    }
    /**
     * "Moves" or changes the particle's kinematic properties given some time span, calculated by the 4th Order Runge-Kutta method.
     * @param {SimEnvironment} environment Source of environmental variables such as gravity, electric field, etc.
     * @param {number} dt The time change that the movement occurs, more accurate the smaller the value is
     */
    rungekuttaMove(environment, dt) {
        var _b, _c, _d, _e, _f, _g;
        const g_vec = (_c = (_b = environment.statics) === null || _b === void 0 ? void 0 : _b.gravity) !== null && _c !== void 0 ? _c : new Vector2D();
        // const dragOverMass = environment.statics!.drag! / this.mass;
        // const drag_force = this.velocity.scalarMultiply(-dragOverMass);
        // const new_acceleration = gravity.add(drag_force);
        const e_field = (_e = (_d = environment.statics) === null || _d === void 0 ? void 0 : _d.electric_field) !== null && _e !== void 0 ? _e : new Vector2D();
        const b_field = (_g = (_f = environment.statics) === null || _f === void 0 ? void 0 : _f.magnetic_field) !== null && _g !== void 0 ? _g : 0;
        const f_g = g_vec.scalarMultiply(this.mass);
        const f_e = e_field.scalarMultiply(this.charge);
        const new_acceleration = (vel) => {
            const f_b = vel.crossProduct(b_field).scalarMultiply(this.charge);
            return f_g.add(f_e).add(f_b).scalarMultiply(1 / this.mass);
        };
        const k1_velocity = this.velocity;
        const k1_acceleration = new_acceleration(k1_velocity);
        const k2_velocity = this.velocity.add(k1_acceleration.scalarMultiply(0.5 * dt));
        const k2_acceleration = new_acceleration(k2_velocity);
        const k3_velocity = this.velocity.add(k2_acceleration.scalarMultiply(0.5 * dt));
        const k3_acceleration = new_acceleration(k3_velocity);
        const k4_velocity = this.velocity.add(k3_acceleration.scalarMultiply(dt));
        const k4_acceleration = new_acceleration(k4_velocity);
        this.position = this.position.add(k1_velocity.add(k2_velocity.scalarMultiply(2))
            .add(k3_velocity.scalarMultiply(2))
            .add(k4_velocity)
            .scalarMultiply(dt / 6));
        this.velocity = this.velocity.add(k1_acceleration.add(k2_acceleration.scalarMultiply(2))
            .add(k3_acceleration.scalarMultiply(2))
            .add(k4_acceleration)
            .scalarMultiply(dt / 6));
        __classPrivateFieldGet(this, _Particle_observers, "f").notify(ParticleEvent.Update, undefined);
        __classPrivateFieldGet(this, _Particle_observers, "f").notify(ParticleEvent.Move, undefined);
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
    is_highlighted() {
        return __classPrivateFieldGet(this, _Particle_is_highlighted, "f");
    }
    highlight(value = true) {
        __classPrivateFieldSet(this, _Particle_is_highlighted, value, "f");
        // this.#observers.notify(ParticleEvent.Update, undefined);
        __classPrivateFieldGet(this, _Particle_observers, "f").notify(ParticleEvent.Highlight, undefined);
    }
}
_a = Particle, _Particle_observers = new WeakMap(), _Particle_id = new WeakMap(), _Particle_group_id = new WeakMap(), _Particle_is_highlighted = new WeakMap();
_Particle_instance_count = { value: 0 };
