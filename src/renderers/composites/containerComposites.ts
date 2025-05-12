const VECTOR_VISUAL_SCALE_FACTOR = 1 / 10000;

class ZVectorField {
  #arrows: ZArrowSprite[][];
  #magnitude: number;

  constructor(container: BoxSpace, width_between: number, offset: number, magnitude: number = 1, color: string = 'black') {
    if (width_between < 15)
      throw new Error("Invalid width between arrows.");
    this.#arrows = [];
    const is_pointing_up = magnitude >= 0;
    this.#magnitude = magnitude;
    for (let j = 1.5*container.y_min + offset; j < 1.5*container.y_max - offset; j += width_between) {
      const row: ZArrowSprite[] = [];
      for (let i = 1.5*container.x_min + offset; i < 1.5*container.x_max - offset; i += width_between) {
        const arrow = new ZArrowSprite(is_pointing_up);
        arrow
          .translate({
            x: i - container.x_min, 
            y: j - container.y_min
          })
          .slowScale(VECTOR_VISUAL_SCALE_FACTOR*Math.abs(magnitude));
        arrow.setColor(color);
        row.push(arrow)
      }
      this.#arrows.push(row);
    }
  }
  setArrowsParent(parent: Renderer): void {
    this.#arrows.forEach(row => row.forEach(arrow => arrow.setParent(parent)));
  }
  setMagnitude(magnitude: number): void {
    if (this.#magnitude === magnitude) return;
    this.#magnitude = magnitude;
    this.#arrows.forEach(row => row.forEach(arrow => {
      arrow.slowScale(VECTOR_VISUAL_SCALE_FACTOR*Math.abs(magnitude)).pointUp(magnitude >= 0);
    }));
  }
  setColor(color: string): void {
    this.#arrows.forEach(row => row.forEach(arrow => arrow.setColor(color)));
  }
  getMagnitude(): number {
    return this.#magnitude;
  }
  getArrows(): ZArrowSprite[][] {
    return this.#arrows;
  }
  clear(): void {
    this.#arrows.forEach(row => row.forEach(arrow => arrow.remove()));
    this.#arrows.length = 0;
  }
}

class XYVectorField {
  #arrows: XYArrowSprite[][];
  #angle: number;
  #magnitude: number;

  constructor(container: BoxSpace, width_between: number, offset: number, angle: number = 0, magnitude: number = 1, color: string = 'black') {
    if (width_between < 15)
      throw new Error("Invalid width between arrows.");
    this.#arrows = [];
    this.#angle = angle;
    this.#magnitude = magnitude;
    const negative_offset = magnitude < 0 ? 180 : 0;
    for (let j = 1.5*container.y_min + offset; j < 1.5*container.y_max - offset; j += width_between) {
      const row: XYArrowSprite[] = [];
      for (let i = 1.5*container.x_min + offset; i < 1.5*container.x_max - offset; i += width_between) {
        const arrow = new XYArrowSprite();
        arrow
          .translate({
            x: i - container.x_min, 
            y: j - container.y_min
          })
          .slowScale(VECTOR_VISUAL_SCALE_FACTOR*Math.abs(magnitude))
          .rotate(this.#angle + negative_offset);
        arrow.setColor(color);
        row.push(arrow)
      }
      this.#arrows.push(row);
    }
  }
  setArrowsParent(parent: Renderer): void {
    this.#arrows.forEach(row => row.forEach(arrow => arrow.setParent(parent)));
  }
  pointAt(direction: {x: number, y: number} | Vector2D | number): void {
    const negative_offset = this.#magnitude < 0 ? 180 : 0;
    if (typeof direction === 'number') {  // If direction is already an angle
      this.#arrows.forEach(row => row.forEach(arrow => arrow.rotate(direction + negative_offset)));
      this.#angle = direction;
    }
    else {
      const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);
      this.#arrows.forEach(row => row.forEach(arrow => arrow.rotate(angle + negative_offset)));
      this.#angle = angle;
    }
  }
  setMagnitude(magnitude: number): void {
    const negative_offset = magnitude < 0 ? 180 : 0;
    if (this.#magnitude === magnitude) return;
    this.#magnitude = magnitude;
    this.#arrows.forEach(row => row.forEach(arrow => {
      arrow
        .slowScale(VECTOR_VISUAL_SCALE_FACTOR*Math.abs(magnitude))
        .rotate(this.#angle + negative_offset);
    }));
  }
  setColor(color: string): void {
    this.#arrows.forEach(row => row.forEach(arrow => arrow.setColor(color)));
  }
  getAngle(): number {
    return this.#angle;
  }
  getMagnitude(): number {
    return this.#magnitude;
  }
  getArrows(): XYArrowSprite[][] {
    return this.#arrows;
  }
  clear(): void {
    this.#arrows.forEach(row => row.forEach(arrow => arrow.remove()));
    this.#arrows.length = 0;
  }
}