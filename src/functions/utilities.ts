import { Vector2D } from "../classes/entities/vector2D";

/**
 * Makes a key string capitalized and spaced,
 * intended for in dynamic creation of headers and
 * label elements.
 * @param key String key of an object property (snake_case & camelCase) 
 * @returns Capitalized and spaced string
 */
function prettifyKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Converts an alphanumeric string into snake_case.
 * Intended for creating valid ID's from user inputs.
 * @param string Alphanumeric string to be converted to snake_case.
 * @returns A string in snake_case format.
 */
function toSnakeCase(string: string): string {
  if (/[^a-zA-Z0-9\s]/.test(string)) {
    throw new Error("String contains non-alphanumeric characters.");
  }

  return string
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase();
}


/**
 * Performs a deep merge onto a target object,
 * can accept multiple sources, which are 
 * processed recursively.
 * From Stack Overflow:
 * https://stackoverflow.com/a/34749873 
 * @param {T} target Target object
 * @param {Partial<T>[]} sources Objects to merge into target
 */
function deepmergeCustom<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();
  if (source && isObject(target) && isObject(source)) {
    for (const key in source) {
      const source_value = source[key];
      const target_value = target[key];

      if ((source_value as any) instanceof Map) {
        if (!((target_value as any) instanceof Map)) target[key] = new Map() as any;
        (source_value as Map<any, any>).forEach((map_value, map_key) => {
          (target[key] as Map<any, any>).set(map_key, map_value);
        });
      }
      else if (isVectorLike(source_value)) {
        // If already a Vector2D instance, clone it; else, revive it
        (target[key] as Vector2D) = new Vector2D((source_value as any).x, (source_value as any).y);
      }
      else if (isObject(source[key])) {
        if (!isObject(target[key])) target[key] = {} as any;
        deepmergeCustom(target[key], source[key] as any);
      } 
      else {
        target[key] = source[key] as any;
      }
    }
  }

  return deepmergeCustom(target, ...sources);
}
function structuredCloneCustom<T>(input: T): T {
  return cloneRecursive(input);
}

function cloneRecursive(value: any): any {
  if (value === null || typeof value !== 'object') {
    return value; // Primitive values
  }
  else if (value instanceof Vector2D) {
    return new Vector2D(value.x, value.y);
  }
  else if (isVectorLike(value)) {
    return new Vector2D(value.x, value.y);
  }
  else if (value instanceof Map) {
    const map_clone = new Map();
    value.forEach((v, k) => {
      map_clone.set(cloneRecursive(k), cloneRecursive(v));
    });
    return map_clone;
  }
  else if (Array.isArray(value)) {
    return value.map(cloneRecursive);
  }

  const clone: any = {};
  for (const key in value) {
    clone[key] = cloneRecursive(value[key]);
  }

  return clone;
}


/**
 * Checks if a value is a defined object and not an array.
 */
function isObject(item: unknown): item is Record<string, any> {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}
/**
 * Checks if a value is similar to a Vector
 */
function isVectorLike(value: any): value is Vector2D | { x: number, y: number } {
  return isObject(value) && typeof value.x === 'number' && typeof value.y === 'number';
}

/**
 * Creates a record object containing the same keys as a
 * given type/interface, but only allowing boolean values,
 * initially all set to false. 
 * @param example intantiated object of the intended 
 * type/interface containing all its keys (even if partial).
 * Default/constant object recommended.
 * @returns a record object as described above.
 */
function createKeyFlags<T extends object>(example: T): { [K in keyof T]: boolean } {
  const keys = Object.keys(example) as (keyof T)[];
  return keys.reduce((acc, key) => {
    if (typeof example[key] !== 'function') {  
      // WARNING! Intended to exclude methods when creating flags for class properties,
      // Will also skip properties that store functions!
      acc[key] = false;
    }
    return acc;
  }, {} as { [K in keyof T]: boolean });
}

const INPUT_PREFIX = 'input_id_';

const VECTOR_VISUAL_SCALE_FACTOR = 1 / 10000;
const OVERFLOW_OFFSET = 1.3;

const FIELD_WIDTH = 60;
const GRAV_OFFSET = 20;
const ELEC_OFFSET = 40;
const MAG_OFFSET = 60;

const ELECTRON_CHARGE = 1.60 * 10 ** -19;
const ELECTRIC_FORCE_CONSTANT = 8.99 * 10 ** 9;
const PERMITTIVITY_CONSTANT = 8.85 * 10 ** -12;
const MAGNETIC_CONSTANT = 4 * Math.PI * 10 ** -7;

export {
  prettifyKey,
  toSnakeCase,
  deepmergeCustom,
  structuredCloneCustom,
  isObject,
  isVectorLike,
  createKeyFlags,
  INPUT_PREFIX,
  VECTOR_VISUAL_SCALE_FACTOR,
  OVERFLOW_OFFSET,
  FIELD_WIDTH,
  GRAV_OFFSET,
  ELEC_OFFSET,
  MAG_OFFSET,
  ELECTRON_CHARGE,
  ELECTRIC_FORCE_CONSTANT,
  PERMITTIVITY_CONSTANT,
  MAGNETIC_CONSTANT
}