"use strict";
const predictParticle = {
    noDrag(particle, dt, container) {
        // F = ma
        // m*(dv/dt) = m*g
        // dv/dt = g <-- particle acceleration is external acceleration
        // 
        return { position: 0, velocity: 0, time: 0 };
    },
    constantDrag(particle, dt, container) {
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
        return { position: 0, velocity: 0, time: 0 };
    }
};
function rungekutta() {
}
