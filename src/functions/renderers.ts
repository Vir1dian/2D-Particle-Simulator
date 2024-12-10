
// function setAttributes(element: HTMLElement, attributes: string[]) {
//   for (let key in attributes) {
//       if (attributes.hasOwnProperty(key)) {
//           element.setAttribute(key, attributes[key]);
//       }
//   }
// }

function loadContainerElement(container: BoxSpace) {
  const wrapper : HTMLElement | null = document.querySelector('.simulation_wrapper');

  const container_element : HTMLElement = document.createElement('div');
  container_element.classList.add('container_element');
  container_element.style.width = `${container.x_max - container.x_min}px`;
  container_element.style.height = `${container.y_max - container.y_min}px`;
  wrapper?.appendChild(container_element);
}

const simulationSettingsElementFunctions = {
  /**
   * Updates the input fields of simulation settings UI to reflect actual values
   * @param settings 
   */
  loadSettings(settings: SimulationSettings) {  // jesus christ
    // Get all input elements
    const num_particles: HTMLInputElement = document.querySelector('#control_simulation-num_particles') as HTMLInputElement;
    const num_particles_random: HTMLInputElement = document.querySelector('#control_simulation-num_particles_random') as HTMLInputElement;
    const pos_x: HTMLInputElement = document.querySelector('#control_simulation-pos_x') as HTMLInputElement;
    const pos_y: HTMLInputElement = document.querySelector('#control_simulation-pos_y') as HTMLInputElement;
    const pos_random: HTMLInputElement = document.querySelector('#control_simulation-pos_random') as HTMLInputElement;
    const vel_x: HTMLInputElement = document.querySelector('#control_simulation-vel_x') as HTMLInputElement;
    const vel_y: HTMLInputElement = document.querySelector('#control_simulation-vel_y') as HTMLInputElement;
    const vel_random: HTMLInputElement = document.querySelector('#control_simulation-vel_random') as HTMLInputElement;
    const acc_x: HTMLInputElement = document.querySelector('#control_simulation-acc_x') as HTMLInputElement;
    const acc_y: HTMLInputElement = document.querySelector('#control_simulation-acc_y') as HTMLInputElement;
    const acc_random: HTMLInputElement = document.querySelector('#control_simulation-acc_random') as HTMLInputElement;
    const osc_x: HTMLInputElement = document.querySelector('#control_simulation-osc_x') as HTMLInputElement;
    const osc_y: HTMLInputElement = document.querySelector('#control_simulation-osc_y') as HTMLInputElement;
    const osc_random: HTMLInputElement = document.querySelector('#control_simulation-osc_random') as HTMLInputElement;
    const mass: HTMLInputElement = document.querySelector('#control_simulation-mass') as HTMLInputElement;
    const mass_random: HTMLInputElement = document.querySelector('#control_simulation-mass_random') as HTMLInputElement;
    const radius: HTMLInputElement = document.querySelector('#control_simulation-radius') as HTMLInputElement;
    const radius_random: HTMLInputElement = document.querySelector('#control_simulation-radius_random') as HTMLInputElement;
    const elac: HTMLInputElement = document.querySelector('#control_simulation-elac') as HTMLInputElement;
    const color: HTMLInputElement = document.querySelector('#control_simulation-color') as HTMLInputElement;
    const color_random: HTMLInputElement = document.querySelector('#control_simulation-color_random') as HTMLInputElement;

    // Load default values for simulation settings
    if (settings.particle[0].num_particles === 'random') num_particles_random.checked = true;
    else {
      num_particles.value = settings.particle[0].num_particles.toString();
      num_particles_random.checked = false;
    }
    if (settings.particle[0].position === 'random') pos_random.checked = true;
    else {
      pos_x.value = settings.particle[0].position.x.toString();
      pos_y.value = settings.particle[0].position.y.toString();
      pos_random.checked = false;
    }
    if (settings.particle[0].velocity === 'random') vel_random.checked = true;
    else {
      vel_x.value = settings.particle[0].velocity.x.toString();
      vel_y.value = settings.particle[0].velocity.y.toString();
      vel_random.checked = false;
    }
    if (settings.particle[0].acceleration === 'random') acc_random.checked = true;
    else {
      acc_x.value = settings.particle[0].acceleration.x.toString();
      acc_y.value = settings.particle[0].acceleration.y.toString();
      acc_random.checked = false;
    }
    if (settings.particle[0].oscillation === 'random') osc_random.checked = true;
    else {
      osc_x.value = settings.particle[0].oscillation.x.toString();
      osc_y.value = settings.particle[0].oscillation.y.toString();
      osc_random.checked = false;
    }
    if (settings.particle[0].mass === 'random') mass_random.checked = true;
    else {
      mass.value = settings.particle[0].mass.toString();
      mass_random.checked = false;
    }
    if (settings.particle[0].radius === 'random') radius_random.checked = true;
    else {
      radius.value = settings.particle[0].radius.toString();
      radius_random.checked = false;
    }
    if (settings.particle[0].color === 'random') color_random.checked = true;
    else {
      color.value = settings.particle[0].color;
      color_random.checked = false;
    }
    elac.value = settings.environment.elasticity.toString()
  },

    /**
   * Updates the actual values of simulation settings to reflect input fields in UI
   * @param settings 
   */
  updateSettings() {
    // Get all input elements
    const num_particles: HTMLInputElement = document.querySelector('#control_simulation-num_particles') as HTMLInputElement;
    const num_particles_random: HTMLInputElement = document.querySelector('#control_simulation-num_particles_random') as HTMLInputElement;
    const pos_x: HTMLInputElement = document.querySelector('#control_simulation-pos_x') as HTMLInputElement;
    const pos_y: HTMLInputElement = document.querySelector('#control_simulation-pos_y') as HTMLInputElement;
    const pos_random: HTMLInputElement = document.querySelector('#control_simulation-pos_random') as HTMLInputElement;
    const vel_x: HTMLInputElement = document.querySelector('#control_simulation-vel_x') as HTMLInputElement;
    const vel_y: HTMLInputElement = document.querySelector('#control_simulation-vel_y') as HTMLInputElement;
    const vel_random: HTMLInputElement = document.querySelector('#control_simulation-vel_random') as HTMLInputElement;
    const acc_x: HTMLInputElement = document.querySelector('#control_simulation-acc_x') as HTMLInputElement;
    const acc_y: HTMLInputElement = document.querySelector('#control_simulation-acc_y') as HTMLInputElement;
    const acc_random: HTMLInputElement = document.querySelector('#control_simulation-acc_random') as HTMLInputElement;
    const osc_x: HTMLInputElement = document.querySelector('#control_simulation-osc_x') as HTMLInputElement;
    const osc_y: HTMLInputElement = document.querySelector('#control_simulation-osc_y') as HTMLInputElement;
    const osc_random: HTMLInputElement = document.querySelector('#control_simulation-osc_random') as HTMLInputElement;
    const mass: HTMLInputElement = document.querySelector('#control_simulation-mass') as HTMLInputElement;
    const mass_random: HTMLInputElement = document.querySelector('#control_simulation-mass_random') as HTMLInputElement;
    const radius: HTMLInputElement = document.querySelector('#control_simulation-radius') as HTMLInputElement;
    const radius_random: HTMLInputElement = document.querySelector('#control_simulation-radius_random') as HTMLInputElement;
    const elac: HTMLInputElement = document.querySelector('#control_simulation-elac') as HTMLInputElement;
    const color: HTMLInputElement = document.querySelector('#control_simulation-color') as HTMLInputElement;
    const color_random: HTMLInputElement = document.querySelector('#control_simulation-color_random') as HTMLInputElement;

    // Load default values for simulation settings
    if (num_particles_random.checked === true) simulation_settings.particle[0].num_particles = 'random';
    else {
      const newNum = Math.min(Math.max(parseInt(num_particles.value), 0), 500);
      num_particles.value = newNum.toString();
      simulation_settings.particle[0].num_particles = newNum as number;
    }
    if (pos_random.checked === true) simulation_settings.particle[0].position = 'random';
    else {
      const newX = Math.min(Math.max(parseFloat(pos_x.value), container.x_min), container.x_max);
      const newY = Math.min(Math.max(parseFloat(pos_y.value), container.y_min), container.y_max);
    
      // Show validation of user inputs in the input fields
      pos_x.value = newX.toString();
      pos_y.value = newY.toString();
      simulation_settings.particle[0].position = new Vector2D(newX, newY);
    }
    if (vel_random.checked === true) simulation_settings.particle[0].velocity = 'random';
    else {
      simulation_settings.particle[0].velocity = new Vector2D(parseFloat(vel_x.value), parseFloat(vel_y.value));
    }
    if (acc_random.checked === true) simulation_settings.particle[0].acceleration = 'random';
    else {
      simulation_settings.particle[0].acceleration = new Vector2D(parseFloat(acc_x.value), parseFloat(acc_y.value));
    }
    if (osc_random.checked === true) simulation_settings.particle[0].oscillation = 'random';
    else {
      simulation_settings.particle[0].oscillation = new Vector2D(parseFloat(osc_x.value), parseFloat(osc_y.value));
    }
    if (mass_random.checked === true) simulation_settings.particle[0].mass = 'random';
    else simulation_settings.particle[0].mass = parseInt(mass.value);
    if (radius_random.checked === true) simulation_settings.particle[0].radius = 'random';
    else simulation_settings.particle[0].radius = parseInt(radius.value);
    if (color_random.checked === true) simulation_settings.particle[0].color = 'random';
    else simulation_settings.particle[0].color = color.value;
    simulation_settings.environment.elasticity = parseFloat(elac.value);

    this.applySettings(simulation_settings);
  },

  /**
   * TODO: Provide a full overhaul of the group particle settings
   * @param settings 
   */

  applySettings(settings: SimulationSettings) {
    try {
      if (typeof stopSimulation === 'function') {stopSimulation();}
    } catch {}

    if (settings.particle[0].num_particles) {
      let new_count: number = 0;
      if (settings.particle[0].num_particles === 'random') 
        new_count = Math.floor(Math.random() * (150 - 20 + 1) + 20);
      else {
        new_count = settings.particle[0].num_particles;
      }
      while (simulation_particles.length < new_count) {
        particleElementFunctions.createParticle();
      }
    }

    /* Grouped Settings */
    // TODO: overhaul this at some point, currently we're assuming that the 
    // total counted specified particles are less than or equal to the global
    // particle settings at simulation_settings.particle[0]

    // Apply settings to the existing particles (ignoring newly added particles), (group 0 is the default global for creating particles)
    const applyToExistingParticles = (particle: Particle, group_index: number = 0) => {
      particle.mass = settings.particle[group_index].mass === 'random'
        ? Math.floor(Math.random() * (10 - 1 + 1) + 1)
        : settings.particle[group_index].mass as number;
      const mass_input : HTMLInputElement = document.querySelector(`#set_mass_id${particle.id}`) as HTMLInputElement;
      mass_input.value = particle.mass.toString();

      particle.radius = settings.particle[group_index].radius === 'random'
        ? Math.floor(Math.random() * (20 - 5 + 1) + 5)
        : settings.particle[group_index].radius as number;
      const radius_input : HTMLInputElement = document.querySelector(`#set_radius_id${particle.id}`) as HTMLInputElement;
      radius_input.value = particle.radius.toString();
      
      if (settings.particle[group_index].color === 'random') {
        particle.color = particle_colors[Math.floor(Math.random() * particle_colors.length)];
      }
      else if (!particle_colors.includes(settings.particle[group_index].color)) particle.color = 'black';
      else particle.color = settings.particle[group_index].color;
      const color_input : HTMLInputElement = document.querySelector(`#set_color_id${particle.id}`) as HTMLInputElement;
      color_input.value = particle.color;

      if (settings.particle[group_index].position === 'random') {
        particle.setPosition('random', container.x_max - particle.radius);
      } else {
        particle.setPosition((settings.particle[group_index].position as Vector2D).x, (settings.particle[group_index].position as Vector2D).y);
      }
      const view_x_input : HTMLInputElement = document.querySelector(`#view_x_id${particle.id}`) as HTMLInputElement;
      const view_y_input : HTMLInputElement = document.querySelector(`#view_y_id${particle.id}`) as HTMLInputElement;
      const x_input : HTMLInputElement = document.querySelector(`#set_x_id${particle.id}`) as HTMLInputElement;
      const y_input : HTMLInputElement = document.querySelector(`#set_y_id${particle.id}`) as HTMLInputElement;
      view_x_input.value = particle.position.x.toString();
      view_y_input.value = particle.position.y.toString();
      x_input.value = particle.position.x.toString();
      y_input.value = particle.position.y.toString();

      const particle_element : HTMLElement = document.querySelector(`#particle_element_id${particle.id}`) as HTMLElement;
      particle_element.style.borderRadius = `${particle.radius}px`;
      particle_element.style.width = `${2*particle.radius}px`;
      particle_element.style.height = `${2*particle.radius}px`;
      particle_element.style.backgroundColor = particle.color;
      particle_element.style.left = `${(particle.position.x - particle.radius) - container.x_min}px`;
      particle_element.style.top = `${container.y_max - (particle.position.y + particle.radius)}px`;
      
      if (settings.particle[group_index].velocity === 'random') {
        particle.setVelocity('random', 300);
      } else {
        particle.setVelocity((settings.particle[group_index].velocity as Vector2D).x, (settings.particle[group_index].velocity as Vector2D).y);
      }
      const vx_input : HTMLInputElement = document.querySelector(`#set_vx_id${particle.id}`) as HTMLInputElement;
      const vy_input : HTMLInputElement = document.querySelector(`#set_vy_id${particle.id}`) as HTMLInputElement;
      vx_input.value = particle.velocity.x.toString();
      vy_input.value = particle.velocity.y.toString();

      if (settings.particle[group_index].acceleration === 'random') {
        particle.setAcceleration('random', 100);
      } else {
        particle.setAcceleration((settings.particle[group_index].acceleration as Vector2D).x, (settings.particle[group_index].acceleration as Vector2D).y);
      }
      const ax_input : HTMLInputElement = document.querySelector(`#set_ax_id${particle.id}`) as HTMLInputElement;
      const ay_input : HTMLInputElement = document.querySelector(`#set_ay_id${particle.id}`) as HTMLInputElement;
      ax_input.value = particle.acceleration.x.toString();
      ay_input.value = particle.acceleration.y.toString();

      if (settings.particle[group_index].oscillation === 'random') {
        particle.setOscillation('random', 2, 'circular');
      } else {
        particle.setOscillation((settings.particle[0].oscillation as Vector2D).x, (settings.particle[0].oscillation as Vector2D).y);
      }
      const ox_input : HTMLInputElement = document.querySelector(`#set_ox_id${particle.id}`) as HTMLInputElement;
      const oy_input : HTMLInputElement = document.querySelector(`#set_oy_id${particle.id}`) as HTMLInputElement;
      ox_input.value = particle.oscillation.x.toString();
      oy_input.value = particle.oscillation.y.toString();
    };

    let indexFrom = 0;
    let indexTo = 0;
    for (let i = 1; i < simulation_settings.particle.length; i++) {
      indexFrom = indexTo;
      if (simulation_settings.particle[i].num_particles === 'random') {
        indexTo += Math.floor(Math.random() * ((simulation_particles.length - 1) - 2 + 1) + 2);
      } else {indexTo += simulation_settings.particle[i].num_particles as number}
      if (indexFrom >= simulation_particles.length) break;
      if (indexTo > simulation_particles.length) indexTo = simulation_particles.length;
      for (let j = indexFrom; j < indexTo; j++) {
        applyToExistingParticles(simulation_particles[j], i);
      }
    }

  },

  loadPreset(preset: string) {
    if (presets[preset]) {
      current_preset = preset;
      Object.assign(simulation_settings, presets[preset]);
      this.loadSettings(simulation_settings);
      this.applySettings(simulation_settings);
    } else {
      console.error(`Preset "${preset}" not found.`);
    }
  }
}

