
type EnumLike = { 
  [key: string]: string | number; 
  [key: number]: string 
};

type EnumNumerical<E extends EnumLike> = Extract<E[keyof E], number>;

type EventPayloadMap<E extends EnumLike> = {
  [K in EnumNumerical<E>]: any;
};

type EventPayload<E extends EnumLike, M extends EventPayloadMap<E>, K extends EnumNumerical<E>> = M[K];

/**
 * Maps a number type enum into a Record pairing each enum value 
 * with an empty set to store observer callbacks.
 */
class ObserverHandler<E extends EnumLike, M extends EventPayloadMap<E>> {
  #observers: { [K in EnumNumerical<E>]?: Set<(payload: EventPayload<E, M, K>) => void> };

  constructor(enum_object: E) {
    this.#observers = {};
    Object.keys(enum_object).forEach(key => {
      const value = enum_object[key];
      if (typeof value === 'number') {
        this.#observers[value as EnumNumerical<E>] = new Set();
      }
    });
  }

  add<K extends EnumNumerical<E>>(event: K, callback: (payload: EventPayload<E, M, K>) => void): void {
    if (!this.#observers[event]) throw new Error(`Event ${event} not found.`);
    this.#observers[event].add(callback as any);
  }

  remove<K extends EnumNumerical<E>>(event: K, callback: (payload: EventPayload<E, M, K>) => void): void {
    if (!this.#observers[event]) throw new Error(`Event ${event} not found.`);
    this.#observers[event].delete(callback as any);
  }

  notify<K extends EnumNumerical<E>>(event: K, payload: EventPayload<E, M, K>): void {
    if (!this.#observers[event]) throw new Error(`Event ${event} not found.`);
    this.#observers[event].forEach(callback => (callback as any)(payload));
  }

  clear<K extends EnumNumerical<E>>(event: K): void {
    if (!this.#observers[event]) throw new Error(`Event ${event} not found.`);
    this.#observers[event].clear();
  }

  clearAll(): void {
    for (const key in this.#observers) {
      this.#observers[key as EnumNumerical<E>]?.clear();
    }
  }
}