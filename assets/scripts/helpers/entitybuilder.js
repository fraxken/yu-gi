
/** @type {Map<string, any>} */
export const cache = new Map();

const incrementStore = new Map();

/**
 * @param {!string} name
 * @returns {string}
 */
export function increment(name) {
    const count = incrementStore.get(name) || 0;
    incrementStore.set(name, count + 1);

    return `${name}${count}`;
}

/**
 * @param {!string | RegExp} pattern
 * @returns {string}
 */
export function getKeys(pattern) {
    const filterFn = typeof entityName === "string" ?
        (key) => key.startsWith(pattern) :
        (key) => pattern.test(key);

    return [...cache.keys()].filter(filterFn);
}

/**
 * @function define
 * @description define a new static entity
 * @param {!string} entityName
 * @param {!function} action
 * @returns {void}
 */
export function define(entityName, action) {
    if (typeof entityName !== "string") {
        throw new TypeError("entityName must be a string");
    }

    cache.set(entityName, action);
}

/**
 * @function create
 * @param {!string} entityName
 * @param {object} [options]
 * @returns {any}
 */
export function create(entityName, options = Object.create(null)) {
    if (!cache.has(entityName)) {
        throw new Error(`No entity with name '${entityName}'`);
    }
    const action = cache.get(entityName);

    return action(options);
}

/**
 * @function createMany
 * @param {!string} entityName
 * @param {number} [count=1]
 * @param {object} [options]
 * @returns {any}
 */
export function createMany(entityName, count = 1, options = Object.create(null)) {
    const entities = [];

    for (let i = 0; i < count; i++) {
        entities.push(create(entityName, options));
    }

    return entities;
}
