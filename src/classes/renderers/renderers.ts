/**
 * 
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

class InputRenderer extends Renderer {
  #value: string;  // may not be strings for some Input types, will write derived InputRenderer classes for those as needed
  #name: string;
  #is_disabled: boolean;
  #label: HTMLLabelElement;  // appended manually within the DOM, but not required
  constructor(id: string, value: string = "", name: string = "", is_disabled: boolean = false) {
    const input: HTMLInputElement = document.createElement('input');
    input.value = value;
    input.name = name;
    input.disabled = is_disabled;
    super(input, "", id);  // id required for labels
    this.#value = value;
    this.#name = name;
    this.#is_disabled = is_disabled;
    const label: HTMLLabelElement = document.createElement('label');
    label.htmlFor = id;
    this.#label = label;
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
  getLabel(): HTMLLabelElement {  // Must be disabled if implementing a renderer input type="hidden"
    return this.#label;
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
    this.#label.htmlFor = id;
  }
}

class NumberInputRenderer extends InputRenderer {

}

class CheckboxInputRenderer extends InputRenderer {

}

class SelectInputRenderer extends InputRenderer {

}

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

class DialogRenderer extends Renderer {
  #open_button: ButtonRenderer;
  #close_button: ButtonRenderer;
  constructor(id: string) {
    const dialog: HTMLDialogElement = document.createElement('dialog');
    dialog.id = id;
    super(dialog, '', id);
    const open_button: ButtonRenderer = new ButtonRenderer(this.openDialog);
    const close_button: ButtonRenderer = new ButtonRenderer(this.closeDialog);
    this.#open_button = open_button;
    this.#close_button = close_button;
  }
  getElement(): HTMLDialogElement {
    return super.getElement() as HTMLDialogElement;
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

class TableCellRenderer extends Renderer {
  #row: number;
  #col: number;
  
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
  setContent(content: string | HTMLElement): void {
    const cell = this.getElement();
    cell.innerHTML = '';
    if (typeof content === 'string') {
      cell.innerHTML = content;
    } else {
      cell.appendChild(content);
    }
  }
}

class TableRenderer extends Renderer {
  #rows: number;
  #cols: number;
  #cells: TableCellRenderer[][];
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
        const cell_renderer: TableCellRenderer = new TableCellRenderer(i, j);
        cell_renderer.setParent(table_row);
        this.#cells[i][j] = cell_renderer;
      }
      table.appendChild(table_row);
    }
  }
  getCell(row: number, col: number): TableCellRenderer {
    if (row >= this.#rows || row < 0 || col >= this.#cols || col < 0) {
      throw new Error(`Invalid cell at (${row}, ${col})`);
    }
    return this.#cells[row][col];
  }
  getElement(): HTMLTableElement {
    return super.getElement() as HTMLTableElement;
  }
}

class ListRenderer extends Renderer {
  #items: Renderer[];
  constructor (...items: Renderer[]) {
    if (items.length <= 0) {
      throw new Error("Empty spread operator argument");
    }
    const ul: HTMLUListElement = document.createElement('ul');
    super(ul);
    this.#items = [];
    items.forEach(item => {
      this.#items.push(item);
      const li: HTMLLIElement = document.createElement('li');
      item.setParent(li);
      ul.appendChild(li);
    });
  }
  getElement(): HTMLUListElement {
    return super.getElement() as HTMLUListElement;
  }
  getLength(): number {
    return this.#items.length;
  }
  push(item: Renderer): void {
    this.#items.push(item);
    const ul: HTMLUListElement = this.getElement();
    const li: HTMLLIElement = document.createElement('li');
    item.setParent(li);
    ul.appendChild(li);
  }
  at(index: number): Renderer {
    if (index < 0 || index >= this.#items.length) {
      throw new Error("Invalid index.");
    }
    return this.#items[index];
  }
  map<T>(callback: (item: Renderer, index: number) => T): T[] {
    return this.#items.map(callback);
  }
  forEach(callback: (item: Renderer, index: number) => void): void {
    this.#items.forEach(callback);
  }
  filter(callback: (item: Renderer, index: number) => boolean): Renderer[] {
    return this.#items.filter(callback);
  }
  swap(index1: number, index2: number): void {
    if (index1 === index2) return;
    // Swap in array
    const s: Renderer[] = this.#items;
    if (index1 < 0 || index2 < 0 || 
        index1 >= s.length || 
        index2 >= s.length) {
      throw new Error("Invalid indices.");
    }
    let temp: Renderer = s[index1];
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
  removeItem(item: Renderer): void {
    const index = this.#items.indexOf(item);
    if (index !== -1) {
      this.#items.splice(index, 1);
      item.remove();
    }
  }
  removeAtIndex(index: number, range: number): void {
    if (index < 0 || range < 0 || index + range > this.#items.length) {
      throw new Error("Invalid range.");
    }
    this.#items.splice(index, range).forEach(item => {item.remove()});
  }
  empty(): void {
    this.#items.forEach(item => {
      item.remove();
    });
    this.#items.splice(0, Infinity);
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