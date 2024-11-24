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
    velocity: new Vector2D(-20, 20),
    acceleration: new Vector2D(0.001, -0.001),
    radius: 'random',
    mass: 1,
    elasticity: 0.5
};
