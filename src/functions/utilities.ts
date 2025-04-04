/**
 * Makes a key string capitalized and spaced,
 * intended for in dynamic creation of headers and
 * label elements.
 * @param key string key of an object property (snake_case & camelCase) 
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
 * Performs a deep merge onto a target object,
 * can accept multiple sources, which are 
 * processed recursively.
 * From Stack Overflow:
 * https://stackoverflow.com/a/34749873 
 * @param {T} target Target object
 * @param {Partial<T>[]} sources Objects to merge into target
 */
function deepmerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();
  if (source && isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isMap(source[key])) {
        if (!isMap(target[key])) target[key] = new Map() as any;
        (source[key] as Map<any, any>).forEach((mapValue, mapKey) => {
          (target[key] as Map<any, any>).set(mapKey, mapValue);
        });
      }
      // else if ((source as any)[key] instanceof Vector2D) {
      //   // Ensure the Vector2D object remains a proper instance
      //   console.log("found a Vector2D");
      //   target[key] = new Vector2D(source[key].x, source[key].y) as any;
      // }
      else if (isObject(source[key])) {
        if (!isObject(target[key])) target[key] = {} as any;
        deepmerge(target[key], source[key] as any);
      } else {
        target[key] = source[key] as any;
      }
    }
  }

  return deepmerge(target, ...sources);
}
/**
 * Checks if a value is a defined object and not an array.
 */
function isObject(item: unknown): item is Record<string, any> {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}
/**
 * Type guard to check if a value is a Map.
 */
function isMap(item: unknown): item is Map<any, any> {
  return item instanceof Map;
}

