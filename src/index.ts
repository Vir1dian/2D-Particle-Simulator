function loadContainerElement(container: BoxSpace) {
  const wrapper : HTMLElement | null = document.querySelector('.wrapper_visual');

  const container_element : HTMLElement = document.createElement('div');
  container_element.classList.add('container_element');
  container_element.style.width = `${container.x_max - container.x_min}px`;
  container_element.style.height = `${container.y_max - container.y_min}px`;
  wrapper?.appendChild(container_element);
}

function loadParticleElement(particle: Particle, container: BoxSpace) {  // for single particle model (starting the concept)
  const container_element : HTMLElement | null = document.querySelector('.container_element');

  const particle_element : HTMLElement = document.createElement('div');
  particle_element.classList.add('particle_element');
  particle_element.id = `particle_element_id${particle.id}`;

  // radius
  particle_element.style.borderRadius = `${particle.radius}px`;
  particle_element.style.width = `${2*particle.radius}px`;
  particle_element.style.height = `${2*particle.radius}px`;

  // positioning
  particle_element.style.left = `${(particle.position.x - particle.radius) - container.x_min}px`;
  particle_element.style.top = `${container.y_max - (particle.position.y + particle.radius)}px`;
  
  // update inputs
  const x_input : HTMLInputElement | null = document.querySelector('#set_x');
  const y_input : HTMLInputElement | null = document.querySelector('#set_y');
  (x_input as HTMLInputElement).value = particle.position.x.toString();
  (y_input as HTMLInputElement).value = particle.position.y.toString();

  container_element?.appendChild(particle_element);
}

function updateParticleElementManual() {  
  // const name_element : HTMLElement | null = document.querySelector('#selected_particle_name');
  const x_input : HTMLInputElement | null = document.querySelector('#set_x');
  const y_input : HTMLInputElement | null = document.querySelector('#set_y');

  // Validate user inputs to stay within container bounds, while also parsing input values as ints to avoid unexpected behaviors
  const newX = Math.min(Math.max(parseInt((x_input as HTMLInputElement).value, 10), container.x_min), container.x_max);
  const newY = Math.min(Math.max(parseInt((y_input as HTMLInputElement).value, 10), container.y_min), container.y_max);

  // Update object values
  const selected_particle: Particle = simulation_particles[0];  // TODO: change from zero to whatever selected particle name
  selected_particle.position.x = newX;
  selected_particle.position.y = newY;

  // Show validation of user inputs in the input fields
  (x_input as HTMLInputElement).value = newX.toString();
  (y_input as HTMLInputElement).value = newY.toString();

  const particle_element : HTMLElement | null = document.querySelector(`#particle_element_id${0}`);  // TODO: change from zero to whatever selected particle name
  (particle_element as HTMLElement).style.left = `${(selected_particle.position.x - selected_particle.radius) - container.x_min}px`;
  (particle_element as HTMLElement).style.top = `${container.y_max - (selected_particle.position.y + selected_particle.radius)}px`;
}

loadContainerElement(container);
createParticle();