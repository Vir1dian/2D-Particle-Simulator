interface KinematicData {
  position: Vector2D;
  velocity: Vector2D;
}

/**
 * Things to double check: does it handle negative direction? how about when the projectile is turning directions during the calculation?
 */
const Kinematics = {
  velocity(v0: number, a: number, t:number, t0:number = 0): number {
    return a*(t - t0) + v0;
  },
  position(s0: number, v0: number, a: number, t:number, t0:number = 0): number {
    return (1/2)*a*Math.pow(t - t0, 2) + v0*(t - t0) + s0;
  },
  time(s0: number, s: number, v0: number, a: number, t0:number = 0): number {
    if (a === 0) {
      if (v0 === 0) {
        if (s0 === s) return t0;
        return Infinity;
      }
      return t0 + (s - s0)/v0;
    }
    const discriminant = Math.pow(v0, 2) - 2*a*(s0 - s);
    if (discriminant < 0) {
      return Infinity;
    }
    const root1 = (-v0 + Math.sqrt(discriminant)) / a;
    const root2 = (-v0 - Math.sqrt(discriminant)) / a;

    if (root1 > 0 && root2 > 0) {
      return t0 + Math.min(root1, root2);  // Returns the earlier new time if the projectile ends up in the same location for both
    }
    if (root1 > 0) {
      return t0 + root1;
    }
    if (root2 > 0) {
      return t0 + root2;
    }
    return Infinity;
  }
}

const PredictParticle = {
  noDrag(particle: Particle, t0:number, t:number): KinematicData {
    const a: Vector2D = simulation_settings.environment.acceleration.add(particle.acceleration);
    const new_position: Vector2D = new Vector2D(
      Kinematics.position(particle.position.x, particle.velocity.x, a.x, t, t0),
      Kinematics.position(particle.position.y, particle.velocity.y, a.y, t, t0)
    );
    const new_velocity: Vector2D = new Vector2D(
      Kinematics.velocity(particle.velocity.x, a.x, t, t0),
      Kinematics.velocity(particle.velocity.y, a.y, t, t0)
    );
    return {position: new_position, velocity: new_velocity};
  },

  constantDrag(particle: Particle, t0:number, cont: BoxSpace = container): KinematicData {
    
    return {position: new Vector2D(), velocity: new Vector2D()};
  }
}

/**
 * Returns the time of collision with a static object (i.e. container walls)
 */
const PredictCollision = {
  noDrag(particle: Particle, t0:number, cont: BoxSpace = container): number {
    const a: Vector2D = simulation_settings.environment.acceleration.add(particle.acceleration);
    const collision_left = Kinematics.time(particle.position.x, cont.x_min, particle.velocity.x, a.x, t0);
    const collision_right = Kinematics.time(particle.position.x, cont.x_max, particle.velocity.x, a.x, t0);
    const collision_bottom = Kinematics.time(particle.position.y, cont.y_min, particle.velocity.y, a.y, t0);
    const collision_top = Kinematics.time(particle.position.y, cont.y_max, particle.velocity.y, a.y, t0);
    const collision_times: number[] = [collision_left, collision_right, collision_bottom, collision_top];
    const valid_collision_time = collision_times.filter(time => time > t0 && isFinite(time));
    if (valid_collision_time.length === 0) {
      return Infinity;
    }
    return Math.min(...valid_collision_time);
  },
  constantDrag(particle: Particle, t0:number, cont: BoxSpace = container): number {
    return 0;
  }
}


// No Drag
// F = ma
// m*(dv/dt) = m*g
// dv/dt = g <-- particle acceleration is external acceleration
// ∫dv/dt = ∫(g)dt
// v = g*t + C_v
// C_v = v_0 - g*t_0
// v = g*t + v_0 - g*t_0 = g*(t - t_0) + v_0
// ∫(v)dt = ∫(g*(t - t_0) + v_0)dt
// s = (1/2)*g*(t - t_0)^2 + v_0*t + C_s
// C_s = s_0 - (1/2)*g*(t_0 - t_0)^2 - v_0*t_0 = s_0 - v_0*t_0
// s = (1/2)*g*(t - t_0)^2 + v_0*t + s_0 - v_0*t_0
// s = (1/2)*g*(t - t_0)^2 + v_0*(t - t_0) + s_0  <-- u = t - t_0
// 0 = (1/2)*g*(u)^2  + v_0*(u) + (s_0 - s)
// u = (-v_0 +- sqrt(v_0^2 - 2*g*(s_0 - s)))/g
// t = u + t_0

// Constant Drag
// F = m*g - b*v  where m is particle mass, g is external acceleration, b is constant drag force, and v is velocity
// m*(dv/dt) = m*g - b*v
// m*(dv/dt) + b*v = m*g
// dv/dt + b*v/m = g  --> μ(t) = e^∫(b/m)dt = e^(b*t/m)
// (dv/dt)*e^(b*t/m) + (b*v/m)e^(b*t/m) = g*e^(b*t/m)
// ∫(d/dt)(v*e^(b*t/m)) = ∫(g*e^(b*t/m))dt
// v*e^(bt/m) = (m/b)*g*e^(b*t/m) + C
// v = (m/b)*g + C_v*e^(-b*t/m)
// C_v = (v_0 - (m/b)*g)*e^(b*t_0/m)

// s = ∫(v)dt
// s = (m/b)*g*t + (-m/b)*C_v*e^(-b*t/m) + C_s
// C_s = s_0 - (m/b)*g*t_0 - (-m/b)*C_v*e^(-b*t_0/m)
// s = (m/b)*g*t + (-m/b)*(v_0 - (m/b)*g)*e^(b*t_0/m)*e^(-b*t/m) + s_0 - (m/b)*g*t_0 - (-m/b)*(v_0 - (m/b)*g)*e^(b*t_0/m)*e^(-b*t_0/m)
// s = (m/b)*g*(t - t_0) + (-m/b)*(v_0 - (m/b)*g)*e^(b*(t_0 - t)/m) + s_0 + (m/b)*(v_0 - (m/b)*g)

// s = (m/b)*g*(t - t_0) + (m/b)*(v_0 - (m/b)*g)*(1 - e^(b*(t_0 - t)/m)) + s_0
// t = ?