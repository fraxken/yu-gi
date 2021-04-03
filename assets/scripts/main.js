import * as PIXI from 'pixi.js';

import catURL from "../sprites/cat.jpg";
console.log(catURL);

const type = PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas";
PIXI.utils.sayHello(type);

//Create a Pixi Application
let app = new PIXI.Application({
    width: 256,
    height: 256,
    antialias: true,
    resolution: 1
});

app.renderer.autoResize = true;
app.renderer.resize(512, 512);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.loader
  .add([
    catURL
  ])
  .load(loaderSetup);

function loaderSetup() {
    console.log("loaded!");
    // Create the cat sprite
    let cat = new PIXI.Sprite(app.loader.resources[catURL].texture);
    
    // Add the cat to the stage
    app.stage.addChild(cat);
}
