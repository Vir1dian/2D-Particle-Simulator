
/**
 * Updates an element representing a moving particle in the HTML body, used for frame-by-frame animation
 * 
 * @param {number} id number associated with the selected particle
 * @param {number} ui_courseness defines how often display values change as the selected particle changes position
 */
function updateParticleElement(selected_particle: Particle, ui_courseness = 1) {
  // Update the location of the selected particle's element
  const particle_element : HTMLElement = document.querySelector(`#particle_element_id${selected_particle.id}`) as HTMLElement;
  particle_element.style.left = `${(selected_particle.position.x - selected_particle.radius) - container.x_min}px`;
  particle_element.style.top = `${container.y_max - (selected_particle.position.y + selected_particle.radius)}px`;

  // Update displayed data for the selected particle
  const courseness_factor = Math.pow(10, ui_courseness)
  const newX = Math.floor(selected_particle.position.x / courseness_factor) * courseness_factor;
  const newY = Math.floor(selected_particle.position.y / courseness_factor) * courseness_factor;
  const x_input : HTMLInputElement = document.querySelector(`#set_x_id${selected_particle.id}`) as HTMLInputElement;
  const y_input : HTMLInputElement = document.querySelector(`#set_y_id${selected_particle.id}`) as HTMLInputElement;
  x_input.value = newX.toString();
  y_input.value = newY.toString();
}



let start: DOMHighResTimeStamp;
let particle_movement: number;

function step(timestamp: DOMHighResTimeStamp) {
  start = timestamp;

  simulation_particles.forEach((particle) => {
    particle.move();
    particle.collideContainer(container);

    simulation_particles.forEach((otherParticle) => {
      if (otherParticle !== particle) {
        particle.collideParticle(otherParticle, 0.6);
      }
    });

    updateParticleElement(particle);
  })

  particle_movement = window.requestAnimationFrame(step);
}

const timer_element: HTMLElement = document.querySelector('#simulation_timer') as HTMLElement;
let timer: number | null, time_elapsed: number = 0;
/**
 * Runs the particle simulation and toggles the control buttons
 */
function runSimulation() {
  // start a timer
  if (!timer) {
    timer = setInterval(() => {
      time_elapsed++;
    
      let hours: string | number = Math.floor(time_elapsed/3600);
      if (hours/10 < 1) {
        hours = "0" + hours;
      }
      let minutes: string | number = Math.floor(time_elapsed/60) % 60;
      if (minutes/10 < 1) {
        minutes = "0" + minutes;
      }
      let seconds: string | number = time_elapsed % 60;
      if (seconds/10 < 1) {
        seconds = "0" + seconds;
      }
    
      timer_element.innerHTML = `${hours}:${minutes}:${seconds}`;
    }, 1000);    
  }
  // Change animation state
  window.requestAnimationFrame(step);
  // Update buttons in the HTML body
  const run_button : HTMLButtonElement = document.querySelector('#control_button_run') as HTMLButtonElement;
  const pause_button : HTMLButtonElement = document.querySelector('#control_button_pause') as HTMLButtonElement;
  const stop_button : HTMLButtonElement = document.querySelector('#control_button_stop') as HTMLButtonElement;
  run_button.disabled = true;
  pause_button.disabled = false;
  stop_button.disabled = false;
}

/**
 * Pauses the particle simulation and toggles the control buttons
 */
function pauseSimulation() {
  // Pause a timer
  clearInterval(timer as number);
  timer = null;
  // Change animation state
  cancelAnimationFrame(particle_movement);
  // Update buttons in the HTML body
  const run_button : HTMLButtonElement = document.querySelector('#control_button_run') as HTMLButtonElement;
  const pause_button : HTMLButtonElement = document.querySelector('#control_button_pause') as HTMLButtonElement;
  run_button.disabled = false;
  pause_button.disabled = true;
}

/**
 * Stops the particle simulation and toggles the control buttons
 */
function stopSimulation() {
  // Stop a timer
  clearInterval(timer as number);
  timer = null;
  time_elapsed = 0;
  timer_element.innerHTML = '00:00:00';
  // Change animation state
  cancelAnimationFrame(particle_movement);
  // Empty simulation data
  simulation_particles.length = 0;
  // Empty simulation elements
  const particle_elements : NodeListOf<Element> = document.querySelectorAll('.particle_element');
  const control_particle_elements : NodeListOf<Element> = document.querySelectorAll('.control_particle');
  particle_elements.forEach(element => {
    element.remove()
  });
  control_particle_elements.forEach(element => {
    element.remove()
  });

  // Update buttons in the HTML body
  const run_button : HTMLButtonElement = document.querySelector('#control_button_run') as HTMLButtonElement;
  const pause_button : HTMLButtonElement = document.querySelector('#control_button_pause') as HTMLButtonElement;
  const stop_button : HTMLButtonElement = document.querySelector('#control_button_stop') as HTMLButtonElement;
  run_button.disabled = false;
  pause_button.disabled = true;
  stop_button.disabled = true;
}