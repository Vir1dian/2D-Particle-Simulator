/**
 * Base class for storing and handling an HTMLElement
 */
class Renderer {
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
    this.#element.replaceWith(this.#element.cloneNode(true));  // Nukes all attached event listeners
    this.#element.remove();
  }
}

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
}

/**
 * 
 */
class TableCellRenderer<R extends Renderer> extends Renderer {  // stores at most a Renderer type
  #row: number;
  #col: number;
  #content?: string | HTMLElement | R;
  
  constructor(row: number, col: number) {
    const cell: HTMLTableCellElement = document.createElement('td');
    super(cell);
    this.#row = row;
    this.#col = col;
  }
  getElement(): HTMLTableCellElement {
    return super.getElement() as HTMLTableCellElement;
  }
  getRow(): number {
    return this.#row;
  }
  getCol(): number {
    return this.#col;
  }
  setParent(parent: HTMLElement | Renderer): void {
    throw new Error("Cannot append TableCellRenderer to a parent. Manipulate through TableRenderer instead.");
  }
  setContent(content: string | HTMLElement | R): void {
    const cell = this.getElement();
    cell.innerHTML = ''; // Clear previous content

    if (typeof content === 'string') {
      cell.textContent = content;
    } else if (content instanceof HTMLElement) {
      cell.appendChild(content);
    } else if (content instanceof Renderer) {
      cell.appendChild(content.getElement());
    }
    
    this.#content = content;
  }

  getContent(): string | HTMLElement | R | undefined {
    return this.#content;
  }
}

/**
 * Stores a HTMLTableElement, maintains a
 * 2D array of TableCellRenderers. Is
 * static, cannot modify dimensions
 * after instantiation.
 */
class TableRenderer extends Renderer {
  #rows: number;
  #cols: number;
  #cells: TableCellRenderer<any>[][]; // Allow any type of renderer and maintain polymorphism
  constructor(rows: number = 1, cols: number = 1) {
    if (rows < 1 || cols < 1) {
      throw new Error('Invalid table dimensions');
    }
    const table: HTMLTableElement = document.createElement('table');
    super(table);
    this.#rows = rows;
    this.#cols = cols;
    this.#cells = [];
    for (let i = 0; i < rows; i++) {
      const table_row: HTMLTableRowElement = document.createElement('tr');
      this.#cells[i] = [];
      for (let j = 0; j < cols; j++) {
        const cell_renderer: TableCellRenderer<any> = new TableCellRenderer<any>(i, j);
        table_row.appendChild(cell_renderer.getElement());
        this.#cells[i][j] = cell_renderer;
      }
      table.appendChild(table_row);
    }
  }
  getCell(row: number, col: number): TableCellRenderer<any> {
    if (row >= this.#rows || row < 0 || col >= this.#cols || col < 0) {
      throw new Error(`Invalid cell at (${row}, ${col})`);
    }
    return this.#cells[row][col];
  }
  getElement(): HTMLTableElement {
    return super.getElement() as HTMLTableElement;
  }
}

