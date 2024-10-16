const container = {
  x_min: -250,
  x_max: 250,
  y_min: -250,
  y_max: 250
}

const particle_a = {
  position: [0,0], 
  velocity: [0,0],
  acceleration: [0,0],
  radius: 5
}

setContainer(container)
setParticle(particle_a, container);