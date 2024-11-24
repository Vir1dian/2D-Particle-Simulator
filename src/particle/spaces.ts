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
  velocity: new Vector2D(-20,20),
  acceleration: new Vector2D(0.001,-0.001),  // -0.098 for gravity
  radius: 'random',
  mass: 1,
  elasticity: 0.5
}