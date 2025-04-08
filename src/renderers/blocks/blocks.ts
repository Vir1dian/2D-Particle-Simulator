/**
 * Stores an HTMLButtonElement, maintains a callback
 * and an event. Uses only one eventlistener at a
 * time.
 */
class ButtonRenderer extends Renderer {
  #callback: (...args: any) => void;
  #event: string;
  constructor (callback: (...args: any) => void, event: string = 'click') {
    const button: HTMLButtonElement = document.createElement('button');
    button.addEventListener(event, callback);
    super(button);
    this.#callback = callback;
    this.#event = event;
  }
  getElement(): HTMLButtonElement {
    return super.getElement() as HTMLButtonElement;
  }
  deafen(): void {
    this.getElement().removeEventListener(this.#event,this.#callback);
  }
  setCallback(callback: (...args: any) => void): void {
    if (this.#callback === callback) return;
    this.deafen();
    this.#callback = callback;
    this.getElement().addEventListener(this.#event, callback);
  }
  setEvent(event: string): void {
    if (this.#event === event) return;
    this.deafen();
    this.#event = event;
    this.getElement().addEventListener(event, this.#callback);
  }
  remove(): void {
    this.deafen();
    super.remove();
  }
}

/**
 * Stores an empty HTMLDialogElement, an empty 
 * div Renderer for wrapping the content, and two 
 * ButtonRenderers for opening and closing the 
 * dialog. The buttons must be accessed and 
 * appended somewhere manually.
 */
class DialogRenderer extends Renderer {
  #open_button: ButtonRenderer; 
  #close_button: ButtonRenderer;
  #content_wrapper: Renderer;
  constructor(id: string) {
    const dialog: HTMLDialogElement = document.createElement('dialog');
    dialog.id = `dialog_id${id}`;
    super(dialog, '', id);
    const open_button: ButtonRenderer = new ButtonRenderer(this.openDialog);
    const close_button: ButtonRenderer = new ButtonRenderer(this.closeDialog);
    const content_wrapper: Renderer = new Renderer(document.createElement('div'), 'dialog_wrapper', `dialog_wrapper_id${id}`);
    this.#open_button = open_button;
    this.#close_button = close_button;
    this.#content_wrapper = content_wrapper;
  }
  getElement(): HTMLDialogElement {
    return super.getElement() as HTMLDialogElement;
  }
  getContentWrapper(): Renderer {
    return this.#content_wrapper;
  }
  appendToContent(element: HTMLElement | Renderer) {
    const wrapper = this.#content_wrapper.getElement();
    if (element instanceof Renderer) {
      wrapper.appendChild(element.getElement());
    } else {
      wrapper.appendChild(element);
    }
  }
  getOpenButton(): ButtonRenderer {
    return this.#open_button;
  }
  getCloseButton(): ButtonRenderer {
    return this.#close_button;
  }
  openDialog() {
    this.getElement().showModal();
  }
  closeDialog() {
    this.getElement().close();
  }
  remove() {
    this.#open_button.remove();
    this.#close_button.remove();
    this.#content_wrapper.remove();
    super.remove();
  }
}

class InputRenderer extends Renderer {
  #value: string;  // may not be strings for some Input types, will write derived InputRenderer classes for those as needed
  #name: string;
  #is_disabled: boolean;
  #label_element: HTMLLabelElement;  // appended manually within the DOM, but not required
  constructor(id: string, value: string = "", name: string = "", is_disabled: boolean = false) {
    const input: HTMLInputElement = document.createElement('input');
    input.value = value;
    input.name = name;
    input.disabled = is_disabled;
    super(input, "", id);  // id required for label elements
    this.#value = value;
    this.#name = name;
    this.#is_disabled = is_disabled;
    const label: HTMLLabelElement = document.createElement('label');
    label.htmlFor = id;
    this.#label_element = label;
  }

  // getters
  getElement(): HTMLInputElement {
    return super.getElement() as HTMLInputElement;
  }
  getValue(): string {  // Must be disabled if implementing a renderer input type="image"
    return this.#value;
  }
  getName(): string {
    return this.#name;
  }
  isDisabled(): boolean {
    return this.#is_disabled;
  }
  getLabelElement(): HTMLLabelElement {  // Must be disabled if implementing a renderer input type="hidden"
    return this.#label_element;
  }

  // setters
  setChild(child: HTMLElement | Renderer): void {
    // Prevents setChild from being used for an InputRenderer
    throw new Error("InputRenderer does not support child elements.");
  }
  setValue(value: string): void {
    this.#value = value;
    this.getElement().value = value;
  }
  refreshValue(): void {  // Must be called manually for now, for flexibility with events
    this.#value = this.getElement().value;
  }
  setName(name: string): void {
    this.#name = name;
    this.getElement().name = name;
  }
  toggleDisabled(): void {
    this.#is_disabled = !this.#is_disabled;
    this.getElement().disabled = this.#is_disabled;
  }
  setID(id: string): void {
    super.setID(id);
    this.#label_element.htmlFor = id;
  }
  remove(): void {
    this.#label_element.remove();
    super.remove();
  }
}

class NumberInputRenderer extends InputRenderer {
  constructor(id: string, value: number = 0) {
    super(id, value.toString());
    this.getElement().type = "number";
  }
  setValue(value: string): void {
    // prevents the setValue base method from attempting to set a non-parsable value into for a type="number"
    super.setValue(parseFloat(value)?.toString() ?? '0');
  }
}

class CheckboxInputRenderer extends InputRenderer {
  constructor(id: string, checked: boolean = false) {
    super(id, checked ? "true" : "false");
    this.getElement().type = "checkbox";
    this.getElement().checked = checked;
  }
  getValue(): string {
    // prevents the getValue base method from attempting to return a value attribute for a type="checkbox"
    return this.getElement().checked.toString();  
  }
  getBooleanValue(): boolean {
    return this.getElement().checked;
  }
  setValue(value: "true" | "false"): void {
    this.getElement().checked = value === "true";
    super.setValue(value);
  }
}

class TooltipRenderer extends Renderer {

}

class DraggableRenderer extends Renderer {

}