import Actor from "./actor.class";
import ActorTree from "./actortree.class";
import Engine from "./engine.class";
import Scene from "./scene.class";
import ScriptBehavior from "./scriptbehavior";
import State from "./state.class";
import SearchTree from "./searchtree";
import { findAsset, getActor, getCurrentState, getTexture, hitTestRectangle } from "./helpers";

// Components
import { Types } from "./component";
import AnimatedSpriteEx from "./components/animatedsprite.class";
import TiledMap from "./components/tiledmap";

// Math
import Vector2 from "./math/vector2";
import * as Easing from "./math/easing";
import Timer from "./math/timer.class";
import ProgressiveNumber from "./math/progressiveNumber";

const Components = {
    Types,
    AnimatedSpriteEx,
    TiledMap
}

export {
    Actor,
    ActorTree,
    SearchTree,
    Engine,
    Scene,
    ScriptBehavior,
    State,
    findAsset,
    getActor,
    getCurrentState,
    getTexture,
    Components,
    Vector2,
    Easing,
    Timer,
    ProgressiveNumber,
    hitTestRectangle
}
