enum ParticleEvent {
  Update,
  Update_Particle_Groups,
  Update_Particle
};

type ParticleEventPayload =
  | { operation: "add"; data: Particle | ParticleGroup; data2?: ParticleGroup }
  | { operation: "edit"; data: Particle | ParticleGroup; data2?: { [K in keyof ParticleGrouping]: boolean } }
  | { operation: "delete"; data: string }
  | { operation: "overwrite"; data?: undefined };

class ParticlesHandler {
  #groups: Map<string, ParticleGroup>;
  #observers: Map<ParticleEvent, Set<(payload?: ParticleEventPayload) => void>>;

  constructor(preset_groups?: Map<string, { grouping: ParticleGrouping, size: number }>) {
    this.#groups = new Map();
    if (preset_groups) {
      for (const [id, group] of preset_groups) {
        this.#groups.set(id, new ParticleGroup(group.grouping, group.size));
      }
    }
    this.#observers = new Map();
    Object.keys(ParticleEvent).forEach((_, event) => {
      this.#observers.set(event, new Set());
    });
  }

  add_observer(event: ParticleEvent, callback: (payload?: ParticleEventPayload) => void): void {
    this.#observers.get(event)!.add(callback);
  }
  remove_observer(event: ParticleEvent, callback: (payload?: ParticleEventPayload) => void): void {
    this.#observers.get(event)!.delete(callback);
  }
  private notify_observers(...events: { type: ParticleEvent; payload?: ParticleEventPayload }[]): void {
    events.forEach(({ type, payload }) => {
      this.#observers.get(type)!.forEach(callback => callback(payload));
    });
  }

  addGroup(grouping: ParticleGrouping): void {  
    // Assumes that string group_id has valid formatting: i.e. no spaces, alphanumeric.
    if (this.#groups.has(grouping.group_id)) {
      throw new Error(`Group name: ${grouping.group_id} already exists.`);
    }
    const group = new ParticleGroup(grouping, 0);
    this.#groups.set(grouping.group_id, group);
    this.notify_observers(
      { type: ParticleEvent.Update }, 
      { type: ParticleEvent.Update_Particle_Groups, payload: { operation: "add", data: group }}
    );
  }
  editGroup(group_id: string, grouping: ParticleGrouping): void {
    const group = this.#groups.get(group_id);
    if (!group) throw new Error(`Group name: ${group_id} not found`);
    const changes_log = group.setGrouping(grouping);
    this.notify_observers(
      { type: ParticleEvent.Update }, 
      { type: ParticleEvent.Update_Particle_Groups, payload: { operation: "edit", data: group, data2: changes_log }}
    );
  }
  deleteGroup(group_id: string): void {
    const group = this.#groups.get(group_id);
    this.notify_observers(
      { type: ParticleEvent.Update }, 
      { type: ParticleEvent.Update_Particle_Groups, payload: { operation: "delete", data: group_id }}
    );
    this.#groups.delete(group_id);
    if (group) group.getParticles().length = 0;
  }
  overwriteGroups(preset_groups: Map<string, { grouping: ParticleGrouping, size: number }>): void {
    this.#groups.clear();
    for (const [id, group] of preset_groups) {
      this.#groups.set(id, new ParticleGroup(group.grouping, group.size));
    }
    this.notify_observers(
      { type: ParticleEvent.Update }, 
      { type: ParticleEvent.Update_Particle_Groups, payload: { operation: "overwrite" }}
    );
  }
  addParticle(particle: Particle, group: ParticleGroup): void {
    group.addParticle(particle);
    this.notify_observers(
      { type: ParticleEvent.Update }, 
      { type: ParticleEvent.Update_Particle, payload: { operation: "add", data: particle, data2: group }}
    );
  }
  editParticle(particle: Particle): void {
    // TODO
  }
  deleteParticle(id: string): void {
    // TODO, remove from group
  }
  getGroups(): Map<string, ParticleGroup> {
    return this.#groups;
  }
  getAllParticles(): Particle[] { 
    const particles: Particle[] = [];
    this.#groups.forEach(group => {
      particles.push(...group.getParticles());
    });
    return particles;
  }
}