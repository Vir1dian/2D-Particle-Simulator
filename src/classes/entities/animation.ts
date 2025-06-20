import { structuredCloneCustom } from "../../functions/utilities";
import { ObserverHandler } from "./observerHandler";
import type { BoxSpace, SimEnvironment } from "./simulation/simInterfaces";
import { Particle } from "./particle/particle";
import { ParticleGroupEvent, ParticleGroup } from "./particle/particleGroup";
import { ParticleHandlerEvent, ParticlesHandler } from "./particle/particlesHandler";
import { SimEvent, Simulation, DEFAULT_PRESET } from "./simulation/simulation";
import { Renderer } from "../renderers/renderer";
import { ButtonRenderer } from "../renderers/blocks";

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
    this.#timer_element = this.setupTimerElement(controller.getTimeElapsed());
    this.#run_button = this.setupRunButton();
    this.#pause_button = this.setupPauseButton();
    this.#stop_button = this.setupStopButton();
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
  private setupTimerElement(time_elapsed: number): HTMLDivElement {
    const timer_element: HTMLDivElement = document.createElement('div');
    timer_element.id = "animation_timer";
    timer_element.innerHTML = this.formatTime(time_elapsed);
    return timer_element;
  }
  private setupRunButton(): ButtonRenderer {
    const button = new ButtonRenderer(this.run.bind(this))
    button.setLabel("play_arrow", true);
    button.setID("control_button_run");
    return button;
  }
  private setupPauseButton(): ButtonRenderer {
    const button = new ButtonRenderer(this.pause.bind(this))
    button.setLabel("pause", true);
    button.setID("control_button_pause");
    button.disable();
    return button;
  }
  private setupStopButton(): ButtonRenderer {
    const button = new ButtonRenderer(this.stop.bind(this))
    button.setLabel("stop", true);
    button.setID("control_button_stop");
    button.disable();
    return button;
  }
  private formatTime(time: number): string {
    let hours: number = Math.floor(time/3600);
    let minutes: number = Math.floor(time/60) % 60;
    let seconds: number = Math.round(time) % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  refresh(): void {
    this.#timer_element.innerHTML = this.formatTime(this.#controller.getTimeElapsed());
  }
  run(): void {
    this.#controller.run();
    this.#run_button.disable();
    this.#pause_button.disable(false);
    this.#stop_button.disable(false);
  }
  pause(): void {
    this.#controller.pause();
    this.#run_button.disable(false);
    this.#pause_button.disable();
    this.#stop_button.disable(false);
  }
  stop(): void {
    this.#controller.stop();
    this.#run_button.disable(false);
    this.#pause_button.disable();
    this.#stop_button.disable();
    this.refresh();
  }
  remove(): void {
    this.#run_button.remove();
    this.#pause_button.remove();
    this.#stop_button.remove();
    this.getElement().removeChild(this.#timer_element);
    super.remove();
  }
};

enum AnimationControllerState {
  Stopped,
  Running,
  Paused
};

enum AnimationControllerEvent {
  Update,
  Add_Particle,
  Delete_Particle,
  Overwrite_Groups
};

type AnimationControllerEventPayloadMap = {
  [AnimationControllerEvent.Update]: void | undefined;
  [AnimationControllerEvent.Add_Particle]: { particle: Particle };
  [AnimationControllerEvent.Delete_Particle]: { particle: Particle };
  [AnimationControllerEvent.Overwrite_Groups]: void | undefined;
};

class AnimationController {
  #simulation: Simulation;
  #container: BoxSpace;           // saved directly because of frame-by-frame calls
  #environment: SimEnvironment;   // saved directly because of frame-by-frame calls
  // #config: SimConfig;             // saved directly because of frame-by-frame calls
  #particle_list: Particle[];     // saved directly because of frame-by-frame calls
  #state: AnimationControllerState;  // for the timer renderer
  #time_elapsed: number = 0;  // in total number of seconds

  #frame_id: number;

  #time_previous: number = 0;
  #time_paused: number = 0;

  #observers: ObserverHandler<typeof AnimationControllerEvent, AnimationControllerEventPayloadMap>;

  constructor(simulation: Simulation) {
    this.#simulation = simulation;
    this.#container = structuredCloneCustom(simulation.getContainer());
    this.#environment = structuredCloneCustom(simulation.getEnvironment());
    // this.#config = structuredCloneCustom(simulation.getConfig());
    this.#particle_list = simulation.getParticlesHandler().getAllParticles();
    this.#state = AnimationControllerState.Stopped;

    this.#frame_id = performance.now();

    this.step = this.step.bind(this);

    this.#observers = new ObserverHandler(AnimationControllerEvent);

    this.setupSimObservers(simulation);
    this.setupParticleHandlerObservers(simulation.getParticlesHandler());
  }
  private setupSimObservers(simulation: Simulation): void {
    const sim_obs = simulation.getObservers();
    sim_obs.add(SimEvent.Update_Container, () => {
      this.#container = structuredCloneCustom(simulation.getContainer());
    });
    sim_obs.add(SimEvent.Update_Environment, () => {
      this.#environment = structuredCloneCustom(simulation.getEnvironment());
    });
    // sim_obs.add(SimEvent.Update_Config, () => {
    //   this.#config = structuredCloneCustom(simulation.getConfig());
    // });
  }
  private setupParticleHandlerObservers(particles_handler: ParticlesHandler): void {
    const handler_obs = particles_handler.getObservers();
    handler_obs.add(
      ParticleHandlerEvent.Overwrite_Groups, 
      () => {
        this.overwriteParticles(particles_handler)
      }
    );
    handler_obs.add(
      ParticleHandlerEvent.Add_Group,
      (payload) => {
        this.setupGroupObservers(payload.group);
      }
    );
    particles_handler.getGroups().forEach((group) => {
      this.setupGroupObservers(group);
    });
  }
  private setupGroupObservers(group: ParticleGroup): void {  
    // AnimationController should only care about events where particles are created or 
    // deleted to include in its animation loop, which are all in ParticleGroup
    const group_obs = group.getObservers();
    const this_obs = this.#observers;
    group_obs.add(
      ParticleGroupEvent.Add_Particle, 
      (payload) => {
        this.addToParticlesList(payload.particle);
        this_obs.notify(AnimationControllerEvent.Add_Particle, payload);
      }
    );
    group_obs.add(
      ParticleGroupEvent.Delete_Particle, 
      (payload) => {
        this.removeFromParticlesList(payload.particle);
        this_obs.notify(AnimationControllerEvent.Delete_Particle, payload);
      }
    );
  }
  private overwriteParticles(particles_handler: ParticlesHandler): void {
    // Assume that the previous groups have already been wiped from particles_handler
    particles_handler.getGroups().forEach((group) => {
      this.setupGroupObservers(group);
    })
    this.#particle_list.length = 0;
    this.#particle_list = particles_handler.getAllParticles();
    this.step = this.step.bind(this);
  }
  private addToParticlesList(particle: Particle): void {
    this.#particle_list.push(particle);
    this.step = this.step.bind(this);
  }
  private removeFromParticlesList(particle: Particle): void {
    const index = this.#particle_list.findIndex(p => p === particle);
    if (index === -1) throw new Error("Particle not found in AnimationController's particle list.");
    this.#particle_list.splice(index, 1);
    this.step = this.step.bind(this);
  }

  private step(timestamp: DOMHighResTimeStamp): void {
    if (this.#time_previous === 0) this.#time_previous = timestamp;
    const dt = Math.min((timestamp - this.#time_previous) / 1000, 1 / 60);
    this.#time_previous = timestamp;
    this.#time_elapsed += dt;

    this.#observers.notify(AnimationControllerEvent.Update, undefined);
  
    // Collision
    this.#particle_list.forEach((particle) => {  
      particle.rungekuttaMove(this.#environment, dt);
      if (particle.collideContainer(this.#container) && particle.enable_path_tracing) {
        // TODO, path tracing not as urgent right now
      };
  
      this.#particle_list.forEach((other_particle) => {
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
    if (!this.#particle_list.length || this.#state === AnimationControllerState.Running) return;
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

    this.#simulation.setPreset(DEFAULT_PRESET);
  }

  getState(): AnimationControllerState {
    return this.#state;
  }
  getTimeElapsed(): number {
    return this.#time_elapsed;
  }
  getObservers(): ObserverHandler<typeof AnimationControllerEvent, AnimationControllerEventPayloadMap> {
    return this.#observers;
  }
};

export {
  AnimationControllerEvent,
  AnimationControllerRenderer,
  AnimationController
};