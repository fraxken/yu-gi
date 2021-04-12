import * as EntityBuilder from "../scripts/helpers/entitybuilder";

export function init(scene) {
    scene.add(EntityBuilder.create("actor:player"));
    scene.add(EntityBuilder.create("actor:creature"));
    // scene.add(EntityBuilder.create("actor:camera"));
}

export function awake() {}
export function update() {}
