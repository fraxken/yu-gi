import Keyboard, { Key } from "./input.class";
import * as EntityBuilder from "./entitybuilder";
import BackgroundMediaPlayer from "./backgroundmediaplayer";
import SpatialSound from "./spatialSound";
import zIndexManager from "./zIndexManager";
import LifeBar from "./LifeBar";

import AnimatedText, * as Animations from "./AnimatedText";

/**
 * @param {!string} str
 * @returns {[number, number]}
 */
function progressionParser(str) {
    const [room, niveau] = str.split(".");

    return [Number(room), Number(niveau)];
}

/**
 * @param {[number, number]} param0
 * @returns {[number, number]}
 */
function nextProgression([room, niveau]) {
    if (niveau === 3 && room === 3) {
        return [3, 3];
    }
    const upRoom = room + 1 > 3;
    const nextRoom = upRoom ? 1 : room + 1;
    const nextNiveau = upRoom && nextRoom === 1 ? niveau + 1 : niveau;

    return [nextRoom, nextNiveau];
}

export {
    Keyboard,
    Key,
    EntityBuilder,
    BackgroundMediaPlayer,
    SpatialSound,
    AnimatedText,
    Animations,
    zIndexManager,
    LifeBar,
    progressionParser,
    nextProgression
}