const particleElementFunctions = {
  loadParticle(particle: Particle, container: BoxSpace) {  
    // Load particle element in the simulation space
    const particle_element : HTMLElement = document.createElement('div');
    particle_element.classList.add('particle_element');
    particle_element.id = `particle_element_id${particle.id}`;
    // shape
    particle_element.style.borderRadius = `${particle.radius}px`;
    particle_element.style.width = `${2*particle.radius}px`;
    particle_element.style.height = `${2*particle.radius}px`;
    // positioning
    particle_element.style.left = `${(particle.position.x - particle.radius) - container.x_min}px`;
    particle_element.style.top = `${container.y_max - (particle.position.y + particle.radius)}px`;
    // color
    particle_element.style.backgroundColor = particle.color;
    // append to HTML body
    const container_element : HTMLElement | null = document.querySelector('.container_element');
    container_element?.appendChild(particle_element);
    

    // Load particle controls element in the control interface
    const particle_element_control: HTMLTableRowElement = document.createElement('tr');
    particle_element_control.classList.add('control_particle');
    particle_element_control.id = `control_particle_data_id${particle.id}`;
    particle_element_control.innerHTML = `
      <td>
        <div id="selected_particle_id${particle.id}">${particle.id}</div>
      </td>
      <td>
        <input type="number" id="view_x_id${particle.id}" class="control_particle_input" value="${particle.position.x.toString()}" readonly>
      </td>
      <td>
        <input type="number" id="view_y_id${particle.id}" class="control_particle_input" value="${particle.position.y.toString()}" readonly>
      </td>
      <td>
        <button id="view_id${particle.id}">View Details</button>
      </td>
    `;
    const particle_element_modal: HTMLDialogElement = document.createElement('dialog');
    particle_element_modal.id = `view_modal${particle.id}`;
    particle_element_modal.innerHTML = `
      <div class="modal_buttons">
        <button id="close_view_id${particle.id}" class="close_btn">Close</button>
        <button id="update_id${particle.id}" class="update_btn">Update</button>
        <button id="delete_id${particle.id}" class="delete_btn">Delete</button>        
      </div>
      <table cellspacing="0">
        <tr>
          <th>Particle #</th>
          <td>
            <div>${particle.id}</div>
          </td>
        </tr>
        <tr>
          <th>pos<sub>X</sub></th>
          <td>
            <input type="number" id="set_x_id${particle.id}" class="control_particle_input" value="${particle.position.x.toString()}">
          </td>
        </tr>
        <tr>
          <th>pos<sub>Y</sub></th>
          <td>
            <input type="number" id="set_y_id${particle.id}" class="control_particle_input" value="${particle.position.y.toString()}">
          </td>
        </tr>
        <tr>
          <th>vel<sub>X</sub></th>
          <td>
            <input type="number" id="set_vx_id${particle.id}" class="control_particle_input" value="${particle.velocity.x.toString()}">
          </td>
        </tr>
        <tr>
          <th>vel<sub>Y</sub></th>
          <td>
            <input type="number" id="set_vy_id${particle.id}" class="control_particle_input" value="${particle.velocity.y.toString()}">
          </td>
        </tr>
        <tr>
          <th>acc<sub>X</sub></th>
          <td>
            <input type="number" id="set_ax_id${particle.id}" class="control_particle_input" value="${particle.acceleration.x.toString()}">
          </td>
        </tr>
        <tr>
          <th>acc<sub>Y</sub></th>
          <td>
            <input type="number" id="set_ay_id${particle.id}" class="control_particle_input" value="${particle.acceleration.y.toString()}">
          </td>
        </tr>
        <tr>
          <th>Amp<sub>X</sub></th>
          <td>
            <input type="number" id="set_ox_id${particle.id}" class="control_particle_input" value="${particle.oscillation.x.toString()}">
          </td>
        </tr>
        <tr>
          <th>Amp<sub>Y</sub></th>
          <td>
            <input type="number" id="set_oy_id${particle.id}" class="control_particle_input" value="${particle.oscillation.y.toString()}">
          </td>
        </tr>
        <tr>
          <th>Mass</th>
          <td>
            <input type="number" id="set_mass_id${particle.id}" class="control_particle_input" value="${particle.mass.toString()}">
          </td>
        </tr>
        <tr>
          <th>Radius</th>
          <td>
            <input type="number" id="set_radius_id${particle.id}" class="control_particle_input" value="${particle.radius.toString()}">
          </td>
        </tr>
        <tr>
          <th>Color</th>
          <td>
            <input type="text" id="set_color_id${particle.id}" class="control_particle_input" value="${particle.color.toString()}">
          </td>
        </tr>
      </table>
    `;
    particle_element_control.appendChild(particle_element_modal);

    // Add event listeners
    (particle_element_control.querySelector(`#view_id${particle.id}`) as HTMLButtonElement).addEventListener('click', () => {
      viewParticleDetailsModal(`#view_modal${particle.id}`, true);
    });
    (particle_element_control.querySelector(`#close_view_id${particle.id}`) as HTMLButtonElement).addEventListener('click', () => {
      viewParticleDetailsModal(`#view_modal${particle.id}`, false);
    });
    (particle_element_control.querySelector(`#update_id${particle.id}`) as HTMLButtonElement).addEventListener('click', () => {
      particleElementFunctions.updateParticle(particle);
    });
    (particle_element_control.querySelector(`#delete_id${particle.id}`) as HTMLButtonElement).addEventListener('click', () => {
      particleElementFunctions.deleteParticle(particle);
    });
    // append to HTML body
    const control_table: HTMLTableElement | null = document.querySelector('#control_particles table')
    control_table?.appendChild(particle_element_control);
  },

  createParticle(
    mass: number | 'random' = simulation_settings.particle[0].mass, 
    radius: number | 'random' = simulation_settings.particle[0].radius, 
    position: Vector2D | 'random' = simulation_settings.particle[0].position,
    velocity: Vector2D | 'random' = simulation_settings.particle[0].velocity,
    acceleration: Vector2D | 'random' = simulation_settings.particle[0].acceleration,
    oscillation: Vector2D | 'random' = simulation_settings.particle[0].oscillation,
    color: string = simulation_settings.particle[0].color,
    trajectory: boolean = simulation_settings.particle[0].trajectory
  ) {
    const created_particle = new Particle(
      mass, 
      radius, 
      position, 
      velocity, 
      acceleration,
      oscillation,
      color,
      trajectory
    );
    this.loadParticle(created_particle, container);
    if (created_particle.trajectory) {
      this.drawTrajectory(created_particle, time_elapsed, simulation_settings.environment.trajectory_step);
    }
  },

  updateParticle(selected_particle: Particle) {
    const x_input : HTMLInputElement = document.querySelector(`#set_x_id${selected_particle.id}`) as HTMLInputElement;
    const y_input : HTMLInputElement = document.querySelector(`#set_y_id${selected_particle.id}`) as HTMLInputElement;
    const vx_input : HTMLInputElement = document.querySelector(`#set_vx_id${selected_particle.id}`) as HTMLInputElement;
    const vy_input : HTMLInputElement = document.querySelector(`#set_vy_id${selected_particle.id}`) as HTMLInputElement;
    const ax_input : HTMLInputElement = document.querySelector(`#set_ax_id${selected_particle.id}`) as HTMLInputElement;
    const ay_input : HTMLInputElement = document.querySelector(`#set_ay_id${selected_particle.id}`) as HTMLInputElement;
    const ox_input : HTMLInputElement = document.querySelector(`#set_ox_id${selected_particle.id}`) as HTMLInputElement;
    const oy_input : HTMLInputElement = document.querySelector(`#set_oy_id${selected_particle.id}`) as HTMLInputElement;
    const mass_input : HTMLInputElement = document.querySelector(`#set_mass_id${selected_particle.id}`) as HTMLInputElement;
    const radius_input : HTMLInputElement = document.querySelector(`#set_radius_id${selected_particle.id}`) as HTMLInputElement;
    const color_input : HTMLInputElement = document.querySelector(`#set_color_id${selected_particle.id}`) as HTMLInputElement;
  
    // Validate user inputs to stay within container bounds (for position), parse input values as ints to avoid unexpected behaviors
    const newX = Math.min(Math.max(parseInt(x_input.value), container.x_min), container.x_max);
    const newY = Math.min(Math.max(parseInt(y_input.value), container.y_min), container.y_max);
    const newVX = parseFloat(vx_input.value);
    const newVY = parseFloat(vy_input.value);
    const newAX = parseFloat(ax_input.value);
    const newAY = parseFloat(ay_input.value);
    const newOX = parseFloat(ox_input.value);
    const newOY = parseFloat(oy_input.value);
    const newMass = parseInt(mass_input.value);
    const newRadius = parseInt(radius_input.value);
    const newColor = color_input.value;

    // Update object values
    selected_particle.setPosition(newX, newY);
    selected_particle.setVelocity(newVX, newVY);
    selected_particle.setAcceleration(newAX, newAY);
    selected_particle.setOscillation(newOX, newOY);
    selected_particle.mass = newMass;
    selected_particle.radius = newRadius;
    selected_particle.color = particle_colors.includes(newColor) ? newColor : 'black';
  
    // Show validation of user inputs in the input fields
    x_input.value = newX.toString();
    y_input.value = newY.toString();
  
    // Update representative element styling
    const particle_element : HTMLElement = document.querySelector(`#particle_element_id${selected_particle.id}`) as HTMLElement;
    particle_element.style.left = `${(selected_particle.position.x - selected_particle.radius) - container.x_min}px`;
    particle_element.style.top = `${container.y_max - (selected_particle.position.y + selected_particle.radius)}px`;
    particle_element.style.borderRadius = `${selected_particle.radius}px`;
    particle_element.style.width = `${2*selected_particle.radius}px`;
    particle_element.style.height = `${2*selected_particle.radius}px`;
    particle_element.style.backgroundColor = selected_particle.color;
    this.eraseTrajectory(selected_particle.id);
    if (selected_particle.trajectory) {
      this.drawTrajectory(selected_particle, time_elapsed);
    }
  },

  deleteParticle(selected_particle: Particle) {
    const particle_element : HTMLElement | null = document.querySelector(`#particle_element_id${selected_particle.id}`);
    const particle_element_control: HTMLTableRowElement | null = document.querySelector(`#control_particle_data_id${selected_particle.id}`);
    particle_element?.remove();
    particle_element_control?.remove();
    const index = simulation_particles.indexOf(selected_particle);
    if (index > -1) { // only splice array when item is found
      simulation_particles.splice(index, 1); // 2nd parameter means remove one item only
    }
    if (selected_particle.trajectory) {
      this.eraseTrajectory(selected_particle.id);
    }
  },

  drawTrajectory(selected_particle: Particle, time_elapsed: number, step: number = 0.5, cont: BoxSpace = container) {
    const isOutOfContainer = (x: number, y: number, r: number = selected_particle.radius): boolean => {
      if (x + r > cont.x_max) {  // Bounded right
        console.error(`drawTrajectory attempted outside of container bounds. x+r=${x+r}, x_max=${cont.x_max}`);
        return true;
      }
      if (x - r < cont.x_min) {  // Bounded left
        console.error(`drawTrajectory attempted outside of container bounds. x-r=${x-r}, x_min=${cont.x_min}`);
        return true;
      }
      if (y + r > cont.y_max) {  // Bounded top
        console.error(`drawTrajectory attempted outside of container bounds. y+r=${y+r}, x_min=${cont.y_max}`);
        return true;
      }
      if (y - r < cont.y_min) {  // Bounded bottom
        console.error(`drawTrajectory attempted outside of container bounds. y-r=${y-r}, x_min=${cont.y_min}`);
        return true;
      }
      return false;
    }

    if (simulation_settings.environment.drag === 0) {
      const collision_time = PredictCollision.noDrag(selected_particle, time_elapsed, cont);
      if (!isFinite(collision_time)) return;
      for (let t = time_elapsed + step; t < collision_time; t += step) {
        const new_position = PredictParticle.noDrag(selected_particle, time_elapsed, t).position;
        if (isOutOfContainer(new_position.x, new_position.y)) break;
        drawPoint(new_position, selected_particle.id);
      }
    }
    else {
      const collision_time = PredictCollision.constantDrag(selected_particle, time_elapsed, cont);
      if (!isFinite(collision_time)) return;
      // console.log(time_elapsed + step + ' < ' + collision_time);
      for (let t = time_elapsed + step; t < collision_time; t += step) {
        const new_position = PredictParticle.constantDrag(selected_particle, time_elapsed, t).position;
        if (isOutOfContainer(new_position.x, new_position.y)) break;
        drawPoint(new_position, selected_particle.id);
      }
    }
  },

  eraseTrajectory(id: number) {
    document.querySelectorAll(`.point_id${id}`).forEach(e => e.remove());
  }
}

function drawPoint(position: Vector2D, id: number = 0, radius: number = 3, color: string = 'gray') {
  const container_element : HTMLElement = document.querySelector('.container_element') as HTMLElement;
  const point_element : HTMLElement = document.createElement('div');
  point_element.classList.add('point');
  point_element.classList.add(`point_id${id}`);
  // shape
  point_element.style.borderRadius = `${radius}px`;
  point_element.style.width = `${2*radius}px`;
  point_element.style.height = `${2*radius}px`;
  // positioning
  point_element.style.left = `${(position.x - radius) - container.x_min}px`;
  point_element.style.top = `${container.y_max - (position.y + radius)}px`;
  // color
  point_element.style.backgroundColor = color;
  container_element.appendChild(point_element);
}

function viewParticleDetailsModal(id_name: string, open: boolean) {
  const viewModal: HTMLDialogElement = document.querySelector(id_name) as HTMLDialogElement;
  if (open) {
    viewModal.showModal();
    pauseSimulation();
    console.log()
  } else {
    viewModal.close();
  }
}
