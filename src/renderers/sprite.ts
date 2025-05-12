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
  protected applyTransform() {
    const translate = `translate(${this.#translation.x}px, ${this.#translation.y}px)`;
    const rotate = `rotate(${this.#rotation*-1}deg)`;
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
  /**
   * Warning: getBoundingClientRect() only works once
   * element is rendered in the DOM. Use setTimout
   * to delay translateCenter if to be used immediately. 
   */
  translateCenter(translation: {x: number, y: number} | Vector2D): this {
    const bounds = this.getElement().getBoundingClientRect();
    const offsetX = bounds.width / 2;
    const offsetY = bounds.height / 2;
    return this.translate({
      x: translation.x - offsetX,
      y: translation.y - offsetY,
    });
  }
  slowScale(magnitude: number, base = Math.E): this {
    const safe_magnitude = Math.max(0, magnitude); // Prevent negatives
    const scale_factor = safe_magnitude ** 0.1;
    this.scale({
      x: scale_factor,
      y: scale_factor
    });
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
  #is_pointing_up: boolean;
  #dot: HTMLDivElement;
  #cross: HTMLDivElement;
  constructor(is_up: boolean = true) {
    super('z_arrow_wrapper')
    const wrapper = this.getElement();
    this.#is_pointing_up = is_up;
    this.#dot = document.createElement('div');
    this.#cross = document.createElement('div');

    this.#dot.className = 'z_arrow_dot';
    this.#cross.className = 'z_arrow_cross';
    
    wrapper.appendChild(this.#dot);
    wrapper.appendChild(this.#cross);

    if (is_up) {
      this.#dot.style.display = '';
      this.#cross.style.display = 'none';
    }
    else {
      this.#dot.style.display = 'none';
      this.#cross.style.display = '';
    }
  }
  pointUp(value: boolean = true): void {
    this.#is_pointing_up = value;
    if (value) {
      this.#dot.style.display = '';
      this.#cross.style.display = 'none';
    }
    else {
      this.#dot.style.display = 'none';
      this.#cross.style.display = '';
    }
  }
  isPointingUp(): boolean {
    return this.#is_pointing_up;
  }
  setColor(color: string): void {
    this.#dot.style.backgroundColor = color;
    this.#cross.style.background = color;
  }
  remove(): void {
    this.#dot.remove();
    this.#cross.remove();
    super.remove();
  }
}

class XYArrowSprite extends Sprite {
  #head: HTMLDivElement;
  #body: HTMLDivElement;
  constructor() {
    super('xy_arrow_wrapper');
    const wrapper = this.getElement();
    this.#head = document.createElement('div');
    this.#body = document.createElement('div');

    this.#head.className = 'xy_arrow_head';
    this.#body.className = 'xy_arrow_body';

    wrapper.appendChild(this.#body);
    wrapper.appendChild(this.#head);
  }
  pointAt(direction: {x: number, y: number} | Vector2D): void {
    const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);
    this.rotate(angle);
  }
  setColor(color: string): void {
    this.#head.style.borderLeftColor = color;
    this.#body.style.background = color;
  }
  remove(): void {
    this.#head.remove();
    this.#body.remove();
    super.remove();
  }
}