export * as PlayerBehavior from "./PlayerBehavior";
export * as CreatureBehavior from "./CreatureBehavior";
export * as SpatialSoundBehavior from "./SpatialSoundBehavior";
export * as DoorBehavior from "./DoorBehavior";

// NOTE: we only use this to force URL loading for the build
export function init() {
    console.log("[INFO] Scripted behaviors loaded");
}
