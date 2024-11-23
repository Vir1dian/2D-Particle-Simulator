const container = {
  x_min: -250,
  x_max: 250,
  y_min: -250,
  y_max: 250
}

/**
 * TODO: Implement multple particles
 */
const particle_a = {
  position: [0,0], 
  velocity: [1,1],
  acceleration: [0,-0.098],
  radius: 5
}

setContainer(container)
setParticle(particle_a, container);