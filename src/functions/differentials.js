"use strict";
/**
 * Things to double check: does it handle negative direction? how about when the projectile is turning directions during the calculation?
 */
const Kinematics = {
    velocity(v0, a, t, t0 = 0) {
        // v = g*t + v_0 - g*t_0 = g*(t - t_0) + v_0
        return a * (t - t0) + v0;
    },
    position(s0, v0, a, t, t0 = 0) {
        // s = (1/2)*g*(t - t_0)^2 + v_0*(t - t_0) + s_0
        return (1 / 2) * a * Math.pow(t - t0, 2) + v0 * (t - t0) + s0;
    },
    time(s0, s, v0, a, t0 = 0) {
        // u = (-v_0 +- sqrt(v_0^2 - 2*g*(s_0 - s)))/g
        // t = u + t_0
        if (a === 0) {
            if (v0 === 0) {
                if (s0 === s)
                    return t0;
                return Infinity;
            }
            // t = t_0 + (s - s_0)/v_0
            return t0 + (s - s0) / v0;
        }
        const discriminant = Math.pow(v0, 2) - 2 * a * (s0 - s);
        if (discriminant < 0) {
            return Infinity;
        }
        const root1 = (-v0 + Math.sqrt(discriminant)) / a;
        const root2 = (-v0 - Math.sqrt(discriminant)) / a;
        if (root1 > 0 && root2 > 0) {
            return t0 + Math.min(root1, root2); // Returns the earlier new time if the projectile ends up in the same location for both
        }
        if (root1 > 0) {
            return t0 + root1;
        }
        if (root2 > 0) {
            return t0 + root2;
        }
        return Infinity;
    }
};
const Dynamics = {
    drag: {
        acceleration(v, a, m, b) {
            // a = g - b*v/m
            return a - (b * v) / m;
        },
        velocity(v0, a, m, b, t, t0 = 0) {
            // v = (m/b)*g + (v_0 - (m/b)*g)*e^(b*(t_0 - t)/m)
            const term = (m / b) * a;
            const exponent = Math.exp(-(b / m) * (t - t0));
            return term + (v0 - term) * exponent;
        },
        position(s0, v0, a, m, b, t, t0 = 0) {
            // s = (m/b)*g*(t - t_0) + (m/b)*(v_0 - (m/b)*g)*(1 - e^(b*(t_0 - t)/m)) + s_0
            const term1 = (m / b) * a;
            const exponent = Math.exp(-(b / m) * (t - t0));
            const term2 = (v0 - term1) * (1 - exponent);
            return term1 * (t - t0) + (m / b) * term2 + s0;
        },
        time(s0, s, v0, a, m, b, t0 = 0, max_iterations = 10, tolerance_digit = 6, t_init = t0 + 0.1) {
            const tolerance = Math.pow(10, -tolerance_digit);
            // Handling edge cases
            if (!b) {
                return Kinematics.time(s0, s, v0, a, t0);
            }
            else if (b < 0) {
                throw new Error(`Invalid drag coefficient. b=${b}`);
            }
            if (m <= 0) {
                throw new Error(`Invalid particle mass. m=${m}`);
            }
            if (a === 0) {
                // Check if not in motion
                if (v0 === 0) {
                    if (s0 === s)
                        return t0;
                    return Infinity;
                }
                // Check if target position is reachable
                // t = t_0 - (m/b)*ln( 1 - (b/m)*(s - s_0)/v_0 ) for no acceleration, nonzero velocity
                // where 1 - (b/m)*(s - s_0)/v_0 > 0
                const ln_argument = 1 - (b / m) * (s - s0) / v0;
                if (ln_argument <= 0) {
                    return Infinity;
                }
                return t0 - (m / b) * Math.log(ln_argument);
            }
            // s = (m/b)*g*(t - t_0) + (m/b)*(v_0 - (m/b)*g)*(1 - e^(b*(t_0 - t)/m)) + s_0
            // Solve t from s(t) = s using Newton-Raphson
            // t = t_n - (s(t_n) - s(t))/v(t_n)
            let tn = t_init;
            for (let i = 0; i < max_iterations; i++) {
                const sn = this.position(s0, v0, a, m, b, tn, t0); // s(t_n)
                const snPrime = this.velocity(v0, a, m, b, tn, t0); // s'(t_n)
                const t_n1 = tn - (sn - s) / snPrime;
                // Check if diverged enough
                if (Math.abs(snPrime) < tolerance) {
                    // console.error(`Divergence in Newton\'s method: Iteration=${i}, s0=${s0}, s=${s}, v0=${v0}, a=${a}, m=${m}, b=${b}, t0=${t0}.`)
                    return Infinity;
                }
                // Check if converged enough
                if (Math.abs(t_n1 - tn) < tolerance) {
                    return t_n1;
                }
                tn = t_n1;
            }
            // console.error(`No convergence in Newton\'s method: s0=${s0}, s=${s}, v0=${v0}, a=${a}, m=${m}, b=${b}, t0=${t0}.`)
            return Infinity;
        }
    },
    simple_harmonics: {},
    electromagnetism: {},
    planetary: {},
    rocketry: {}
};
const PredictParticle = {
    noDrag(particle, t0, t) {
        const a = simulation_settings.environment.acceleration.add(particle.acceleration);
        const new_position = new Vector2D(Kinematics.position(particle.position.x, particle.velocity.x, a.x, t, t0), Kinematics.position(particle.position.y, particle.velocity.y, a.y, t, t0));
        const new_velocity = new Vector2D(Kinematics.velocity(particle.velocity.x, a.x, t, t0), Kinematics.velocity(particle.velocity.y, a.y, t, t0));
        return { position: new_position, velocity: new_velocity };
    },
    constantDrag(particle, t0, t) {
        const b = simulation_settings.environment.drag;
        if (!b) {
            return this.noDrag(particle, t0, t);
        }
        else if (b < 0) {
            throw new Error(`Invalid drag coefficient. b=${b}`);
        }
        const m = particle.mass;
        if (m <= 0) {
            throw new Error(`Invalid particle mass. m=${m} particle_id=${particle.id}`);
        }
        const a = simulation_settings.environment.acceleration.add(particle.acceleration);
        const new_position = new Vector2D(Dynamics.drag.position(particle.position.x, particle.velocity.x, a.x, m, b, t, t0), Dynamics.drag.position(particle.position.y, particle.velocity.y, a.y, m, b, t, t0));
        const new_velocity = new Vector2D(Dynamics.drag.velocity(particle.velocity.x, a.x, m, b, t, t0), Dynamics.drag.velocity(particle.velocity.y, a.y, m, b, t, t0));
        return { position: new_position, velocity: new_velocity };
    }
};
/**
 * Returns the time of collision with a static object (i.e. container walls)
 */
