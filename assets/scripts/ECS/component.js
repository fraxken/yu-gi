// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import internal Dependencies
import AnimatedSpriteEx from "./animatedsprite.class";

// CONSTANTS
const kSymComponent = Symbol("component");
const kSymComponentType = Symbol("componentType");

export const Types = Object.freeze({
    AnimatedSpriteEx: "AnimatedSpriteEx",
    AnimatedSprite: "AnimatedSprite",
    Sprite: "Sprite"
});

export function isComponent(object) {
    if (!object[kSymComponent]) {
        throw new Error("Not a component!");
    }
}

export function assignSymbols(object) {
    let type = null;
    if (object instanceof AnimatedSpriteEx) {
        type = Types.AnimatedSpriteEx;
    }
    else if (object instanceof PIXI.AnimatedSprite) {
        type = Types.AnimatedSprite;
    }
    else if (object instanceof PIXI.Sprite) {
        type = Types.Sprite;
    }
    else {
        throw new Error("No known type for object");
    }

    Object.defineProperty(object, kSymComponent, { value: true });
    Object.defineProperty(object, kSymComponentType, { value: type });

    object.linkActorToComponent = (actor) => {
        switch (type) {
            case "AnimatedSpriteEx":
            case "AnimatedSprite":
            case "Sprite":
                actor.sprite = object;
                break;
        }
    }
}

export function type(component) {
    return component[kSymComponentType];
}
