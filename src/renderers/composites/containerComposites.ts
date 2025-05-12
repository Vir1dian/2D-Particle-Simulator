class ZVectorField {
  #arrows: ZArrowSprite[][];
  #magnitude: number;

  constructor(container: BoxSpace, width_between: number, magnitude: number = 1) {
    if (width_between < 15)
      throw new Error("Invalid width between arrows.");
    this.#arrows = [];
    const is_pointing_up = magnitude >= 0;
    this.#magnitude = magnitude;
    for (let j = container.y_min; j < container.y_max; j += width_between) {
      const row: ZArrowSprite[] = [];
      for (let i = container.x_min; i < container.x_max; i += width_between) {
        const arrow = new ZArrowSprite(is_pointing_up);
        arrow
          .translateCenter({
            x: container.x_min - i, 
            y: container.y_min - j
          })
          .slowScale(Math.abs(magnitude));
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
      arrow.slowScale(Math.abs(magnitude)).pointUp(magnitude >= 0);
    }));
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

  constructor(container: BoxSpace, width_between: number, angle: number = 0, magnitude: number = 1) {
    if (width_between < 15)
      throw new Error("Invalid width between arrows.");
    this.#arrows = [];
    this.#angle = angle;
    this.#magnitude = magnitude;
    const negative_offset = magnitude < 0 ? 180 : 0;
    for (let j = container.y_min; j < container.y_max; j += width_between) {
      const row: XYArrowSprite[] = [];
      for (let i = container.x_min; i < container.x_max; i += width_between) {
        const arrow = new XYArrowSprite();
        arrow
          .translateCenter({
            x: container.x_min - i, 
            y: container.y_min - j
          })
          .slowScale(Math.abs(magnitude))
          .rotate(this.#angle + negative_offset);
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
        .slowScale(Math.abs(magnitude))
        .rotate(this.#angle + negative_offset);
    }));
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