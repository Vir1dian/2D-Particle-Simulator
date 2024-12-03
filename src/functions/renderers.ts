
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
    if (settings.num_particles === 'random') num_particles_random.checked = true;
    else num_particles.value = settings.num_particles.toString();
    if (settings.position === 'random') pos_random.checked = true;
    else {
      pos_x.value = settings.position.x.toString();
      pos_y.value = settings.position.y.toString();
    }
    if (settings.velocity === 'random') vel_random.checked = true;
    else {
      vel_x.value = settings.velocity.x.toString();
      vel_y.value = settings.velocity.y.toString();
    }
    if (settings.acceleration === 'random') acc_random.checked = true;
    else {
      acc_x.value = settings.acceleration.x.toString();
      acc_y.value = settings.acceleration.y.toString();
    }
    if (settings.oscillation === 'random') osc_random.checked = true;
    else {
      osc_x.value = settings.oscillation.x.toString();
      osc_y.value = settings.oscillation.y.toString();
    }
    if (settings.mass === 'random') mass_random.checked = true;
    else mass.value = settings.mass.toString();
    if (settings.radius === 'random') radius_random.checked = true;
    else radius.value = settings.radius.toString();
    if (settings.color === 'random') color_random.checked = true;
    else color.value = settings.color;
    elac.value = settings.elasticity.toString()
  },

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
    if (num_particles_random.checked === true) simulation_settings.num_particles = 'random';
    else {
      const newNum = Math.min(Math.max(parseInt(num_particles.value), 0), 500);
      num_particles.value = newNum.toString();
      simulation_settings.num_particles = newNum as number;
    }
    if (pos_random.checked === true) simulation_settings.position = 'random';
    else {
      const newX = Math.min(Math.max(parseFloat(pos_x.value), container.x_min), container.x_max);
      const newY = Math.min(Math.max(parseFloat(pos_y.value), container.y_min), container.y_max);
    
      // Show validation of user inputs in the input fields
      pos_x.value = newX.toString();
      pos_y.value = newY.toString();
      simulation_settings.position = new Vector2D(newX, newY);
    }
    if (vel_random.checked === true) simulation_settings.velocity = 'random';
    else {
      simulation_settings.velocity = new Vector2D(parseFloat(vel_x.value), parseFloat(vel_y.value));
    }
    if (acc_random.checked === true) simulation_settings.acceleration = 'random';
    else {
      simulation_settings.acceleration = new Vector2D(parseFloat(acc_x.value), parseFloat(acc_y.value));
    }
    if (osc_random.checked === true) simulation_settings.oscillation = 'random';
    else {
      simulation_settings.oscillation = new Vector2D(parseFloat(osc_x.value), parseFloat(osc_y.value));
    }
    if (mass_random.checked === true) simulation_settings.mass = 'random';
    else simulation_settings.mass = parseInt(mass.value);
    if (radius_random.checked === true) simulation_settings.radius = 'random';
    else simulation_settings.radius = parseInt(radius.value);
    if (color_random.checked === true) simulation_settings.color = 'random';
    else simulation_settings.color = color.value;
    simulation_settings.elasticity = parseFloat(elac.value);

    this.applySettings(simulation_settings);
    stopSimulation('soft');
  },

  applySettings(settings: SimulationSettings) {
    // Apply settings to the existing particles (ignoring newly added particles)
    const applyToExistingParticles = (particle: Particle) => {
      if (settings.mass) {
        particle.mass = settings.mass === 'random'
          ? Math.floor(Math.random() * (10 - 1 + 1) + 1)
          : settings.mass;
      }
      if (settings.radius) {
        particle.radius = settings.radius === 'random'
          ? Math.floor(Math.random() * (20 - 5 + 1) + 5)
          : settings.radius;
      }
      if (settings.color) {
        if (settings.color === 'random') {
          particle.color = particle_colors[Math.floor(Math.random() * particle_colors.length)];
        }
        else if (!particle_colors.includes(settings.color)) particle.color = 'black';
        else particle.color = settings.color;
      }
      if (settings.position) {
        if (settings.position === 'random') {
          particle.setPosition('random', container.x_max - particle.radius);
        } else {
          particle.setPosition((settings.position as Vector2D).x, (settings.position as Vector2D).y);
        }
      }
      const particle_element : HTMLElement = document.querySelector(`#particle_element_id${particle.id}`) as HTMLElement;
      particle_element.style.borderRadius = `${particle.radius}px`;
      particle_element.style.width = `${2*particle.radius}px`;
      particle_element.style.height = `${2*particle.radius}px`;
      particle_element.style.backgroundColor = particle.color;
      particle_element.style.left = `${(particle.position.x - particle.radius) - container.x_min}px`;
      particle_element.style.top = `${container.y_max - (particle.position.y + particle.radius)}px`;
      if (settings.velocity) {
        if (settings.velocity === 'random') {
          particle.setVelocity('random', 2);
        } else {
          particle.setVelocity((settings.velocity as Vector2D).x, (settings.velocity as Vector2D).y);
        }
      }
      if (settings.acceleration) {
        if (settings.acceleration === 'random') {
          particle.setAcceleration('random', 0.1);
        } else {
          particle.setAcceleration((settings.acceleration as Vector2D).x, (settings.acceleration as Vector2D).y);
        }
      }
      if (settings.oscillation) {
        if (settings.oscillation === 'random') {
          particle.setOscillation('random', 2, 'circular');
        } else {
          particle.setOscillation((settings.oscillation as Vector2D).x, (settings.oscillation as Vector2D).y);
        }
      }
    };

    const previous_count: number = simulation_particles.length;
    if (settings.num_particles) {
      let new_count: number = 0;
      if (settings.num_particles === 'random') 
        new_count = Math.floor(Math.random() * (150 - 20 + 1) + 20);
      else {
        new_count = settings.num_particles;
      }
      while (simulation_particles.length < new_count) {
        particleElementFunctions.createParticle();
      }
      let delete_index: number = simulation_particles.length - 1;
      while (simulation_particles.length > new_count) {
        particleElementFunctions.deleteParticle(simulation_particles[delete_index]);
        delete_index--;
      }
    }

    // Update only existing particles
    for (let i = 0; i < previous_count && i < simulation_particles.length; i++) {
      applyToExistingParticles(simulation_particles[i]);
    }
  }
}

