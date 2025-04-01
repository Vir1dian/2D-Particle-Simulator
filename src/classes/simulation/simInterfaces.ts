interface SimEnvironment {
  statics?: {
    elasticity?: number,
    drag?: number,
    gravity?: Vector2D,
    electric_field?: Vector2D,
    magnetic_field?: Vector2D
  }
  dynamics?: {
    // for the future
  }
}

interface SimConfig {
  path_trace_step?: number,
  is_draggable?: boolean,
  focus_color?: string
}

// Used to structure the contents of Simulation class
interface SimPreset {
  container?: BoxSpace;
  environment?: SimEnvironment;
  config?: SimConfig;
  particle_groups?: Map<string, { grouping: ParticleGrouping, size: number}>;
}

