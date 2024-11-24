
/**
 * Updates an element representing a moving particle in the HTML body, used for frame-by-frame animation
 * 
 * @param {number} id number associated with the selected particle
 * @param {number} ui_courseness defines how often display values change as the selected particle changes position
 */
function updateParticleElement(id: number, ui_courseness = 1) {
  // Update the location of the selected particle's element
  const particle_element : HTMLElement | null = document.querySelector(`#particle_element_id${id}`);
  const selected_particle: Particle = simulation_particles[id];
  (particle_element as HTMLElement).style.left = `${(selected_particle.position.x - selected_particle.radius) - container.x_min}px`;
  (particle_element as HTMLElement).style.top = `${container.y_max - (selected_particle.position.y + selected_particle.radius)}px`;

  // Update displayed data for the selected particle
  const courseness_factor = Math.pow(10, ui_courseness)
  const newX = Math.floor(selected_particle.position.x / courseness_factor) * courseness_factor;
  const newY = Math.floor(selected_particle.position.y / courseness_factor) * courseness_factor;
  const x_input : HTMLInputElement | null = document.querySelector('#set_x');
  const y_input : HTMLInputElement | null = document.querySelector('#set_y');
  (x_input as HTMLInputElement).value = newX.toString();
  (y_input as HTMLInputElement).value = newY.toString();
}



let start: DOMHighResTimeStamp;
let particle_movement: number;

function step(timestamp: DOMHighResTimeStamp) {
  start = timestamp;

  simulation_particles.forEach((particle, index) => {
    particle.move();
    particle.collide_elastic(container);
    updateParticleElement(index);
  })

  particle_movement = window.requestAnimationFrame(step);
}

/**
 * Runs the particle simulation and toggles the control buttons
 */
function runSimulation() {
  // Change animation state
  simulation_particles.forEach((particle) => {  // TODO: change to adapt to other initial control settings to add to simulator
    particle.setVelocity('random', 3);
  })
  window.requestAnimationFrame(step);

  // Update buttons in the HTML body
  const run_button : HTMLButtonElement | null = document.querySelector('#control_button_run');
  const pause_button : HTMLButtonElement | null = document.querySelector('#control_button_pause');
  const stop_button : HTMLButtonElement | null = document.querySelector('#control_button_stop');
  (run_button as HTMLButtonElement).style.display = "none";
  (pause_button as HTMLButtonElement).style.display = "";
  (stop_button as HTMLButtonElement).style.display = "";
}

/**
 * Pauses the particle simulation and toggles the control buttons
 */
function pauseSimulation() {
  // Change animation state
  cancelAnimationFrame(particle_movement);

  // Update buttons in the HTML body
  const run_button : HTMLButtonElement | null = document.querySelector('#control_button_run');
  const pause_button : HTMLButtonElement | null = document.querySelector('#control_button_pause');
  (run_button as HTMLButtonElement).style.display = "";
  (pause_button as HTMLButtonElement).style.display = "none";
}

/**
 * TODO: Implement RESETTING THE SIM
 * Stops the particle simulation and toggles the control buttons
 */
function stopSimulation() {
  // Change animation state
  cancelAnimationFrame(particle_movement);

  // Update buttons in the HTML body
  const run_button : HTMLButtonElement | null = document.querySelector('#control_button_run');
  const pause_button : HTMLButtonElement | null = document.querySelector('#control_button_pause');
  const stop_button : HTMLButtonElement | null = document.querySelector('#control_button_stop');
  (run_button as HTMLButtonElement).style.display = "";
  (pause_button as HTMLButtonElement).style.display = "none";
  (stop_button as HTMLButtonElement).style.display = "none";
}