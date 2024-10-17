
let start;
let particle_movement;
let progress;

let isRunning = false;

function setRandomVelocity() {
  let max = 3;
  particle_a.velocity[0] = Math.floor(-max + Math.random() * 2 * max);
  particle_a.velocity[1] = Math.floor(-max + Math.random() * 2 * max);
}

function step(timestamp) {
  start = timestamp;

  if (particle_a.position[0] + particle_a.radius > container.x_max || particle_a.position[0] - particle_a.radius < container.x_min) {  // collision with left and right
    particle_a.velocity[0] = -particle_a.velocity[0];
  }
  if (particle_a.position[1] + particle_a.radius > container.x_max || particle_a.position[1] - particle_a.radius < container.x_min) {  // collision with top and bottom
    particle_a.velocity[1] = -particle_a.velocity[1];
  }
  particle_a.position[0] += particle_a.velocity[0];
  particle_a.position[1] += particle_a.velocity[1];

  const visual_particle = document.querySelector('.visual_particle');
  visual_particle.style.left = `${(particle_a.position[0] - particle_a.radius) - container.x_min}px`;
  visual_particle.style.top = `${container.y_max - (particle_a.position[1] + particle_a.radius)}px`;

  const x_input = document.querySelector('#set_x');
  const y_input = document.querySelector('#set_y');

  const show_x = particle_a.position[0];
  const show_y = particle_a.position[1];

  x_input.value = Math.floor(particle_a.position[0] / 10) * 10;
  y_input.value = Math.floor(particle_a.position[1] / 10) * 10;

  particle_movement = window.requestAnimationFrame(step);
}

function runSimulation() {
  if (!isRunning) {
    setRandomVelocity()

    isRunning = true;
    window.requestAnimationFrame(step);
  } else {
    isRunning = false;
    cancelAnimationFrame(stopID);
  }
}