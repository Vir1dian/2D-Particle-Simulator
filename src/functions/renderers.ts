class Renderer {
  #element: HTMLElement;
  #classname: string;
  #id: string;
 
  constructor(element: HTMLElement, classname: string = '', id: string = '') {
    this.#element = element;
    this.#element.classList.add(classname);
    this.#element.id = id;
    this.#classname = classname;
    this.#id = id;
  }
  getElement(): HTMLElement {
    return this.#element;
  }
  setClassName(classname: string): void {
    this.#classname = classname;
    this.#element.classList.add(classname);
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
  #value: string | number | boolean;
  #type: 'text' | 'number' | 'checkbox';
  #is_readonly: boolean;
  constructor(value: string | number | boolean, type: 'text' | 'number' | 'checkbox', is_readonly: boolean = false) {
    const input: HTMLInputElement = document.createElement('input');
    input.type = type;
    input.value = value.toString();
    input.readOnly = is_readonly;
    super(input);
    this.validateType(type, value);
    this.#value = value;
    this.#type = type;
    this.#is_readonly = is_readonly;
  }
  getElement(): HTMLInputElement {
    return super.getElement() as HTMLInputElement;
  }
  setChild(child: HTMLElement | Renderer): void {
    throw new Error("InputRenderer does not support child elements.");
  }
  refreshValue(): void {
    this.#value = this.getElement().value;
  }
  setValue(value: string | number | boolean): void {
    this.validateType(this.#type, value);
    this.#value = value;
    this.getElement().value = value.toString();
  }
  private validateType(type: 'text' | 'number' | 'checkbox', value: string | number | boolean): void {
    const isInvalid1: boolean = type === 'text' && typeof value !== 'string';
    const isInvalid2: boolean = type === 'number' && typeof value !== 'number';
    const isInvalid3: boolean = type === 'checkbox' && typeof value !== 'boolean';
    if (isInvalid1 || isInvalid2 || isInvalid3) {
      throw new Error("InputRenderer parameter type mismatch.");
    }
  }
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
      cell.textContent = content;
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

class TooltipRenderer extends Renderer {

}

class DraggableRenderer extends Renderer {

}