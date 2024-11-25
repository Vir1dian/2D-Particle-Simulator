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
  oscillation: Vector2D | 'random',
  radius: number | 'random',
  mass: number | 'random',
  color: string | 'random',
  elasticity: number
}

const container: BoxSpace = {
  x_min: -250,
  x_max: 250,
  y_min: -250,
  y_max: 250
}

const simulation_settings: SimulationSettings = {
  num_particles: 25,
  position: 'random',
  velocity: 'random',
  acceleration: new Vector2D(0,0),  // -0.098 for gravity
  oscillation: new Vector2D(),
  radius: 8,
  mass: 1,
  color: 'black',
  elasticity: 1  // Used during animation, not at Particle instantiation
}