const PredictCollision = {
    noDrag(particle, t0, cont = container) {
        const a = simulation_settings.environment.acceleration.add(particle.acceleration);
        const collision_left = Kinematics.time(particle.position.x, cont.x_min, particle.velocity.x, a.x, t0);
        const collision_right = Kinematics.time(particle.position.x, cont.x_max, particle.velocity.x, a.x, t0);
        const collision_bottom = Kinematics.time(particle.position.y, cont.y_min, particle.velocity.y, a.y, t0);
        const collision_top = Kinematics.time(particle.position.y, cont.y_max, particle.velocity.y, a.y, t0);
        const collision_times = [collision_left, collision_right, collision_bottom, collision_top];
        const valid_collision_time = collision_times.filter(time => time > t0 && isFinite(time));
        if (valid_collision_time.length === 0) {
            console.error(`No valid collision time. particle_id=${particle.id}, t0=${t0}`);
            return Infinity;
        }
        return Math.min(...valid_collision_time);
    },
    constantDrag(particle, t0, cont = container) {
        const b = simulation_settings.environment.drag;
        if (!b) {
            return this.noDrag(particle, t0, cont);
        }
        else if (b < 0) {
            throw new Error(`Invalid drag coefficient. b=${b}`);
        }
        const m = particle.mass;
        if (m <= 0) {
            throw new Error(`Invalid particle mass. m=${m} particle_id=${particle.id}`);
        }
        const a = simulation_settings.environment.acceleration.add(particle.acceleration);
        const collision_left = Dynamics.drag.time(particle.position.x, cont.x_min, particle.velocity.x, a.x, m, b, t0);
        const collision_right = Dynamics.drag.time(particle.position.x, cont.x_max, particle.velocity.x, a.x, m, b, t0);
        const collision_bottom = Dynamics.drag.time(particle.position.y, cont.y_min, particle.velocity.y, a.y, m, b, t0);
        const collision_top = Dynamics.drag.time(particle.position.y, cont.y_max, particle.velocity.y, a.y, m, b, t0);
        // Filter out non-valid collision times (non-positive or infinite)
        const tolerance = 0;
        const collision_times = [collision_left, collision_right, collision_bottom, collision_top];
        const valid_collision_time = collision_times.filter(time => isFinite(time) && time + tolerance > t0 && time > 0);
        console.log(`Left - Time: ${collision_left}, t0: ${t0}, isValid: ${collision_left + tolerance > t0 && isFinite(collision_left)}`);
        console.log(`Right - Time: ${collision_right}, t0: ${t0}, isValid: ${collision_right + tolerance > t0 && isFinite(collision_right)}`);
        console.log(`Bottom - Time: ${collision_bottom}, t0: ${t0}, isValid: ${collision_bottom + tolerance > t0 && isFinite(collision_bottom)}`);
        console.log(`Top - Time: ${collision_top}, t0: ${t0}, isValid: ${collision_top + tolerance > t0 && isFinite(collision_top)}`);
        console.log(valid_collision_time);
        // If no valid collisions, return Infinity to indicate no collision
        if (valid_collision_time.length === 0) {
            console.error(`No valid collision time. particle_id=${particle.id}, t0=${t0}`);
            return Infinity;
        }
        return Math.min(...valid_collision_time) + tolerance;
    }
};
/* NO DRAG */
// Acceleration
// F = ma
// m*(dv/dt) = m*g
// dv/dt = g <-- particle acceleration is external acceleration
// Velocity
// ∫dv/dt = ∫(g)dt
// v = g*t + C_v
// C_v = v_0 - g*t_0
// v = g*t + v_0 - g*t_0 = g*(t - t_0) + v_0
// Position
// ∫(v)dt = ∫(g*(t - t_0) + v_0)dt
// s = (1/2)*g*(t - t_0)^2 + v_0*t + C_s
// C_s = s_0 - (1/2)*g*(t_0 - t_0)^2 - v_0*t_0 = s_0 - v_0*t_0
// s = (1/2)*g*(t - t_0)^2 + v_0*t + s_0 - v_0*t_0
// s = (1/2)*g*(t - t_0)^2 + v_0*(t - t_0) + s_0  <-- u = t - t_0
// Time
// 0 = (1/2)*g*(u)^2  + v_0*(u) + (s_0 - s)
// u = (-v_0 +- sqrt(v_0^2 - 2*g*(s_0 - s)))/g
// t = u + t_0
// Time: Case of zero acceleration, non-zero velocity
// s = v_0*(t - t_0) + s_0
// s - s_0 = v_0*(t - t_0)
// t - t_0 = (s - s_0)/v_0
// t = t_0 + (s - s_0)/v_0
// t = t_0 + (s - s_0)/v_0
/* CONSTANT DRAG */
// F = m*g - b*v  where m is particle mass, g is external acceleration, b is constant drag force, and v is velocity
// m*(dv/dt) = m*g - b*v
// m*(dv/dt) + b*v = m*g
// dv/dt + b*v/m = g
// a = g - b*v/m
// Velocity
// dv/dt + b*v/m = g  --> μ(t) = e^∫(b/m)dt = e^(b*t/m)
// (dv/dt)*e^(b*t/m) + (b*v/m)e^(b*t/m) = g*e^(b*t/m)
// ∫(d/dt)(v*e^(b*t/m)) = ∫(g*e^(b*t/m))dt
// v*e^(bt/m) = (m/b)*g*e^(b*t/m) + C_v
// v = (m/b)*g + C_v*e^(-b*t/m)
// C_v = (v_0 - (m/b)*g)*e^(b*t_0/m)
// v = (m/b)*g + (v_0 - (m/b)*g)*e^(b*t_0/m)*e^(-b*t/m)
// v = (m/b)*g + (v_0 - (m/b)*g)*e^(b*(t_0 - t)/m)
// Position
// s = ∫(v)dt
// s = (m/b)*g*t + (-m/b)*(v_0 - (m/b)*g)*e^(b*(t_0 - t)/m) + C_s
// C_s = s_0 - (m/b)*g*t_0 - (-m/b)*(v_0 - (m/b)*g)*e^(b*(t_0 - t)/m)
// s = (m/b)*g*t + (-m/b)*(v_0 - (m/b)*g)*e^(b*(t_0 - t)/m) + s_0 - (m/b)*g*t_0 - (-m/b)*(v_0 - (m/b)*g)*e^(b*(t_0 - t_0)/m)
// s = (m/b)*g*(t - t_0) + (-m/b)*(v_0 - (m/b)*g)*e^(b*(t_0 - t)/m) + s_0 + (m/b)*(v_0 - (m/b)*g)
// s = (m/b)*g*(t - t_0) + (m/b)*(v_0 - (m/b)*g)*(1 - e^(b*(t_0 - t)/m)) + s_0
// s(t) is transcendental, must use newton's method to solve for t
// Time
// Newton's Method with offset to s(t) instead of s(t) = 0
// s(t) = s(t_n) + v(t_n)*(t - t_n)
// s(t) - s(t_n) = v(t_n)*(t - t_n)
// t - t_n = (s(t) - s(t_n))/v(t_n)
// t = t_n + (s(t) - s(t_n))/v(t_n)
// Time: Case of zero acceleration, non-zero velocity
// s = (m/b)*g*(t - t_0) + (m/b)*(v_0 - (m/b)*g)*(1 - e^(b*(t_0 - t)/m)) + s_0
// s = (m/b)*v_0*(1 - e^(b*(t_0 - t)/m)) + s_0
// s - s_0 = (m/b)*v_0*(1 - e^(b*(t_0 - t)/m))
// (b/m)*(s - s_0)/v_0 = 1 - e^(b*(t_0 - t)/m)
// e^(b*(t_0 - t)/m) = 1 - (b/m)*(s - s_0)/v_0
// b*(t_0 - t)/m = ln( 1 - (b/m)*(s - s_0)/v_0 )
// t - t_0 = -(m/b)*ln( 1 - (b/m)*(s - s_0)/v_0 )
// t = t_0 - (m/b)*ln( 1 - (b/m)*(s - s_0)/v_0 )
// Extra note about ln() term
// 1 - (b/m)*(s - s_0)/v_0 > 0
// 1 > (b/m)*(s - s_0)/v_0
// v_0 > (b/m)*(s - s_0)
// (m/b)*v_0 > s - s_0
