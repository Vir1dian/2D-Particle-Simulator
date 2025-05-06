class AnimationControllerRenderer extends Renderer {
  #controller: AnimationController;
  #timer_element: HTMLDivElement;
  #run_button: ButtonRenderer;
  #pause_button: ButtonRenderer;
  #stop_button: ButtonRenderer;

  constructor(controller: AnimationController) {
    const wrapper: HTMLDivElement = document.createElement('div');
    super(wrapper, '', "control_timer");
    
    // Saved Data
    this.#controller = controller;
    this.#timer_element = this.SetupTimerElement(controller.getTimeElapsed());
    this.#run_button = this.SetupRunButton(controller);
    this.#pause_button = this.SetupPauseButton(controller);
    this.#stop_button = this.SetupStopButton(controller);
    this.setupObservers(controller);

    // DOM Content
    const wrapper_table = document.createElement('table');

    const timer_wrapper_row = document.createElement('tr');
    const cell0 = document.createElement('td');
    cell0.colSpan = 3;
    cell0.appendChild(this.#timer_element);
    timer_wrapper_row.appendChild(cell0);

    const buttons_wrapper_row = document.createElement('tr');
    const cell1 = document.createElement('td');
    const cell2 = document.createElement('td');
    const cell3 = document.createElement('td');
    this.#run_button.setParent(cell1);
    this.#pause_button.setParent(cell2);
    this.#stop_button.setParent(cell3);
    buttons_wrapper_row.appendChild(cell1);
    buttons_wrapper_row.appendChild(cell2);
    buttons_wrapper_row.appendChild(cell3);
    
    wrapper_table.appendChild(timer_wrapper_row);
    wrapper_table.appendChild(buttons_wrapper_row);
    wrapper.appendChild(wrapper_table);
  }
  private setupObservers(controller: AnimationController): void {
    const obs = controller.getObservers();
    obs.add(AnimationControllerEvent.Update, () => { this.refresh() });
  }
  private SetupTimerElement(time_elapsed: number): HTMLDivElement {
    const timer_element: HTMLDivElement = document.createElement('div');
    timer_element.id = "animation_timer";
    timer_element.innerHTML = this.FormatTime(time_elapsed);
    return timer_element;
  }
  private SetupRunButton(controller: AnimationController): ButtonRenderer {
    const button = new ButtonRenderer(
      ()=>{
        // run simulation, enable other control buttons, and disable this control button
      }
    )
    button.setLabel("play_arrow", true);
    button.setID("control_button_run");
    return button;
  }
  private SetupPauseButton(controller: AnimationController): ButtonRenderer {
    const button = new ButtonRenderer(
      ()=>{
        // pause simulation, enable other control buttons, and disable this control button
      }
    )
    button.setLabel("pause", true);
    button.setID("control_button_pause");
    return button;
  }
  private SetupStopButton(controller: AnimationController): ButtonRenderer {
    const button = new ButtonRenderer(
      ()=>{
        // stop simulation, enable other control buttons, and disable this control button
      }
    )
    button.setLabel("stop", true);
    button.setID("control_button_stop");
    return button;
  }
  private FormatTime(time: number): string {
    let hours: number = Math.floor(time/3600);
    let minutes: number = Math.floor(time/60) % 60;
    let seconds: number = Math.round(time) % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  refresh(): void {
    this.#timer_element.innerHTML = this.FormatTime(this.#controller.getTimeElapsed());
  }
  remove(): void {
    this.#run_button.remove();
    this.#pause_button.remove();
    this.#stop_button.remove();
    this.getElement().removeChild(this.#timer_element);
    super.remove();
  }
}

enum AnimationControllerState {
  Stopped,
  Running,
  Paused
}

enum AnimationControllerEvent {
  Update
}

class AnimationController {
  #container: BoxSpace;
  #environment: SimEnvironment;
  #particles: Particle[];
  #state: AnimationControllerState;
  #time_elapsed: number = 0;  // in total number of seconds

  #frame_id: number;

  #time_previous: number = 0;
  #time_paused: number = 0;

  #observers: ObserverHandler<typeof AnimationControllerEvent, {[AnimationControllerEvent.Update]: void | undefined}>;  // for the timer renderer

  constructor(simulation: Simulation) {
    this.#container = simulation.getContainer();
    this.#environment = simulation.getEnvironment();
    this.#particles = simulation.getParticlesHandler().getAllParticles();
    this.#state = AnimationControllerState.Stopped;

    this.#frame_id = performance.now();

    this.step = this.step.bind(this);

    this.#observers = new ObserverHandler(AnimationControllerEvent);
  }
  private step(timestamp: DOMHighResTimeStamp): void {
    if (this.#time_previous === 0) this.#time_previous = timestamp;
    const dt = Math.min((timestamp - this.#time_previous) / 1000, 1 / 60);
    this.#time_previous = timestamp;
    this.#time_elapsed += dt;

    this.#observers.notify(AnimationControllerEvent.Update, undefined);
  
    // Collision
    this.#particles.forEach((particle) => {  
      particle.move(dt, this.#time_elapsed);
      if (particle.collideContainer(this.#container) && particle.enable_path_tracing) {
        // TODO, path tracing not as urgent right now
      };
  
      this.#particles.forEach((other_particle) => {
        if (other_particle !== particle) {
          if (particle.collideParticle(other_particle, this.#environment.statics!.elasticity)) {
            if (particle.enable_path_tracing) {
              // TODO, path tracing not as urgent right now
            }
            if (other_particle.enable_path_tracing) {
              // TODO, path tracing not as urgent right now
            }
          }
        }
      });
    })
  
    this.loop();
  }
  private loop(): void {
    this.#frame_id = window.requestAnimationFrame(this.step);
  }
  private startLoop(): void {
    window.requestAnimationFrame(this.step);
  }
  private endLoop(): void {
    cancelAnimationFrame(this.#frame_id);
  }
  run(): void {
    // ignore if simulation has no particles
    if (!this.#particles.length || this.#state === AnimationControllerState.Running) return;
    if (this.#time_paused) {
      const pause_duration = (performance.now() - this.#time_paused) / 1000; 
      this.#time_previous += pause_duration * 1000; 
      this.#time_paused = 0; 
    }
    // Change animation state
    this.#state = AnimationControllerState.Running;
    this.startLoop();
  }
  pause(): void {
    if (this.#state === AnimationControllerState.Paused || this.#state === AnimationControllerState.Stopped)
      return;
    // Record the pause time
    if (this.#time_elapsed) {
      this.#time_paused = performance.now();
    }
    // Change animation state
    this.#state = AnimationControllerState.Paused;
    this.endLoop();
  }
  stop(): void {
    // Change animation state
    this.#time_elapsed = 0;
    this.#time_previous = 0;
    this.#time_paused = 0;
    this.#state = AnimationControllerState.Stopped;
    this.endLoop();

    // TODO: reset simulation to the preset at the beginning
  }
  getState(): AnimationControllerState {
    return this.#state;
  }
  getTimeElapsed(): number {
    return this.#time_elapsed;
  }
  getObservers(): ObserverHandler<typeof AnimationControllerEvent, {[AnimationControllerEvent.Update]: void | undefined}> {
    return this.#observers;
  }
}