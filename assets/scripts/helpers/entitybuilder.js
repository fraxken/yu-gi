
const entities = new Map();

export function get(name) {
    
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

    entities.set(entityName, action);
}

/**
 * @function create
 * @param {!string} entityName 
 * @param {object} [options] 
 * @returns {any}
 */
export function create(entityName, options = Object.create(null)) {
    if (!entities.has(entityName)) {
        throw new Error(`No entity with name '${entityName}'`);
    }
    const action = entities.get(entityName);

    return action(options);
}
