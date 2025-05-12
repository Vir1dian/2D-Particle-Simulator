class Sprite extends Renderer {
  #translation: Vector2D;
  #rotation: number;
  #scale: Vector2D;
  constructor(classname = '', id = '') {
    const element = document.createElement('div');
    super(element, classname, id);
    this.getElement().style.position = "absolute";
    this.#translation = new Vector2D();
    this.#rotation = 0;
    this.#scale = new Vector2D(1, 1);
  }
  private applyTransform() {
    const translate = `translate(${this.#translation.x}px, ${this.#translation.y}px)`;
    const rotate = `rotate(${this.#rotation}deg)`;
    const scale = `scale(${this.#scale.x}, ${this.#scale.y})`;
    this.getElement().style.transform = `${translate} ${rotate} ${scale}`;
  }
  setStyle(styles: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.getElement().style, styles);
  }
  translate(translation: {x: number, y: number} | Vector2D): this {
    this.#translation = new Vector2D(translation.x, translation.y);
    this.applyTransform();
    return this;  // allows chaining transform calls in one line
  }
  rotate(rotation: number): this {
    this.#rotation = rotation;
    this.applyTransform();
    return this;
  }
  scale(scale: {x: number, y: number} | Vector2D): this {
    this.#scale = new Vector2D(scale.x, scale.y);
    this.applyTransform();
    return this;
  }
  reset(): void {
    this.getElement().style.transform = 'none';
  }
  getTranslation(): Vector2D {
    return this.#translation;
  }
  getRotation(): number {
    return this.#rotation;
  }
  getScale(): Vector2D {
    return this.#scale;
  }
}

class ZArrowSprite extends Sprite {

}

class XYArrowSprite extends Sprite {

}