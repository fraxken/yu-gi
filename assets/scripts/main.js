import * as PIXI from 'pixi.js';

import adventurerAtlasURL from "../sprites/adventurer.json";

//Create a Pixi Application
let app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio
});

app.renderer.backgroundColor = 0xFF00FF;

document.body.appendChild(app.view);

app.loader
    .add(adventurerAtlasURL)
    .load(loaderSetup);


function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

let character;
function loaderSetup() {
    resize();

    // const getOneTexture = (url) => app.loader.resources[url].texture;
    const getAtlasTexture = (url, name) => app.loader.resources[url].textures[name];

    console.log("loaded!");
    character = new PIXI.Sprite(getAtlasTexture(adventurerAtlasURL, "adventurer-idle-00.png"));

    let left = keyboard("ArrowLeft"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown");

    right.press = () => {
        character.vx = 5;
    }
    right.release = () => {
        character.vx = 0;
    }

    // character.y = app.stage.height / 2 - character.height / 2;
    // character.x = app.stage.width / 2 - character.width / 2;

    app.stage.addChild(character);
    app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop() {
    character.x += character.vx;
    character.y += character.vy;
}

// Listen for window resize events
window.addEventListener("resize", resize);

// Resize function window
function resize() {
    console.log("resize");

    // Resize the renderer
    app.renderer.resize(window.innerWidth, window.innerHeight);
}
