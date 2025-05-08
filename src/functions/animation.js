"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AnimationControllerRenderer_controller, _AnimationControllerRenderer_timer_element, _AnimationControllerRenderer_run_button, _AnimationControllerRenderer_pause_button, _AnimationControllerRenderer_stop_button, _AnimationController_simulation, _AnimationController_container, _AnimationController_environment, _AnimationController_config, _AnimationController_particle_list, _AnimationController_state, _AnimationController_time_elapsed, _AnimationController_frame_id, _AnimationController_time_previous, _AnimationController_time_paused, _AnimationController_observers;
class AnimationControllerRenderer extends Renderer {
    constructor(controller) {
        const wrapper = document.createElement('div');
        super(wrapper, '', "control_timer");
        _AnimationControllerRenderer_controller.set(this, void 0);
        _AnimationControllerRenderer_timer_element.set(this, void 0);
        _AnimationControllerRenderer_run_button.set(this, void 0);
        _AnimationControllerRenderer_pause_button.set(this, void 0);
        _AnimationControllerRenderer_stop_button.set(this, void 0);
        // Saved Data
        __classPrivateFieldSet(this, _AnimationControllerRenderer_controller, controller, "f");
        __classPrivateFieldSet(this, _AnimationControllerRenderer_timer_element, this.SetupTimerElement(controller.getTimeElapsed()), "f");
        __classPrivateFieldSet(this, _AnimationControllerRenderer_run_button, this.SetupRunButton(), "f");
        __classPrivateFieldSet(this, _AnimationControllerRenderer_pause_button, this.SetupPauseButton(), "f");
        __classPrivateFieldSet(this, _AnimationControllerRenderer_stop_button, this.SetupStopButton(), "f");
        this.setupObservers(controller);
        // DOM Content
        const wrapper_table = document.createElement('table');
        const timer_wrapper_row = document.createElement('tr');
        const cell0 = document.createElement('td');
        cell0.colSpan = 3;
        cell0.appendChild(__classPrivateFieldGet(this, _AnimationControllerRenderer_timer_element, "f"));
        timer_wrapper_row.appendChild(cell0);
        const buttons_wrapper_row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        const cell3 = document.createElement('td');
        __classPrivateFieldGet(this, _AnimationControllerRenderer_run_button, "f").setParent(cell1);
        __classPrivateFieldGet(this, _AnimationControllerRenderer_pause_button, "f").setParent(cell2);
        __classPrivateFieldGet(this, _AnimationControllerRenderer_stop_button, "f").setParent(cell3);
        buttons_wrapper_row.appendChild(cell1);
        buttons_wrapper_row.appendChild(cell2);
        buttons_wrapper_row.appendChild(cell3);
        wrapper_table.appendChild(timer_wrapper_row);
        wrapper_table.appendChild(buttons_wrapper_row);
        wrapper.appendChild(wrapper_table);
    }
    setupObservers(controller) {
        const obs = controller.getObservers();
        obs.add(AnimationControllerEvent.Update, () => { this.refresh(); });
    }
    SetupTimerElement(time_elapsed) {
        const timer_element = document.createElement('div');
        timer_element.id = "animation_timer";
        timer_element.innerHTML = this.FormatTime(time_elapsed);
        return timer_element;
    }
    SetupRunButton() {
        const button = new ButtonRenderer(this.run.bind(this));
        button.setLabel("play_arrow", true);
        button.setID("control_button_run");
        return button;
    }
    SetupPauseButton() {
        const button = new ButtonRenderer(this.pause.bind(this));
        button.setLabel("pause", true);
        button.setID("control_button_pause");
        button.disable();
        return button;
    }
    SetupStopButton() {
        const button = new ButtonRenderer(this.stop.bind(this));
        button.setLabel("stop", true);
        button.setID("control_button_stop");
        button.disable();
        return button;
    }
    FormatTime(time) {
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor(time / 60) % 60;
        let seconds = Math.round(time) % 60;
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    refresh() {
        __classPrivateFieldGet(this, _AnimationControllerRenderer_timer_element, "f").innerHTML = this.FormatTime(__classPrivateFieldGet(this, _AnimationControllerRenderer_controller, "f").getTimeElapsed());
    }
    run() {
        __classPrivateFieldGet(this, _AnimationControllerRenderer_controller, "f").run();
        __classPrivateFieldGet(this, _AnimationControllerRenderer_run_button, "f").disable();
        __classPrivateFieldGet(this, _AnimationControllerRenderer_pause_button, "f").disable(false);
        __classPrivateFieldGet(this, _AnimationControllerRenderer_stop_button, "f").disable(false);
    }
    pause() {
        __classPrivateFieldGet(this, _AnimationControllerRenderer_controller, "f").pause();
        __classPrivateFieldGet(this, _AnimationControllerRenderer_run_button, "f").disable(false);
        __classPrivateFieldGet(this, _AnimationControllerRenderer_pause_button, "f").disable();
        __classPrivateFieldGet(this, _AnimationControllerRenderer_stop_button, "f").disable(false);
    }
    stop() {
        __classPrivateFieldGet(this, _AnimationControllerRenderer_controller, "f").stop();
        __classPrivateFieldGet(this, _AnimationControllerRenderer_run_button, "f").disable(false);
        __classPrivateFieldGet(this, _AnimationControllerRenderer_pause_button, "f").disable();
        __classPrivateFieldGet(this, _AnimationControllerRenderer_stop_button, "f").disable();
        this.refresh();
    }
    remove() {
        __classPrivateFieldGet(this, _AnimationControllerRenderer_run_button, "f").remove();
        __classPrivateFieldGet(this, _AnimationControllerRenderer_pause_button, "f").remove();
        __classPrivateFieldGet(this, _AnimationControllerRenderer_stop_button, "f").remove();
        this.getElement().removeChild(__classPrivateFieldGet(this, _AnimationControllerRenderer_timer_element, "f"));
        super.remove();
    }
}
_AnimationControllerRenderer_controller = new WeakMap(), _AnimationControllerRenderer_timer_element = new WeakMap(), _AnimationControllerRenderer_run_button = new WeakMap(), _AnimationControllerRenderer_pause_button = new WeakMap(), _AnimationControllerRenderer_stop_button = new WeakMap();
var AnimationControllerState;
(function (AnimationControllerState) {
    AnimationControllerState[AnimationControllerState["Stopped"] = 0] = "Stopped";
    AnimationControllerState[AnimationControllerState["Running"] = 1] = "Running";
    AnimationControllerState[AnimationControllerState["Paused"] = 2] = "Paused";
})(AnimationControllerState || (AnimationControllerState = {}));
var AnimationControllerEvent;
(function (AnimationControllerEvent) {
    AnimationControllerEvent[AnimationControllerEvent["Update"] = 0] = "Update";
    AnimationControllerEvent[AnimationControllerEvent["Add_Particle"] = 1] = "Add_Particle";
    AnimationControllerEvent[AnimationControllerEvent["Delete_Particle"] = 2] = "Delete_Particle";
    AnimationControllerEvent[AnimationControllerEvent["Overwrite_Groups"] = 3] = "Overwrite_Groups";
})(AnimationControllerEvent || (AnimationControllerEvent = {}));
class AnimationController {
    constructor(simulation) {
        _AnimationController_simulation.set(this, void 0);
        _AnimationController_container.set(this, void 0); // saved directly because of frame-by-frame calls
        _AnimationController_environment.set(this, void 0); // saved directly because of frame-by-frame calls
        _AnimationController_config.set(this, void 0); // saved directly because of frame-by-frame calls
        _AnimationController_particle_list.set(this, void 0); // saved directly because of frame-by-frame calls
        _AnimationController_state.set(this, void 0);
        _AnimationController_time_elapsed.set(this, 0); // in total number of seconds
        _AnimationController_frame_id.set(this, void 0);
        _AnimationController_time_previous.set(this, 0);
        _AnimationController_time_paused.set(this, 0);
        _AnimationController_observers.set(this, void 0); // for the timer renderer
        __classPrivateFieldSet(this, _AnimationController_simulation, simulation, "f");
        __classPrivateFieldSet(this, _AnimationController_container, structuredCloneCustom(simulation.getContainer()), "f");
        __classPrivateFieldSet(this, _AnimationController_environment, structuredCloneCustom(simulation.getEnvironment()), "f");
        __classPrivateFieldSet(this, _AnimationController_config, structuredCloneCustom(simulation.getConfig()), "f");
        __classPrivateFieldSet(this, _AnimationController_particle_list, simulation.getParticlesHandler().getAllParticles(), "f");
        __classPrivateFieldSet(this, _AnimationController_state, AnimationControllerState.Stopped, "f");
        __classPrivateFieldSet(this, _AnimationController_frame_id, performance.now(), "f");
        this.step = this.step.bind(this);
        __classPrivateFieldSet(this, _AnimationController_observers, new ObserverHandler(AnimationControllerEvent), "f");
        this.setupSimObservers(simulation);
        this.setupParticleHandlerObservers(simulation.getParticlesHandler());
    }
    setupSimObservers(simulation) {
        const sim_obs = simulation.getObservers();
        sim_obs.add(SimEvent.Update_Container, () => {
            __classPrivateFieldSet(this, _AnimationController_container, structuredCloneCustom(simulation.getContainer()), "f");
        });
        sim_obs.add(SimEvent.Update_Environment, () => {
            __classPrivateFieldSet(this, _AnimationController_environment, structuredCloneCustom(simulation.getEnvironment()), "f");
        });
        sim_obs.add(SimEvent.Update_Config, () => {
            __classPrivateFieldSet(this, _AnimationController_config, structuredCloneCustom(simulation.getConfig()), "f");
        });
    }
    setupParticleHandlerObservers(particles_handler) {
        const handler_obs = particles_handler.getObservers();
        handler_obs.add(ParticleHandlerEvent.Overwrite_Groups, () => {
            this.overwriteParticles(particles_handler);
        });
        handler_obs.add(ParticleHandlerEvent.Add_Group, (payload) => {
            this.setupGroupObservers(payload.group);
        });
        handler_obs.add(ParticleHandlerEvent.Delete_Group, (payload) => {
            payload.group.clear();
        });
        particles_handler.getGroups().forEach((group) => {
            this.setupGroupObservers(group);
        });
    }
    setupGroupObservers(group) {
        // AnimationController should only care about events where particles are created or 
        // deleted to include in its animation loop, which are all in ParticleGroup
        const group_obs = group.getObservers();
        const this_obs = __classPrivateFieldGet(this, _AnimationController_observers, "f");
        group_obs.add(ParticleGroupEvent.Add_Particle, (payload) => {
            this.addToParticlesList(payload.particle);
            this_obs.notify(AnimationControllerEvent.Add_Particle, payload);
        });
        group_obs.add(ParticleGroupEvent.Delete_Particle, (payload) => {
            this.removeFromParticlesList(payload.particle);
            this_obs.notify(AnimationControllerEvent.Delete_Particle, payload);
        });
    }
    overwriteParticles(particles_handler) {
        // Assume that the previous groups have already been wiped from particles_handler
        particles_handler.getGroups().forEach((group) => {
            this.setupGroupObservers(group);
        });
        __classPrivateFieldGet(this, _AnimationController_particle_list, "f").length = 0;
        __classPrivateFieldSet(this, _AnimationController_particle_list, particles_handler.getAllParticles(), "f");
        this.step = this.step.bind(this);
    }
    addToParticlesList(particle) {
        __classPrivateFieldGet(this, _AnimationController_particle_list, "f").push(particle);
        this.step = this.step.bind(this);
    }
    removeFromParticlesList(particle) {
        const index = __classPrivateFieldGet(this, _AnimationController_particle_list, "f").findIndex(p => p === particle);
        if (index === -1)
            throw new Error("Particle not found in AnimationController's particle list.");
        __classPrivateFieldGet(this, _AnimationController_particle_list, "f").splice(index, 1);
        this.step = this.step.bind(this);
    }
    step(timestamp) {
        if (__classPrivateFieldGet(this, _AnimationController_time_previous, "f") === 0)
            __classPrivateFieldSet(this, _AnimationController_time_previous, timestamp, "f");
        const dt = Math.min((timestamp - __classPrivateFieldGet(this, _AnimationController_time_previous, "f")) / 1000, 1 / 60);
        __classPrivateFieldSet(this, _AnimationController_time_previous, timestamp, "f");
        __classPrivateFieldSet(this, _AnimationController_time_elapsed, __classPrivateFieldGet(this, _AnimationController_time_elapsed, "f") + dt, "f");
        __classPrivateFieldGet(this, _AnimationController_observers, "f").notify(AnimationControllerEvent.Update, undefined);
        // Collision
        __classPrivateFieldGet(this, _AnimationController_particle_list, "f").forEach((particle) => {
            particle.move(__classPrivateFieldGet(this, _AnimationController_environment, "f"), dt, __classPrivateFieldGet(this, _AnimationController_time_elapsed, "f"));
            if (particle.collideContainer(__classPrivateFieldGet(this, _AnimationController_container, "f")) && particle.enable_path_tracing) {
                // TODO, path tracing not as urgent right now
            }
            ;
            __classPrivateFieldGet(this, _AnimationController_particle_list, "f").forEach((other_particle) => {
                if (other_particle !== particle) {
                    if (particle.collideParticle(other_particle, __classPrivateFieldGet(this, _AnimationController_environment, "f").statics.elasticity)) {
                        if (particle.enable_path_tracing) {
                            // TODO, path tracing not as urgent right now
                        }
                        if (other_particle.enable_path_tracing) {
                            // TODO, path tracing not as urgent right now
                        }
                    }
                }
            });
        });
        this.loop();
    }
    loop() {
        __classPrivateFieldSet(this, _AnimationController_frame_id, window.requestAnimationFrame(this.step), "f");
    }
    startLoop() {
        window.requestAnimationFrame(this.step);
    }
    endLoop() {
        cancelAnimationFrame(__classPrivateFieldGet(this, _AnimationController_frame_id, "f"));
    }
    run() {
        // ignore if simulation has no particles
        if (!__classPrivateFieldGet(this, _AnimationController_particle_list, "f").length || __classPrivateFieldGet(this, _AnimationController_state, "f") === AnimationControllerState.Running)
            return;
        if (__classPrivateFieldGet(this, _AnimationController_time_paused, "f")) {
            const pause_duration = (performance.now() - __classPrivateFieldGet(this, _AnimationController_time_paused, "f")) / 1000;
            __classPrivateFieldSet(this, _AnimationController_time_previous, __classPrivateFieldGet(this, _AnimationController_time_previous, "f") + pause_duration * 1000, "f");
            __classPrivateFieldSet(this, _AnimationController_time_paused, 0, "f");
        }
        // Change animation state
        __classPrivateFieldSet(this, _AnimationController_state, AnimationControllerState.Running, "f");
        this.startLoop();
    }
    pause() {
        if (__classPrivateFieldGet(this, _AnimationController_state, "f") === AnimationControllerState.Paused || __classPrivateFieldGet(this, _AnimationController_state, "f") === AnimationControllerState.Stopped)
            return;
        // Record the pause time
        if (__classPrivateFieldGet(this, _AnimationController_time_elapsed, "f")) {
            __classPrivateFieldSet(this, _AnimationController_time_paused, performance.now(), "f");
        }
        // Change animation state
        __classPrivateFieldSet(this, _AnimationController_state, AnimationControllerState.Paused, "f");
        this.endLoop();
    }
    stop() {
        // Change animation state
        __classPrivateFieldSet(this, _AnimationController_time_elapsed, 0, "f");
        __classPrivateFieldSet(this, _AnimationController_time_previous, 0, "f");
        __classPrivateFieldSet(this, _AnimationController_time_paused, 0, "f");
        __classPrivateFieldSet(this, _AnimationController_state, AnimationControllerState.Stopped, "f");
        this.endLoop();
        __classPrivateFieldGet(this, _AnimationController_simulation, "f").setPreset(DEFAULT_PRESET);
    }
    getState() {
        return __classPrivateFieldGet(this, _AnimationController_state, "f");
    }
    getTimeElapsed() {
        return __classPrivateFieldGet(this, _AnimationController_time_elapsed, "f");
    }
    getObservers() {
        return __classPrivateFieldGet(this, _AnimationController_observers, "f");
    }
}
_AnimationController_simulation = new WeakMap(), _AnimationController_container = new WeakMap(), _AnimationController_environment = new WeakMap(), _AnimationController_config = new WeakMap(), _AnimationController_particle_list = new WeakMap(), _AnimationController_state = new WeakMap(), _AnimationController_time_elapsed = new WeakMap(), _AnimationController_frame_id = new WeakMap(), _AnimationController_time_previous = new WeakMap(), _AnimationController_time_paused = new WeakMap(), _AnimationController_observers = new WeakMap();
