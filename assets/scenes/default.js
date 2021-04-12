import * as EntityBuilder from "../scripts/helpers/entitybuilder";

export function init(scene) {
    scene.add(EntityBuilder.create("actor:player"));
    for (let i = 0; i < 5; i++) {
        scene.add(EntityBuilder.create(`actor:creature${i}`));
    }
    // scene.add(EntityBuilder.create("actor:camera"));
}

export function awake() {}
export function start() {}
export function update() {}
