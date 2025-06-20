/**
 * Base class for storing and handling an HTMLElement
 */
export class Renderer {
  #element: HTMLElement;
  #classname: string;
  #id: string;
 
  constructor(element: HTMLElement, classname: string = '', id: string = '') {
    this.#element = element;
    this.#element.className = classname;
    this.#element.id = id;
    this.#classname = classname;
    this.#id = id;
  }
  getElement(): HTMLElement {
    return this.#element;
  }
  setClassName(classname: string): void {
    this.#classname = classname;
    this.#element.className = classname;
  }
  setID(id: string): void {
    this.#id = id;
    this.#element.id = id;
  }
  setParent(parent: HTMLElement | Renderer): void {
    const currentParent = this.#element.parentElement;
    if (currentParent) {
      currentParent.removeChild(this.#element);
    }
    if (parent instanceof HTMLElement) parent.appendChild(this.#element);
    else parent.getElement().appendChild(this.#element);
  }
  setChild(child: HTMLElement | Renderer): void {
    if (child instanceof HTMLElement) this.#element.appendChild(child);
    else this.#element.appendChild(child.getElement());
  }
  remove(): void {
    const deafened_clone = this.#element.cloneNode(true);
    this.#element.replaceWith(deafened_clone);  // Nukes all attached event listeners
    deafened_clone.parentNode?.removeChild(deafened_clone);
    this.#element.remove();
  }
};