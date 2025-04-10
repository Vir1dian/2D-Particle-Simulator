"use strict";
/**
 * Makes a key string capitalized and spaced,
 * intended for in dynamic creation of headers and
 * label elements.
 * @param key string key of an object property (snake_case & camelCase)
 * @returns Capitalized and spaced string
 */
function prettifyKey(key) {
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
function deepmergeCustom(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source && isObject(target) && isObject(source)) {
        for (const key in source) {
            const source_value = source[key];
            const target_value = target[key];
            if (source_value instanceof Map) {
                if (!(target_value instanceof Map))
                    target[key] = new Map();
                source_value.forEach((map_value, map_key) => {
                    target[key].set(map_key, map_value);
                });
            }
            else if (isVectorLike(source_value)) {
                // If already a Vector2D instance, clone it; else, revive it
                target[key] = new Vector2D(source_value.x, source_value.y);
            }
            else if (isObject(source[key])) {
                if (!isObject(target[key]))
                    target[key] = {};
                deepmergeCustom(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        }
    }
    return deepmergeCustom(target, ...sources);
}
function structuredCloneCustom(input) {
    return cloneRecursive(input);
}
function cloneRecursive(value) {
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
    const clone = {};
    for (const key in value) {
        clone[key] = cloneRecursive(value[key]);
    }
    return clone;
}
/**
 * Checks if a value is a defined object and not an array.
 */
function isObject(item) {
    return !!item && typeof item === 'object' && !Array.isArray(item);
}
/**
 * Checks if a value is similar to a Vector
 */
function isVectorLike(value) {
    return isObject(value) && typeof value.x === 'number' && typeof value.y === 'number';
}
const INPUT_PREFIX = 'input_id_';