/**
 * TODO: Refactor to use a function for attribute assignment, for readability
 */
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
    // particle_element.style.zIndex = particle.id.toString();
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
        <input type="number" id="set_x_id${particle.id}" class="control_particle_input" value="${particle.position.x.toString()}">
      </td>
      <td>
        <input type="number" id="set_y_id${particle.id}" class="control_particle_input" value="${particle.position.y.toString()}">
      </td>
      <td>
        <button id="update_id${particle.id}">Update</button>
      </td>
      <td>
        <button id="delete_id${particle.id}">Delete</button>
      </td>
    `;
    // Add event listeners
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

  createParticle() {
    
    const created_particle = new Particle(
      simulation_settings.mass, 
      simulation_settings.radius, 
      simulation_settings.position, 
      simulation_settings.velocity, 
      simulation_settings.acceleration
    );
    this.loadParticle(created_particle, container);
  },

  updateParticle(selected_particle: Particle) {
    const x_input : HTMLInputElement = document.querySelector(`#set_x_id${selected_particle.id}`) as HTMLInputElement;
    const y_input : HTMLInputElement = document.querySelector(`#set_y_id${selected_particle.id}`) as HTMLInputElement;
  
    // Validate user inputs to stay within container bounds, while also parsing input values as ints to avoid unexpected behaviors
    const newX = Math.min(Math.max(parseInt(x_input.value), container.x_min), container.x_max);
    const newY = Math.min(Math.max(parseInt(y_input.value), container.y_min), container.y_max);
  
    // Update object values
    selected_particle.setPosition(newX, newY);
  
    // Show validation of user inputs in the input fields
    x_input.value = newX.toString();
    y_input.value = newY.toString();
  
    const particle_element : HTMLElement = document.querySelector(`#particle_element_id${selected_particle.id}`) as HTMLElement;  // TODO: change from zero to whatever selected particle name
    particle_element.style.left = `${(selected_particle.position.x - selected_particle.radius) - container.x_min}px`;
    particle_element.style.top = `${container.y_max - (selected_particle.position.y + selected_particle.radius)}px`;
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
  }
}
