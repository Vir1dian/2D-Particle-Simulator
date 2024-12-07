"use strict";
const container = {
    x_min: -250,
    x_max: 250,
    y_min: -250,
    y_max: 250
};
const simulation_settings = {
    particle: {
        num_particles: 25,
        position: 'random',
        velocity: 'random',
        acceleration: new Vector2D(0, 0),
        oscillation: new Vector2D(),
        radius: 8,
        mass: 1,
        color: 'black'
    },
    environment: {
        elasticity: 1,
        drag: 0,
        acceleration: new Vector2D()
    }
};
