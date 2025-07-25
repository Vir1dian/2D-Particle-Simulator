import { VECTOR_VISUAL_SCALE_FACTOR, OVERFLOW_OFFSET } from "../../../functions/utilities";
import { Vector2D } from "../../entities/vector2D";
import type { BoxSpace } from "../../entities/simulation/simInterfaces";
import { Renderer } from "../renderer";
import { ZArrowSprite, XYArrowSprite } from "../sprite";

class ZVectorField {
  #arrows: ZArrowSprite[][];
  #magnitude: number;

  constructor(container: BoxSpace, width_between: number, offset: number, magnitude: number = 1, color: string = 'black') {
    if (width_between < 15)
      throw new Error("Invalid width between arrows.");
    this.#arrows = this.draw(container, width_between, offset, magnitude, color);
    this.#magnitude = magnitude;
  }
  private draw(container: BoxSpace, width_between: number, offset: number, magnitude: number = 1, color: string = 'black'): ZArrowSprite[][] {
    const arrows: ZArrowSprite[][] = [];
    const is_pointing_up = magnitude >= 0;
    const scale = VECTOR_VISUAL_SCALE_FACTOR * Math.abs(magnitude);
    for (let j = OVERFLOW_OFFSET*container.y_min + offset; j < OVERFLOW_OFFSET*container.y_max - offset; j += width_between) {
      const row: ZArrowSprite[] = [];
      for (let i = OVERFLOW_OFFSET*container.x_min + offset; i < OVERFLOW_OFFSET*container.x_max - offset; i += width_between) {
        const arrow = new ZArrowSprite(is_pointing_up);
        arrow
          .translate({
            x: i - container.x_min, 
            y: j - container.y_min
          })
          .slowScale(scale);
        arrow.setColor(color);
        row.push(arrow)
      }
      arrows.push(row);
    }
    return arrows;
  }
  redraw(container: BoxSpace, width_between: number, offset: number, magnitude: number = 1, color: string = 'black'): void {
    this.clear();
    this.#arrows = this.draw(container, width_between, offset, magnitude, color);
    this.#magnitude = magnitude;
  }
  setArrowsParent(parent: Renderer): void {
    this.#arrows.forEach(row => row.forEach(arrow => arrow.setParent(parent)));
  }
  setMagnitude(magnitude: number): void {
    const scale = VECTOR_VISUAL_SCALE_FACTOR * Math.abs(magnitude);
    if (this.#magnitude === magnitude) return;
    this.#magnitude = magnitude;
    this.#arrows.forEach(row => row.forEach(arrow => {
      arrow.slowScale(scale).pointUp(magnitude >= 0);
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
};

class XYVectorField {
  #arrows: XYArrowSprite[][];
  #angle: number;
  #magnitude: number;

  constructor(container: BoxSpace, width_between: number, offset: number, angle: number = 0, magnitude: number = 1, color: string = 'black') {
    if (width_between < 15)
      throw new Error("Invalid width between arrows.");
    this.#arrows = this.draw(container, width_between, offset, angle, magnitude, color);
    this.#angle = angle;
    this.#magnitude = magnitude;
  }
  private draw(container: BoxSpace, width_between: number, offset: number, angle: number = 0, magnitude: number = 1, color: string = 'black'): XYArrowSprite[][] {
    const arrows: XYArrowSprite[][] = [];
    const negative_offset = magnitude < 0 ? 180 : 0;
    const scale = VECTOR_VISUAL_SCALE_FACTOR * Math.abs(magnitude);
    for (let j = OVERFLOW_OFFSET*container.y_min + offset; j < OVERFLOW_OFFSET*container.y_max - offset; j += width_between) {
      const row: XYArrowSprite[] = [];
      for (let i = OVERFLOW_OFFSET*container.x_min + offset; i < OVERFLOW_OFFSET*container.x_max - offset; i += width_between) {
        const arrow = new XYArrowSprite();
        arrow
          .translate({
            x: i - container.x_min, 
            y: j - container.y_min
          })
          .slowScale(scale)
          .rotate(angle + negative_offset);
        arrow.setColor(color);
        row.push(arrow)
      }
      arrows.push(row);
    }
    return arrows;
  }
  redraw(container: BoxSpace, width_between: number, offset: number, angle: number = 0, magnitude: number = 1, color: string = 'black'): void {
    this.clear();
    this.#arrows = this.draw(container, width_between, offset, angle, magnitude, color);
    this.#angle = angle;
    this.#magnitude = magnitude;
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
    const scale = VECTOR_VISUAL_SCALE_FACTOR * Math.abs(magnitude);
    if (this.#magnitude === magnitude) return;
    this.#magnitude = magnitude;
    this.#arrows.forEach(row => row.forEach(arrow => {
      arrow
        .slowScale(scale)
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
};

export {
  ZVectorField,
  XYVectorField
};