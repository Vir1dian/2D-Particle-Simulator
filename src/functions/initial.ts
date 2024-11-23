
function setContainer(container) {
  const wrapper = document.querySelector('.wrapper_visual');

  const visual_container = document.createElement('div');
  visual_container.classList.add('visual_container');
  visual_container.style.width = `${container.x_max - container.x_min}px`;
  visual_container.style.height = `${container.y_max - container.y_min}px`;
  wrapper.appendChild(visual_container);
}

function setParticle(particle, container) {  // for single particle model (starting the concept)
  const visual_container = document.querySelector('.visual_container');

  const visual_particle = document.createElement('div');
  visual_particle.classList.add('visual_particle');

  // radius
  visual_particle.style.borderRadius = `${particle.radius}px`;
  visual_particle.style.width = `${2*particle.radius}px`;
  visual_particle.style.height = `${2*particle.radius}px`;

  // positioning
  visual_particle.style.left = `${(particle.position[0] - particle.radius) - container.x_min}px`;
  visual_particle.style.top = `${container.y_max - (particle_a.position[1] + particle_a.radius)}px`;
  
  // update inputs
  const x_input = document.querySelector('#set_x');
  const y_input = document.querySelector('#set_y');
  x_input.value = particle.position[0];
  y_input.value = particle.position[1];

  visual_container.appendChild(visual_particle);
}

/* 
TODO:
updateParticleManual does not use parameters properly yet, since its called from the html file,
consider using eventlisteners in the future for when multiple particles are being controlled
*/

function updateParticleManual() {  
  const x_input = document.querySelector('#set_x');
  const y_input = document.querySelector('#set_y');

  // Validate user inputs to stay within container bounds, while also parsing input values as ints to avoid unexpected behaviors
  const newX = Math.min(Math.max(parseInt(x_input.value, 10), container.x_min), container.x_max);
  const newY = Math.min(Math.max(parseInt(y_input.value, 10), container.y_min), container.y_max);

  // Update object values
  particle_a.position[0] = newX;
  particle_a.position[1] = newY;

  // Show validation of user inputs in the input fields as well
  x_input.value = newX;
  y_input.value = newY;

  const visual_particle = document.querySelector('.visual_particle');
  visual_particle.style.left = `${(particle_a.position[0] - particle_a.radius) - container.x_min}px`;
  visual_particle.style.top = `${container.y_max - (particle_a.position[1] + particle_a.radius)}px`;
}

// export default {
//   setContainer, 
//   setParticle, 
//   updateParticleManual
// };