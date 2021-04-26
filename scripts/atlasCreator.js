const path = require("path");
const fs = require("fs");

const kAssetPath = path.join(__dirname, "..", "assets", "sprites");

function createFrame(width, height, x, y, anchor) {
    const w = width;
    const h = height;

    return {
        frame: { x, y, w, h },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w, h },
        sourceSize: { w, h },
        anchor: { x: anchor[0], y: anchor[1] }
    }
}

function createAtlas(options = {}) {
    const { size, anchor, animations = {}, image = "" } = options;
    const [imageWidth, imageHeight] = size.image;
    const [spriteWidth, spriteHeight] = size.sprite;

    const frames = {};
    const maxSpriteW = imageWidth / spriteWidth;
    // const maxSpriteH = imageHeight / spriteHeight;

    for (let y = 0; y < imageHeight; y+= spriteHeight) {
        for (let x = 0; x < imageWidth; x+= spriteWidth) {
            const frame = createFrame(spriteWidth, spriteHeight, x, y, anchor);
            frames[`line${y}-${x}`] = frame;
        }
    }
    const finalAnimations = {};
    for (const [animationName, config] of Object.entries(animations)) {
        const { start, end } = config;
        const frameNames = [];

        for (let y = start[0]; y < end[0] + 1; y+= 1) {
            const yEnd = y === end[0];
            const xEnd = yEnd ? end[1] + 1 : maxSpriteW;

            for (let x = start[1]; x < xEnd; x+= 1) {
                frameNames.push(`line${y * spriteWidth}-${x * spriteHeight}`);
            }
        }

        finalAnimations[animationName] = frameNames;
    }

    return {
        frames,
        animations: finalAnimations,
        meta: {
            version: "1.0",
            image,
            size: {
                w: imageWidth,
                h: imageHeight
            },
            scale: "1"
        }
    }
}

function writeToAsset(data) {
    const fileName = `${path.basename(data.image, ".png")}.json`;
    const atlasJSON = createAtlas(data);

    fs.writeFileSync(path.join(kAssetPath, fileName), JSON.stringify(atlasJSON, null, 2));
}

// const steleAtlasHelper = {
//     size: {
//         image: [576, 384],
//         sprite: [32, 32]
//     },
//     image: "stele.png",
//     anchor: [0, 0],
//     animations: {
//         idle: {
//             start: [0, 0], end: [0, 11]
//         },
//         activate: {
//             start: [1, 0], end: [1, 17]
//         },
//         enabled: {
//             start: [2, 0], end: [2, 4]
//         },
//         idleEnabled: {
//             start: [3, 0], end: [3, 11]
//         },
//         disabled: {
//             start: [4, 0], end: [4, 3]
//         },
//     }
// };

const chestAtlesHelper = {
    size: {
        image: [448, 64],
        sprite: [64, 64]
    },
    image: "chest.png",
    anchor: [0, 0],
    animations: {
        idle: {
            start: [0, 0], end: [0, 0]
        },
        open: {
            start: [0, 0], end: [0, 6]
        }
    }
};

writeToAsset(chestAtlesHelper);

