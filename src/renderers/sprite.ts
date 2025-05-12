class Sprite extends Renderer {
  #translate: string;
  #rotate: string;
  #scale: string;
  constructor(classname = '', id = '') {
    const element = document.createElement('div');
    super(element, classname, id);
    this.getElement().style.position = "absolute";
    this.#translate = '';
    this.#rotate = '';
    this.#scale = 'scale(1, 1)';
  }
  private applyTransform() {
    this.getElement().style.transform = `${this.#translate} ${this.#rotate} ${this.#scale}`;
  }
  setStyle(styles: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.getElement().style, styles);
  }
  translate(x: number, y: number): this {
    this.#translate = `translate(${x}px, ${y}px)`;
    this.applyTransform();
    return this;  // allows chaining transform calls in one line
  }
  rotate(deg: number): this {
    this.#rotate = `rotate(${deg}deg)`;
    this.applyTransform();
    return this;
  }
  scale(scale_x: number, scale_y: number): this {
    this.#scale = `scale(${scale_x}, ${scale_y})`;
    this.applyTransform();
    return this;
  }
  reset(): void {
    this.getElement().style.transform = 'none';
  }
}

class ZArrowSprite extends Sprite {

}

class XYArrowSprite extends Sprite {

}