import { Vector2D } from "../entities/vector2D";
import { Renderer } from "./renderer";

/**
 * Stores an HTMLButtonElement, maintains a callback
 * and an event. Uses only one eventlistener at a
 * time.
 */
class ButtonRenderer extends Renderer {
  #callback: (...args: any) => void;
  #event: string;
  #is_disabled: boolean;
  constructor (callback: (...args: any) => void, event: string = 'click') {
    const button: HTMLButtonElement = document.createElement('button');
    button.addEventListener(event, callback);
    super(button);
    this.#callback = callback;
    this.#event = event;
    this.#is_disabled = false;
  }
  getElement(): HTMLButtonElement {
    return super.getElement() as HTMLButtonElement;
  }
  getCallback(): (...args: any) => void {
    return this.#callback;
  }
  getEvent(): string {
    return this.#event;
  }
  isDisabled(): boolean {
    return this.#is_disabled;
  }
  deafen(): void {
    this.getElement().removeEventListener(this.#event,this.#callback);
  }
  disable(value: boolean = true) {
    this.#is_disabled = value;
    this.getElement().disabled = value;
    if (value) this.getElement().style.cursor = 'not-allowed';
    else this.getElement().style.cursor = 'pointer';
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
  setLabel(label: string, is_mdi: boolean = false): void {
    if (is_mdi) {
      this.setClassName("material-symbols-sharp icon");
    }
    this.getElement().textContent = label;
  }
  remove(): void {
    this.deafen();
    super.remove();
  }
};

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
    const open_button: ButtonRenderer = new ButtonRenderer(this.openDialog.bind(this));
    const close_button: ButtonRenderer = new ButtonRenderer(this.closeDialog.bind(this));
    const content_wrapper: Renderer = new Renderer(document.createElement('div'), 'dialog_wrapper', `dialog_wrapper_id${id}`);

    this.#open_button = open_button;
    this.#close_button = close_button;
    this.#content_wrapper = content_wrapper;

    open_button.getElement().textContent = `Open ${id}`;
    close_button.getElement().textContent = `Close ${id}`;
    this.setChild(this.#content_wrapper);
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
};

/**
 * An extension of DialogRenderer with basic styling
 * for a title and a close button, with a space for
 * a renderer body. The open button must be accessed 
 * and appended somewhere manually.
 */
class StandardDialogRenderer<T extends Renderer> extends DialogRenderer {
  #body: T;
  constructor(body: T, id: string, title_text: string = '', isDraggable: boolean = false) {
    super(id);
    const header: HTMLElement = document.createElement('header');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    const title : HTMLSpanElement = document.createElement('span');
    title.innerHTML = title_text;
    header.appendChild(title);
    this.getCloseButton().setParent(header);
    this.appendToContent(header);

    this.#body = body;
    this.appendToContent(this.#body);
    this.getElement().addEventListener('click', e => {
      if (e.target instanceof HTMLDialogElement) {
        // slightly slower than this.closeDialog();, but allows any existing
        // modifications to the close button's callback to be invoked as well
        this.getCloseButton().getCallback()();
      }
    });

    if (isDraggable) this.setAsDraggable(header, this.getElement());
  }
  // From w3schools: https://www.w3schools.com/howto/howto_js_draggable.asp 
  private setAsDraggable(header: HTMLElement, dialog: HTMLElement): void {
    header.style.cursor = 'move';
    dialog.classList.add('draggable');

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    header.onmousedown = dragMouseDown;
  
    function dragMouseDown(e: MouseEvent) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e: MouseEvent) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      dialog.style.top = (dialog.offsetTop - pos2) + "px";
      dialog.style.left = (dialog.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  getBody(): T {
    return this.#body;
  }
};

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
    if (this.#is_disabled) this.#label_element.classList.add("disabled_input_label");
    else this.#label_element.classList.remove("disabled_input_label");
  }
  disable(value: boolean = true) {
    this.#is_disabled = value;
    this.getElement().disabled = value;
    if (value) this.#label_element.classList.add("disabled_input_label");
    else this.#label_element.classList.remove("disabled_input_label");
  }
  setID(id: string): void {
    super.setID(id);
    this.#label_element.htmlFor = id;
  }
  remove(): void {
    this.#label_element.remove();
    super.remove();
  }
};

class NumberInputRenderer extends InputRenderer {
  #min: number | false;
  #max: number | false;
  #clamp: () => void;

  constructor(id: string, value: number = 0, min: number | false = false, max: number | false = false) {
    super(id, value.toString());
    this.#min = min;
    this.#max = max;
    this.setValue(value.toString());

    const input: HTMLInputElement = this.getElement();
    input.type = "number";
    if (min !== false) input.min = min.toString();
    if (max !== false) input.max = max.toString();

    this.#clamp = () => {
      this.setValue(input.value);
    };
    input.addEventListener("blur", this.#clamp);
  }
  private resolveValue(value: number): number {
    if (this.#min !== false && value < this.#min) return this.#min;
    if (this.#max !== false && value > this.#max) return this.#max;
    return value;
  }
  // prevents the setValue base method from attempting to set a non-parsable value into for a type="number"
  setValue(value: string): void {
    const parsed_value = parseFloat(value);
    if (Number.isNaN(parsed_value)) super.setValue((this.#min !== false ? this.#min : 0).toString());
    else super.setValue(this.resolveValue(parsed_value).toString());
  }
  setBounds(min: number | false = false, max: number | false = false): void {
    this.#min = min;
    this.#max = max;
    const input = this.getElement();
    if (min !== false) input.min = min.toString();
    else input.removeAttribute("min");
    if (max !== false) input.max = max.toString();
    else input.removeAttribute("max");
    this.#clamp();
  }
  getNumberValue(): number {
    return parseFloat(this.getValue());
  }
  remove(): void {
    this.getElement().removeEventListener("blur", this.#clamp);
    super.remove();
  }
};

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
    // super.setValue(value);
  }
};

class Vector2DInputRenderer extends Renderer {
  #value: Vector2D;
  #input_x: NumberInputRenderer;
  #input_y: NumberInputRenderer;
  #is_disabled: boolean;
  #label_element: HTMLLabelElement;  // appended manually within the DOM, but not required
  constructor(id: string, value: Vector2D = new Vector2D(), is_disabled: boolean = false) {
    const input_x = new NumberInputRenderer(`${id}_x`, value.x);
    const input_y = new NumberInputRenderer(`${id}_y`, value.y);
    const input_wrapper = document.createElement('div');

    input_x.getLabelElement().innerText = "x:";
    input_y.getLabelElement().innerText = "y:";
    if (is_disabled) {
      input_x.disable();
      input_y.disable();
    }

    input_wrapper.appendChild(input_x.getLabelElement());
    input_x.setParent(input_wrapper);
    input_wrapper.appendChild(input_y.getLabelElement());
    input_y.setParent(input_wrapper);

    const label_xy: HTMLLabelElement = document.createElement('label');
    label_xy.htmlFor = `${id}_x`;

    super(input_wrapper, 'input_wrapper_xy', `${id}_wrapper`);
    this.#value = value;
    this.#input_x = input_x;
    this.#input_y = input_y;
    this.#is_disabled = is_disabled;
    this.#label_element = label_xy;
  }
  getValue(): Vector2D {  // Must be disabled if implementing a renderer input type="image"
    return this.#value.clone();
  }
  getInputX(): NumberInputRenderer {
    return this.#input_x;
  }
  getInputY(): NumberInputRenderer {
    return this.#input_y;
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
  setValue(value: Vector2D): void {
    this.#value = value;
    this.#input_x.setValue(value.x.toString());
    this.#input_y.setValue(value.y.toString());
  }
  refreshValue(): void {  // Must be called manually for now, for flexibility with events
    this.#input_x.refreshValue();
    this.#input_y.refreshValue();
    this.#value = new Vector2D(
      this.#input_x.getNumberValue(),
      this.#input_y.getNumberValue()
    );
  }
  toggleDisabled(): void {
    this.#is_disabled = !this.#is_disabled;
    this.#input_x.toggleDisabled();
    this.#input_y.toggleDisabled();
    if (this.#is_disabled) this.#label_element.classList.add("disabled_input_label");
    else this.#label_element.classList.remove("disabled_input_label");
  }
  disable(value: boolean = true) {
    this.#is_disabled = value;
    this.#input_x.disable(value);
    this.#input_y.disable(value);
    if (value) this.#label_element.classList.add("disabled_input_label");
    else this.#label_element.classList.remove("disabled_input_label");
  }
  setID(id: string): void {
    this.#input_x.setID(`${id}_x`);
    this.#input_y.setID(`${id}_y`);
    this.#label_element.htmlFor = `${id}_x`;
  }
  setWrapperID(id: string): void {
    super.setID(`${id}_wrapper`);
  }
  remove(): void {
    this.#input_x.remove();
    this.#input_y.remove();
    this.#label_element.remove();
    super.remove();
  }
};

class TooltipRenderer extends Renderer {

};

class DraggableRenderer extends Renderer {

};

export {
  ButtonRenderer,
  DialogRenderer,
  StandardDialogRenderer,
  InputRenderer,
  NumberInputRenderer,
  CheckboxInputRenderer,
  Vector2DInputRenderer,
  TooltipRenderer,
  DraggableRenderer
};