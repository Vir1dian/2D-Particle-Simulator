"use strict";
const container = {
    x_min: -250,
    x_max: 250,
    y_min: -250,
    y_max: 250
};
const simulation_settings = {
    num_particles: 100,
    position: 'random',
    velocity: 'random',
    acceleration: new Vector2D(0, 0),
    // oscillation: 0,
    radius: 3,
    mass: 1,
    elasticity: 1 // Used during animation, not at Particle instantiation
};