class ListRenderer<T extends Renderer> extends Renderer {
  #items: T[];
  constructor (...items: T[]) {
    // if (items.length <= 0) {
    //   throw new Error("Empty spread operator argument");
    // }
    const ul: HTMLUListElement = document.createElement('ul');
    super(ul);
    this.#items = [];
    items.forEach(item => {
      this.#items.push(item);
      const li: HTMLLIElement = document.createElement('li');
      item.setParent(li);
      ul.appendChild(li);
    });
    if (items.length <= 0) {
      ul.style.display = "none";
    }
  }
  getElement(): HTMLUListElement {
    return super.getElement() as HTMLUListElement;
  }
  getLength(): number {
    return this.#items.length;
  }
  push(item: T): void {
    this.#items.push(item);
    const ul: HTMLUListElement = this.getElement();
    const li: HTMLLIElement = document.createElement('li');
    item.setParent(li);
    ul.appendChild(li);
    ul.style.display = "";
  }
  at(index: number): T {
    if (index < 0 || index >= this.#items.length) {
      throw new Error("Invalid index.");
    }
    return this.#items[index];
  }
  map<S>(callback: (item: Renderer, index: number) => S): S[] {
    return this.#items.map(callback);
  }
  forEach(callback: (item: Renderer, index: number) => void): void {
    this.#items.forEach(callback);
  }
  filter(callback: (item: Renderer, index: number) => boolean): T[] {
    return this.#items.filter(callback);
  }
  swap(index1: number, index2: number): void {
    if (index1 === index2) return;
    // Swap in array
    const s: T[] = this.#items;
    if (index1 < 0 || index2 < 0 || 
        index1 >= s.length || 
        index2 >= s.length) {
      throw new Error("Invalid indices.");
    }
    let temp: T = s[index1];
    s[index1] = s[index2];
    s[index2] = temp;
    // Swap in DOM
    const ul: HTMLUListElement = this.getElement();
    const li1 = ul.children[index1] as HTMLElement;
    const li2 = ul.children[index2] as HTMLElement;
    if (li1 && li2) {
      const next = li2.nextSibling; // Store next sibling for correct insertion order
      ul.insertBefore(li2, li1);
      if (next) {
          ul.insertBefore(li1, next);
      } else {
          ul.appendChild(li1); // If li2 was last, append li1 at the end
      }
    }
  }
  removeItem(item: T): void {
    const index = this.#items.indexOf(item);
    if (index !== -1) {
      this.#items.splice(index, 1);
      item.remove();
    }
    if (this.#items.length <= 0) {
      this.getElement().style.display = "none";
    }
  }
  removeAtIndex(index: number, range: number): void {
    if (index < 0 || range < 0 || index + range > this.#items.length) {
      throw new Error("Invalid range.");
    }
    this.#items.splice(index, range).forEach(item => {item.remove()});
    if (this.#items.length <= 0) {
      this.getElement().style.display = "none";
    }
  }
  empty(): void {
    this.#items.forEach(item => item.remove());
    this.#items.splice(0, Infinity);
    this.getElement().style.display = "none";
  }
  remove(): void {
    this.empty();
    super.remove();
  }
}

class OptionRenderer extends Renderer {
  #value: string;
  #label: string;
  constructor(value: string, label?: string) {
    const option: HTMLOptionElement = document.createElement('option');
    super(option);
    this.#value = value;
    this.#label = label ? label : value;
    option.value = this.#value;
    option.innerHTML = this.#label;
  }
  getElement(): HTMLOptionElement {
    return super.getElement() as HTMLOptionElement;
  }
  getValue(): string {
    return this.#value;
  }
  getLabel(): string {
    return this.#label;
  }
  setChild(child: HTMLElement | Renderer): void {
    throw new Error("setChild() not allowed for OptionRenderer.");
  }
  setParent(parent: HTMLSelectElement | SelectRenderer | HTMLDataListElement): void {
    super.setParent(parent);
  }
  // setValue(value: string): void {
  //   this.#value = value;
  //   this.getElement().value = value;
  // }
  // setLabel(label: string): void {
  //   this.#label = label;
  //   this.getElement().innerHTML = this.#label;
  // }
}

class SelectRenderer extends Renderer {
  #options: OptionRenderer[];
  #selected: OptionRenderer;
  #name: string;
  #label_element: HTMLLabelElement;  // appended manually within the DOM, but not required
  constructor(id: string, options: OptionRenderer[], selected_value: string = "", name: string = "") {
    const select: HTMLSelectElement = document.createElement('select');
    select.name = name;
    super(select, "", id);  // id required for label elements

    // Creates a trivial option at the start, intended to persist until the renderer is removed
    this.#options = [new OptionRenderer("", ""), ...options];  
    options.forEach(option => {
      option.setParent(this);
    });

    this.#selected = this.resolveSelectedValue(selected_value);
    this.#name = name;

    select.value = this.#selected.getValue();
    select.addEventListener("change", () => {
      this.#selected = this.#options[this.getOptionIndex(this.getElement().value)];
    });

    const label: HTMLLabelElement = document.createElement('label');
    label.htmlFor = id;
    this.#label_element = label;
  }
  private resolveSelectedValue(selected_value: string): OptionRenderer {
    // Returns the first available option or undefined if the selected_value does not exist among options
    const selected_option = this.#options.find(option => option.getValue() === selected_value);
    if (selected_option) return selected_option;
    return this.#options[0];
  }

