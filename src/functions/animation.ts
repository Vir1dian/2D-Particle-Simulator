



// TODO: Rewrite this into a class/es








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
  const courseness_factor_pos = Math.pow(10, ui_courseness)
  const courseness_factor_vel = Math.pow(10, ui_courseness - 3)
  const newX = Math.floor(selected_particle.position.x / courseness_factor_pos) * courseness_factor_pos;
  const newY = Math.floor(selected_particle.position.y / courseness_factor_pos) * courseness_factor_pos;
  const newVX = Math.floor(selected_particle.velocity.x / courseness_factor_vel) * courseness_factor_vel;
  const newVY = Math.floor(selected_particle.velocity.y / courseness_factor_vel) * courseness_factor_vel;

  const view_x_input : HTMLInputElement = document.querySelector(`#view_x_id${selected_particle.id}`) as HTMLInputElement;
  const view_y_input : HTMLInputElement = document.querySelector(`#view_y_id${selected_particle.id}`) as HTMLInputElement;
  const x_input : HTMLInputElement = document.querySelector(`#set_x_id${selected_particle.id}`) as HTMLInputElement;
  const y_input : HTMLInputElement = document.querySelector(`#set_y_id${selected_particle.id}`) as HTMLInputElement;
  const vx_input : HTMLInputElement = document.querySelector(`#set_vx_id${selected_particle.id}`) as HTMLInputElement;
  const vy_input : HTMLInputElement = document.querySelector(`#set_vy_id${selected_particle.id}`) as HTMLInputElement;
  view_x_input.value = newX.toString();
  view_y_input.value = newY.toString();
  x_input.value = newX.toString();
  y_input.value = newY.toString();
  vx_input.value = newVX.toString();
  vy_input.value = newVY.toString();
}

enum SimulationState {
  Stopped,
  Running,
  Paused
}

let start: DOMHighResTimeStamp;
let particle_movement: number;
let time_previous: number = 0, time_elapsed: number = 0, time_paused: number = 0;
let simulation_state: SimulationState = SimulationState.Stopped;
/**
 * Literally the slowest and most inefficient possible way to calculate collisions
 * TODO: Implement a different algorithm, consider:
 * 1. Sweep and Prune
 * 2. Uniform Grid Space
 * 3. KD Trees
 * 4. Bounding Volume Hierarchies
 * 
 * @param timestamp 
 */
function step(timestamp: DOMHighResTimeStamp) {
  // Time update for differential and movement caluclations
  if (!time_previous) time_previous = timestamp;
  const dt = Math.min((timestamp - time_previous) / 1000, 1 / 60);  // Using this line instead of 1/60 for higher accuracy, in seconds. Capped to 1/60
  time_previous = timestamp; // Update the previous timestamp for the next frame
  time_elapsed += dt; // Update total elapsed time in seconds
  // console.log(dt + ' ' + elapsedTime);

  // Collision
  start = timestamp;
  simulation_particles.forEach((particle) => {  
    particle.move(dt, time_elapsed);
    if (particle.collideContainer(container) && particle.trajectory) {
      particleElementFunctionsOld.eraseTrajectory(particle.id);
      particleElementFunctionsOld.drawTrajectory(particle, time_elapsed, simulation_settings.environment.trajectory_step);
    };

    simulation_particles.forEach((otherParticle) => {
      if (otherParticle !== particle) {
        if (particle.collideParticle(otherParticle, simulation_settings.environment.elasticity)) {
          if (particle.trajectory) {
            particleElementFunctionsOld.eraseTrajectory(particle.id);
            particleElementFunctionsOld.drawTrajectory(particle, time_elapsed, simulation_settings.environment.trajectory_step);
          }
          if (otherParticle.trajectory) {
            particleElementFunctionsOld.eraseTrajectory(otherParticle.id);
            particleElementFunctionsOld.drawTrajectory(otherParticle, time_elapsed, simulation_settings.environment.trajectory_step);
          }
        }
      }
    });
    
    updateParticleElement(particle);
  })

  particle_movement = window.requestAnimationFrame(step);
}

const timer_element: HTMLElement = document.querySelector('#simulation_timer') as HTMLElement;
let timer: number | null;
// let timer_elapsed: number = 0;
/**
 * Runs the particle simulation and toggles the control buttons
 */
function runSimulation() {
  // ignore if simulation has no particles
  if (!simulation_particles.length || simulation_state === SimulationState.Running) {
    return;
  }
  if (time_paused) {
    const pauseDuration = (performance.now() - time_paused) / 1000; // Time paused in seconds
    time_previous += pauseDuration * 1000; // Adjust previousTime by pause duration
    time_paused = 0; // Reset pauseTime
  }
  // start a timer
  if (!timer) {
    timer = setInterval(() => {
      let hours: string | number = Math.floor(time_elapsed/3600);
      if (hours/10 < 1) {
        hours = "0" + hours;
      }
      let minutes: string | number = Math.floor(time_elapsed/60) % 60;
      if (minutes/10 < 1) {
        minutes = "0" + minutes;
      }
      let seconds: string | number = Math.round(time_elapsed) % 60;
      if (seconds/10 < 1) {
        seconds = "0" + seconds;
      }
    
      timer_element.innerHTML = `${hours}:${minutes}:${seconds}`;
    }, 1000);    
  }
  // Change animation state
  window.requestAnimationFrame(step);
  simulation_state = SimulationState.Running;
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
  if (simulation_state === SimulationState.Paused || simulation_state === SimulationState.Stopped) {
    return;
  }
  // Pause a timer
  clearInterval(timer as number);
  timer = null;
  // Record the pause time
  if (time_elapsed) {
    time_paused = performance.now();
  }
  // Change animation state
  cancelAnimationFrame(particle_movement);
  simulation_state = SimulationState.Paused;
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
  timer_element.innerHTML = '00:00:00';
  // Change animation state
  time_previous = 0;
  time_elapsed = 0;
  time_paused = 0;
  simulation_state = SimulationState.Stopped;
  cancelAnimationFrame(particle_movement);
  // Empty simulation data
  simulation_particles.length = 0;
  // Empty simulation elements
  const particle_elements : NodeListOf<Element> = document.querySelectorAll('.particle_element');
  const control_particle_elements : NodeListOf<Element> = document.querySelectorAll('.control_particle');
  const trajectory_points : NodeListOf<Element> = document.querySelectorAll('.point');
  trajectory_points.forEach(element => {
    element.remove()
  });
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