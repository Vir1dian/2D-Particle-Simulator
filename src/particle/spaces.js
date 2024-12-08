"use strict";
const container = {
    x_min: -250,
    x_max: 250,
    y_min: -250,
    y_max: 250
};
const simulation_settings = {
    particle: [{
            num_particles: 0,
            position: 'random',
            velocity: 'random',
            acceleration: new Vector2D(),
            oscillation: new Vector2D(),
            radius: 8,
            mass: 1,
            color: 'black',
            trajectory: false
        }],
    environment: {
        elasticity: 1,
        drag: 0,
        acceleration: new Vector2D(),
    },
};
let current_preset;
const presets = {
    empty: {
        particle: [{
                num_particles: 0,
                position: 'random',
                velocity: 'random',
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 8,
                mass: 1,
                color: 'black',
                trajectory: false
            }],
        environment: {
            elasticity: 1,
            drag: 0,
            acceleration: new Vector2D(),
        },
    },
    sandbox: {
        particle: [{
                num_particles: 10,
                position: 'random',
                velocity: 'random',
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 'random',
                mass: 'random',
                color: 'random',
                trajectory: false
            }],
        environment: {
            elasticity: 1,
            drag: 0,
            acceleration: new Vector2D(),
        },
    },
    projdrag: {
        particle: [{
                num_particles: 1,
                position: new Vector2D(-200, -200),
                velocity: new Vector2D(100, 300),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 8,
                mass: 1,
                color: 'blue',
                trajectory: true
            }],
        environment: {
            elasticity: 1,
            drag: 0.1,
            acceleration: new Vector2D(0, -98),
        },
    },
    projnodrag: {
        particle: [{
                num_particles: 1,
                position: new Vector2D(-200, -200),
                velocity: new Vector2D(100, 200),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 8,
                mass: 1,
                color: 'green',
                trajectory: true
            }],
        environment: {
            elasticity: 1,
            drag: 0,
            acceleration: new Vector2D(0, -98),
        },
    },
    snowglobe: {
        particle: [{
                num_particles: 50,
                position: 'random',
                velocity: new Vector2D(),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 5,
                mass: 1,
                color: 'white',
                trajectory: false
            }],
        environment: {
            elasticity: 0.1,
            drag: 0.01,
            acceleration: new Vector2D(0, -98),
        },
    },
    bulldozer: {
        particle: [
            {
                num_particles: 50,
                position: 'random',
                velocity: new Vector2D(),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 12,
                mass: 1,
                color: 'gray',
                trajectory: false
            },
            {
                num_particles: 1,
                position: new Vector2D(-200, -200),
                velocity: new Vector2D(200, 200),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 20,
                mass: 10000,
                color: 'red',
                trajectory: false
            }
        ],
        environment: {
            elasticity: 0.6,
            drag: 0,
            acceleration: new Vector2D(),
        },
    },
    rbyg: {
        particle: [
            {
                num_particles: 20,
                position: 'random',
                velocity: new Vector2D(),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 8,
                mass: 1,
                color: 'gray',
                trajectory: false
            },
            {
                num_particles: 5,
                position: new Vector2D(-200, 200),
                velocity: new Vector2D(200, -200),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 15,
                mass: 4,
                color: 'red',
                trajectory: false
            },
            {
                num_particles: 5,
                position: new Vector2D(200, 200),
                velocity: new Vector2D(-200, -200),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 15,
                mass: 3,
                color: 'blue',
                trajectory: false
            },
            {
                num_particles: 5,
                position: new Vector2D(-200, -200),
                velocity: new Vector2D(200, 200),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 15,
                mass: 2,
                color: 'orange',
                trajectory: false
            },
            {
                num_particles: 5,
                position: new Vector2D(200, -200),
                velocity: new Vector2D(-200, 200),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 15,
                mass: 1,
                color: 'green',
                trajectory: false
            }
        ],
        environment: {
            elasticity: 0.6,
            drag: 0.01,
            acceleration: new Vector2D(),
        },
    },
    elastic_highdrag: {
        particle: [{
                num_particles: 25,
                position: 'random',
                velocity: 'random',
                acceleration: new Vector2D(0, 0),
                oscillation: new Vector2D(),
                radius: 8,
                mass: 1,
                color: 'green',
                trajectory: false
            }],
        environment: {
            elasticity: 1,
            drag: 0.25,
            acceleration: new Vector2D(),
        },
    },
    nodrag_lowelasticity: {
        particle: [{
                num_particles: 25,
                position: 'random',
                velocity: 'random',
                acceleration: new Vector2D(0, 0),
                oscillation: new Vector2D(),
                radius: 8,
                mass: 1,
                color: 'purple',
                trajectory: false
            }],
        environment: {
            elasticity: 0.75,
            drag: 0,
            acceleration: new Vector2D(),
        },
    }
};