  // getters
  getElement(): HTMLSelectElement {
    return super.getElement() as HTMLSelectElement;
  }
  getOptions(): OptionRenderer[] {
    return this.#options;
  }
  getSelectedOption(): OptionRenderer {
    return this.#selected;
  }
  getName(): string {
    return this.#name;
  }
  getLabelElement(): HTMLLabelElement {
    return this.#label_element;
  }
  getOptionIndex(value: string): number {
    return this.#options.findIndex(option => option.getValue() === value);
  }

  // setters
  setChild(child: HTMLElement | Renderer): void {
    // Prevents setChild from being used for an SelectRenderer
    throw new Error("setChild() not allowed for SelectRenderer, use addOption().");
  }
  setName(name: string): void {
    this.#name = name;
    this.getElement().name = name;
  }
  setID(id: string): void {
    super.setID(id);
    this.#label_element.htmlFor = id;
  }
  addOption(option: OptionRenderer): void {
    if (this.getOptionIndex(option.getValue()) !== -1) throw new Error("Value already exists in select.");
    this.#options.push(option);
    option.setParent(this);
  }
  removeOption(option: OptionRenderer): void {
    const index: number = this.getOptionIndex(option.getValue());
    if (index < 1) return;
    this.#options[index].remove();
    this.#options.splice(index, 1);

    if (this.#selected === option) {
      // Sets the selected option to the first nontrivial option if possible, if it was deleted.
      this.#selected = this.#options.length > 1 ? this.#options[1] : this.#options[0];
      this.getElement().value = this.#selected.getValue();
    }
  }
  empty(): void {  // remove all optionRenderers except for the trivial renderer (index 0)
    this.#options.slice(1).forEach(option => option.remove());
    this.#options.splice(1, Infinity);
  }
  remove(): void {
    this.empty();
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

class DatalistInputRenderer extends InputRenderer {
  // Note, datalists only require option elements with set values, no need for inner text labels
  #data: OptionRenderer[];  
  #datalist_element: HTMLDataListElement;
  constructor(id: string, data: OptionRenderer[], data_id: string) {
    super(id);
    const datalist: HTMLDataListElement = document.createElement("datalist");
    datalist.id = data_id;
    this.getElement().setAttribute("list", data_id);

    data.forEach(option => option.setParent(datalist));

    this.#data = data;
    this.#datalist_element = datalist;
  }
  setParent(parent: HTMLElement | Renderer): void {
    super.setParent(parent);
    if (parent instanceof HTMLElement) parent.appendChild(this.#datalist_element);
    else parent.getElement().appendChild(this.#datalist_element);
  }
  getDatalist(): OptionRenderer[] {
    return this.#data;
  }
  getDatalistElement(): HTMLDataListElement {
    return this.#datalist_element;
  }
  getOptionIndex(value: string): number {
    return this.#data.findIndex(option => option.getValue() === value);
  }
  addOption(option: OptionRenderer): void {
    if (this.getOptionIndex(option.getValue()) !== -1) throw new Error("Value already exists in datalist.");
    this.#data.push(option);
    option.setParent(this.#datalist_element);
  }
  removeOption(option: OptionRenderer): void {
    const index: number = this.getOptionIndex(option.getValue());
    if (index < 0) return;
    this.#data[index].remove();
    this.#data.splice(index, 1);
  }
  empty(): void {
    this.#data.forEach(option => option.remove());
    this.#data.splice(0, Infinity);
  }
  remove(): void {
    this.empty();
    super.remove();
  }
}

class TooltipRenderer extends Renderer {

}

class DraggableRenderer extends Renderer {

}