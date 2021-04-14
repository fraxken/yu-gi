// Require Node.js Dependency
const fs = require("fs");
const path = require("path");

// Require Third-party Dependency
const parser = require("xml2json");

// CONSTANTS
const kAssetDir = path.join(__dirname, "..", "assets");
const kTileMapsDir = path.join(kAssetDir, "tilemaps");
const kTileSetsDir = path.join(kAssetDir, "tilesets");

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

function readXML(xmlFilePath) {
    const fileStr = fs.readFileSync(xmlFilePath);
    const { tileset } = JSON.parse(parser.toJson(fileStr));

    tileset.tilewidth = Number(tileset.tilewidth);
    tileset.tileheight = Number(tileset.tileheight);
    tileset.tilecount = Number(tileset.tilecount);
    tileset.columns = Number(tileset.columns);
    tileset.margin = Number(tileset.margin || "0");
    tileset.image.width = Number(tileset.image.width);
    tileset.image.height = Number(tileset.image.height);

    return tileset;
}

for (const completeFilePath of readdirWithExt(kTileSetsDir, ".png")) {
    kAvailableTileSet.add(path.basename(completeFilePath));
}

for (const completeFilePath of readdirWithExt(kTileMapsDir, ".json")) {
    /** @type {Tiled.TileMap} */
    const data = JSON.parse(fs.readFileSync(completeFilePath, "utf-8"));

    for (const tileset of data.tilesets) {
        const fileNameWithoutExt = path.basename(tileset.source, ".tsx");
        const fileBaseName = `${path.basename(tileset.source)}`;
        tileset.source = `tilesets/${fileBaseName}`;

        const tileSetData = readXML(path.join(kAssetDir, tileset.source));
        tileSetData.image.source = `tilesets/${fileNameWithoutExt}.png`;
        tileset.name = tileSetData.name;

        fs.writeFileSync(
            path.join(kAssetDir, "tilesets", fileNameWithoutExt + ".json"), JSON.stringify(tileSetData, null, 2));

        // if (!kAvailableTileSet.has(fileBaseName)) {
        //     throw new Error(`Unknown TileSet image '${fileBaseName}'`);
        // }
    }

    const dataToWrite = JSON.stringify(data, compactChunkArr, 2);
    fs.writeFileSync(completeFilePath, dataToWrite);
}
