
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
                frameNames.push(`line${y}-${x}`);
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

const test = createAtlas({
    size: {
        image: [200, 2035],
        sprite: [50, 37]
    },
    anchor: [0, 0],
    animations: {
        test: {
            start: [0, 0], end: [2, 2]
        }
    }
});
console.log(JSON.stringify(test.animations, null, 2));
