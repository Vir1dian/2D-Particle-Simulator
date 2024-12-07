"use strict";
const container = {
    x_min: -250,
    x_max: 250,
    y_min: -250,
    y_max: 250
};
const simulation_settings = {
    particle: [{
            num_particles: 25,
            position: 'random',
            velocity: 'random',
            acceleration: new Vector2D(0, 0),
            oscillation: new Vector2D(),
            radius: 8,
            mass: 1,
            color: 'black'
        }],
    environment: {
        elasticity: 1,
        drag: 0,
        acceleration: new Vector2D()
    }
};
const presets = {
    sandbox: {
        particle: [{
                num_particles: 25,
                position: 'random',
                velocity: 'random',
                acceleration: new Vector2D(0, 0),
                oscillation: new Vector2D(),
                radius: 8,
                mass: 1,
                color: 'black',
            }],
        environment: {
            elasticity: 0.75,
            drag: 0,
            acceleration: new Vector2D(),
        },
    },
    projmotion: {
        particle: [{
                num_particles: 1,
                position: new Vector2D(-200, 100),
                velocity: new Vector2D(2, 0),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 8,
                mass: 1,
                color: 'blue',
            }],
        environment: {
            elasticity: 1,
            drag: 2,
            acceleration: new Vector2D(0, -0.098),
        },
    },
    snowglobe: {
        particle: [{
                num_particles: 50,
                position: 'random',
                velocity: new Vector2D(),
                acceleration: new Vector2D(0, -0.0098),
                oscillation: new Vector2D(),
                radius: 5,
                mass: 1,
                color: 'white',
            }],
        environment: {
            elasticity: 0.1,
            drag: 1,
            acceleration: new Vector2D(),
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
                radius: 8,
                mass: 1,
                color: 'gray',
            },
            {
                num_particles: 1,
                position: new Vector2D(-200, -200),
                velocity: new Vector2D(3, 3),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 20,
                mass: 10000,
                color: 'red',
            }
        ],
        environment: {
            elasticity: 0.6,
            drag: 1,
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
            },
            {
                num_particles: 5,
                position: new Vector2D(-200, 200),
                velocity: new Vector2D(0.5, -0.5),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 15,
                mass: 4,
                color: 'red',
            },
            {
                num_particles: 5,
                position: new Vector2D(200, 200),
                velocity: new Vector2D(-0.75, -0.75),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 15,
                mass: 3,
                color: 'blue',
            },
            {
                num_particles: 5,
                position: new Vector2D(-200, -200),
                velocity: new Vector2D(1, 1),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 15,
                mass: 2,
                color: 'orange',
            },
            {
                num_particles: 5,
                position: new Vector2D(200, -200),
                velocity: new Vector2D(-1.25, 1.25),
                acceleration: new Vector2D(),
                oscillation: new Vector2D(),
                radius: 15,
                mass: 1,
                color: 'green',
            }
        ],
        environment: {
            elasticity: 0.6,
            drag: 1,
            acceleration: new Vector2D(),
        },
    }
};
