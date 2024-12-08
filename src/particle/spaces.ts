interface BoxSpace {
  x_min: number,
  x_max: number,
  y_min: number,
  y_max: number
} 

interface SimulationSettings {
  particle: {
    num_particles: number | 'random',
    position: Vector2D | 'random',
    velocity: Vector2D | 'random',
    acceleration: Vector2D | 'random',
    oscillation: Vector2D | 'random',
    radius: number | 'random',
    mass: number | 'random',
    color: string | 'random',
  } [],
  environment: {
    elasticity: number,
    drag: number,
    acceleration: Vector2D
  }
}

const container: BoxSpace = {
  x_min: -250,
  x_max: 250,
  y_min: -250,
  y_max: 250
}

const simulation_settings: SimulationSettings = {
  particle: [{
    num_particles: 25,
    position: 'random',
    velocity: 'random',
    acceleration: new Vector2D(0,0),  // -0.098 for gravity
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
}

const presets: Record<string, SimulationSettings> = {
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
      elasticity: 1,
      drag: 0,
      acceleration: new Vector2D(),
    },
  },
  projmotion: {
    particle: [{
      num_particles: 1,
      position: new Vector2D(-200, -200),
      velocity: new Vector2D(100, 300),
      acceleration: new Vector2D(),
      oscillation: new Vector2D(),
      radius: 8,
      mass: 1,
      color: 'blue',
    }],
    environment: {
      elasticity: 1,
      drag: 0.1,
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
      },
      {
        num_particles: 1,
        position: new Vector2D(-200,-200),
        velocity: new Vector2D(200,200),
        acceleration: new Vector2D(),
        oscillation: new Vector2D(),
        radius: 20,
        mass: 10000,
        color: 'red',
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
      },
      {
        num_particles: 5,
        position: new Vector2D(-200,200),
        velocity: new Vector2D(200,-200),
        acceleration: new Vector2D(),
        oscillation: new Vector2D(),
        radius: 15,
        mass: 4,
        color: 'red',
      },
      {
        num_particles: 5,
        position: new Vector2D(200,200),
        velocity: new Vector2D(-200,-200),
        acceleration: new Vector2D(),
        oscillation: new Vector2D(),
        radius: 15,
        mass: 3,
        color: 'blue',
      },
      {
        num_particles: 5,
        position: new Vector2D(-200,-200),
        velocity: new Vector2D(200,200),
        acceleration: new Vector2D(),
        oscillation: new Vector2D(),
        radius: 15,
        mass: 2,
        color: 'orange',
      },
      {
        num_particles: 5,
        position: new Vector2D(200,-200),
        velocity: new Vector2D(-200,200),
        acceleration: new Vector2D(),
        oscillation: new Vector2D(),
        radius: 15,
        mass: 1,
        color: 'green',
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
    }],
    environment: {
      elasticity: 0.75,
      drag: 0,
      acceleration: new Vector2D(),
    },
  }
};