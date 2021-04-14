// Require Node.js Dependency
const fs = require("fs");
const path = require("path");

// CONSTANTS
const kTileMapsDir = path.join(__dirname, "..", "assets", "tilemaps");
const kTileSetsDir = path.join(__dirname, "..", "assets", "tilesets");

/** @type {Set<string>} */
const kAvailableTileSet = new Set();

const compactChunkArr = (key, value) => Array.isArray(value) && key === "data" ? JSON.stringify(value) : value;

function* readdirWithExt(dir, ext) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        if (!dirent.isFile() || path.extname(dirent.name) !== ext) {
            continue;
        }

        yield path.join(dir, dirent.name);
    }
}

for (const completeFilePath of readdirWithExt(kTileSetsDir, ".png")) {
    kAvailableTileSet.add(path.basename(completeFilePath));
}

for (const completeFilePath of readdirWithExt(kTileMapsDir, ".json")) {
    /** @type {Tiled.TileMap} */
    const data = JSON.parse(fs.readFileSync(completeFilePath, "utf-8"));

    for (const tileset of data.tilesets) {
        if (path.extname(tileset.source) !== ".tsx") {
            continue;
        }

        const fileBaseName = `${path.basename(tileset.source, ".tsx")}.png`;
        if (!kAvailableTileSet.has(fileBaseName)) {
            throw new Error(`Unknown TileSet image '${fileBaseName}'`);
        }
        tileset.source = `tilesets/${fileBaseName}`;
    }

    const dataToWrite = JSON.stringify(data, compactChunkArr, 2);
    fs.writeFileSync(completeFilePath, dataToWrite);
}
