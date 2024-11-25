interface BoxSpace {
  x_min: number,
  x_max: number,
  y_min: number,
  y_max: number
} 

interface SimulationSettings {
  num_particles: number | 'random',
  position: Vector2D | 'random',
  velocity: Vector2D | 'random',
  acceleration: Vector2D | 'random',
  // oscillation: 0,
  radius: number | 'random',
  mass: number | 'random',
  elasticity: number
}

const container: BoxSpace = {
  x_min: -250,
  x_max: 250,
  y_min: -250,
  y_max: 250
}

const simulation_settings: SimulationSettings = {
  num_particles: 100,
  position: 'random',
  velocity: 'random',
  acceleration: new Vector2D(0,0),  // -0.098 for gravity
  // oscillation: 0,
  radius: 3,
  mass: 1,
  elasticity: 1  // Used during animation, not at Particle instantiation
}