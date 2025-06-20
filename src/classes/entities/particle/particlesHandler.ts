enum ParticleHandlerEvent {
  Update,
  Add_Group,
  Delete_Group,
  Overwrite_Groups
};

type ParticleHandlerEventPayloadMap = {
  [ParticleHandlerEvent.Update]: void | undefined;
  [ParticleHandlerEvent.Add_Group]: { group: ParticleGroup };
  [ParticleHandlerEvent.Delete_Group]: { group: ParticleGroup };
  [ParticleHandlerEvent.Overwrite_Groups]: void | undefined;
};

class ParticlesHandler {
  #groups: Map<string, ParticleGroup>;
  #container: BoxSpace;
  #observers: ObserverHandler<typeof ParticleHandlerEvent, ParticleHandlerEventPayloadMap>;

  constructor(preset_groups: Map<string, { grouping: ParticleGrouping, size: number }>, container: BoxSpace) {
    this.#groups = new Map();
    this.#container = container;
    for (const [id, group] of preset_groups) {
      this.#groups.set(id, new ParticleGroup(group.grouping, container, group.size));
    }
    this.#observers = new ObserverHandler(ParticleHandlerEvent);
  }

  addGroup(grouping: ParticleGrouping): void {  
    // Assumes that string group_id has valid formatting: i.e. no spaces, alphanumeric.
    if (this.#groups.has(grouping.group_id)) {
      throw new Error(`Group name: ${grouping.group_id} already exists.`);
    }
    const group = new ParticleGroup(grouping, this.#container, 0);
    this.#groups.set(grouping.group_id, group);
    this.#observers.notify(ParticleHandlerEvent.Update, undefined);
    this.#observers.notify(ParticleHandlerEvent.Add_Group, { group: group });
  }

  deleteGroup(group: ParticleGroup): void {
    if (!this.#groups.delete(group.getGrouping().group_id)) 
      throw new Error("Group not found");
    this.#observers.notify(ParticleHandlerEvent.Update, undefined);
    this.#observers.notify(ParticleHandlerEvent.Delete_Group, { group: group });  // call delete related observers first
    group.clear();  // then remove all observers
  }

  overwriteGroups(preset_groups: Map<string, { grouping: ParticleGrouping, size: number }>): void {
    for (const [id, group] of this.#groups)
      group.clear();
    this.#groups.clear();
    for (const [id, group] of preset_groups)
      this.#groups.set(id, new ParticleGroup(group.grouping, this.#container, group.size));
    this.#observers.notify(ParticleHandlerEvent.Update, undefined);
    this.#observers.notify(ParticleHandlerEvent.Overwrite_Groups, undefined);
  }

  addParticle(particle: Particle, group: ParticleGroup): void {
    group.addParticle(particle);  // Observers in the called group are notified
  }

  getGroups(): Map<string, ParticleGroup> {
    return this.#groups;
  }

  getAllParticles(): Particle[] { 
    const particles: Particle[] = [];
    this.#groups.forEach(group => {
      particles.push(...Array.from(group.getParticles().values()));
    });
    return particles;
  }
  
  getObservers(): ObserverHandler<typeof ParticleHandlerEvent, ParticleHandlerEventPayloadMap> {
    return this.#observers;
  }
}