import * as EntityBuilder from "../scripts/helpers/entitybuilder";

export function init(scene) {
    scene.add(EntityBuilder.create("actor:player"));
    // scene.add(EntityBuilder.create("actor:camera"));
}

export function awake() {}
export function start() {}
export function update() {}
