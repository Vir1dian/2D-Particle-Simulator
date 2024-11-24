
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
    const control_table: HTMLTableElement | null = document.querySelector('.control_item table')
    control_table?.appendChild(particle_element_control);
  },

  /**
   * TODO: Implement variable initial conditions
   */
  createParticle() {
    const created_particle = new Particle(1, 5, new Vector2D(), new Vector2D(), new Vector2D(0, -0.098));  // for gravity, use -0.098
    // created_particle.position = created_particle.position.randomize(container.x_max-1);
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


loadContainerElement(container);
for (let i = 0; i < 100; i++) {
  particleElementFunctions.createParticle();
}