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
  remove(): void {
    if (this.#content instanceof Renderer) this.#content.remove();
    else if (this.#content instanceof HTMLElement) this.#content.remove();
    super.remove();
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
  addRow(): void {
    this.#rows++;
    const table_row_element: HTMLTableRowElement = document.createElement('tr');
    const table_row_renderers: TableCellRenderer<any>[] = [];
    for (let j = 0; j < this.#cols; j++) {
      const cell_renderer: TableCellRenderer<any> = new TableCellRenderer<any>(this.#rows - 1, j);
      table_row_element.appendChild(cell_renderer.getElement());
      table_row_renderers.push(cell_renderer);
    }
    this.getElement().appendChild(table_row_element);
    this.#cells.push(table_row_renderers);
  }
  addColumn(): void {
    this.#cols++;
    for (let i = 0; i < this.#rows; i++) {
      const cell_renderer: TableCellRenderer<any> = new TableCellRenderer<any>(i, this.#cols - 1);
      this.getElement().rows[i].appendChild(cell_renderer.getElement());
      this.#cells[i].push(cell_renderer);
    }
  }
  remove(): void {
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        this.#cells[i][j].remove();
      }
      this.#cells[i].length = 0;
    }
    this.#cells.length = 0;
    super.remove();
  }
}

class ListRenderer<T extends Renderer> extends Renderer {
  #items: T[];
  constructor (...items: T[]) {
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
      if (this.#items.length <= 0) {
        this.getElement().style.display = "none";
      }
      item.remove();
    }
  }
  removeAtIndex(index: number, range: number): void {
    if (index < 0 || range < 0 || index + range > this.#items.length) {
      throw new Error("Invalid range.");
    }
    if (this.#items.length <= 0) {
      this.getElement().style.display = "none";
    }
    this.#items.splice(index, range).forEach(item => {item.remove()});
  }
  empty(): void {
    this.#items.forEach(item => {
      (item.getElement().parentElement as HTMLLIElement)?.remove();
      item.remove();
    });
    this.#items.length = 0;
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

    this.#options = options;  
    if (options.length <= 0) this.#options = [new OptionRenderer("", "")];
    options.forEach(option => {
      option.setParent(this);
    });

    this.#selected = this.resolveSelectedValue(selected_value);
    this.#name = name;

    select.value = this.#selected.getValue();

    const label: HTMLLabelElement = document.createElement('label');
    label.htmlFor = id;
    this.#label_element = label;
  }
  private resolveSelectedValue(selected_value: string): OptionRenderer {
    // Returns the first available option or undefined if the selected_value does not exist among options
    return this.#options.find(option => option.getValue() === selected_value) ?? this.#options[0];
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
  setSelected(index: number): void {
    if (index < 0 || index >= this.#options.length) throw new Error("Index out of bounds.");
    this.#selected = this.#options[index];
    this.getElement().value = this.#selected.getValue();
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
    if (index < 0) return;
    this.#options[index].remove();
    this.#options.splice(index, 1);

    if (this.#options.length <= 0) {
      this.addOption(new OptionRenderer("", ""));
    }

    if (this.#selected === option) {
      this.#selected = this.#options[0];
      this.getElement().value = this.#selected.getValue();
    }
  }
  refresh(): void {
    this.#selected = this.#options[this.getOptionIndex(this.getElement().value)];
  }
  empty(completely: boolean = false): void {
    this.#options.forEach(option => option.remove());
    this.#options.length = 0;
    if (!completely) {
      this.addOption(new OptionRenderer("", ""));
      this.#selected = this.#options[0];
      this.getElement().value = this.#selected.getValue();
    }
  }
  remove(): void {
    this.empty(true);
    this.#label_element.remove();
    super.remove();
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
    this.#data.length = 0;
  }
  remove(): void {
    this.empty();
    this.#datalist_element.remove();
    super.remove();
  }
}

/**
 * Handles a table of inputs for a string record-type object. 
 * Left column contains prettified key names of the object, 
 * right column contains input fields for matching value
 * data types. Additional columns can be added for boolean
 * overrides such as 'random' and 'unspecified'. Stores the 
 * record object for read-only operations, and a map of 
 * renderer arrays for inputs.
 * ID parameter required to prevent duplicate input ID's.
 * Optional header, must be specified even when using
 * boolean overrides.
 * Boolean overrides are specifically intended for the 
 * ParticleGrouping interface structure.
 */
class InputTableRenderer<T extends string | boolean | number | Vector2D | undefined> extends TableRenderer {
  #properties: Record<string, T>;  // Read-only, assume all properties are defined
  #inputs: Map<string, (InputRenderer | CheckboxInputRenderer | NumberInputRenderer | Vector2DInputRenderer)[]>;

  constructor(id: string, properties: Record<string, T>, has_header: boolean = false, ...boolean_overrides: ('random' | 'unspecified')[]) {
    const property_keys: string[] = Object.keys(properties);
    super(property_keys.length + (has_header ? 1 : 0), 2 + boolean_overrides.length);
    this.setID(id);

    this.#properties = properties;
    this.#inputs = new Map();

    property_keys.forEach((key, index) => {
      const value: T = properties[key];
      const row = index  + (has_header ? 1 : 0);
      let input: InputRenderer | CheckboxInputRenderer | NumberInputRenderer | Vector2DInputRenderer | undefined;

      if (typeof value === 'string') input = new InputRenderer(`${INPUT_PREFIX}${key}_of_${id}`, value);
      else if (typeof value === 'boolean') input = new CheckboxInputRenderer(`${INPUT_PREFIX}${key}_of_${id}`, value);
      else if (typeof value === 'number') input = new NumberInputRenderer(`${INPUT_PREFIX}${key}_of_${id}`, value);
      else if (value instanceof Vector2D) input = new Vector2DInputRenderer(`${INPUT_PREFIX}${key}_of_${id}`, value);

      if (!input) throw new Error(`Unsupported input type for key: ${key}`);
      input.getLabelElement().innerText = prettifyKey(key);
      this.getCell(row, 0).setContent(input.getLabelElement()); 
      this.getCell(row, 1).setContent(input); 
      const override_inputs: CheckboxInputRenderer[] = [];  // May may expand "override_inputs" to "modifier_inputs" in the future to allow non-overriding and non-boolean inputs
      boolean_overrides.forEach((override, column) => {
        const override_input: CheckboxInputRenderer = new CheckboxInputRenderer(`${INPUT_PREFIX}${key}_${override}_override_of_${id}`);
        override_inputs.push(override_input);
        const cell: TableCellRenderer<CheckboxInputRenderer> = this.getCell(row, 2 + column);
        cell.setContent(override_input);
        if (has_header) {
          this.getCell(0, 2 + column).setContent(prettifyKey(override));  // header row
          cell.getElement().style.textAlign = 'center';
        }
      });
      this.#inputs.set(key, [input!, ...override_inputs]);
    });
  }
  prepareChanges(): Record<string, T> {
    const changes: Record<string, T> = {};
    for (const [key, inputs] of this.#inputs) {
      let is_unspecified: boolean = false;  // highest override
      let is_random: boolean = false;
      inputs.forEach(input => {
        input.refreshValue();
        if (input.getElement().id.includes('_random_override') && (input as CheckboxInputRenderer).getBooleanValue()) {
          (changes[key] as string) = 'random';
          is_random = true;
        };
        if (input.getElement().id.includes('_unspecified_override') && (input as CheckboxInputRenderer).getBooleanValue()) {
          is_unspecified = true;
          delete changes[key];
        };
      });
      if (is_unspecified) continue;
      if (is_random) continue;

      if (inputs[0] instanceof NumberInputRenderer) 
        (changes[key] as number) = inputs[0].getNumberValue();
      else if (inputs[0] instanceof CheckboxInputRenderer) 
        (changes[key] as boolean) = inputs[0].getBooleanValue();
      else if (inputs[0] instanceof InputRenderer)
        (changes[key] as string) = inputs[0].getValue();
      else if (inputs[0] instanceof Vector2DInputRenderer)
        (changes[key] as Vector2D) = inputs[0].getValue();
    }
    return changes;
  }
  refresh(): void {
    for (const [key, inputs] of this.#inputs) {
      inputs.forEach(input => {
        if (input.getElement().id.includes('_random_override'))
          (input as CheckboxInputRenderer).setValue(this.#properties[key]! === 'random' ? "true" : "false");
        else if (input.getElement().id.includes('_unspecified_override'))
          (input as CheckboxInputRenderer).setValue(this.#properties[key] ? "true" : "false");
        else if (input instanceof NumberInputRenderer) 
          input.setValue(this.#properties[key]!.toString())
        else if (input instanceof CheckboxInputRenderer) 
          input.setValue(this.#properties[key]! ? "true" : "false");
        else if (input instanceof InputRenderer)
          input.setValue(this.#properties[key]! as string);
        else if (input instanceof Vector2DInputRenderer)
          input.setValue(this.#properties[key]! as Vector2D);
      });
    }
  }
  remove(): void {
    this.#inputs.clear();
    super.remove();
  }
}