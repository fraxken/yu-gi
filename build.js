// Import Node.js Dependencies
const path = require("path");
const fse = require("fs-extra");

// Import Third-party Dependencies
const esbuild = require("esbuild");

// Import internal dependencies
const { generateImportExport } = require("./scripts/generator");

// CONSTANTS
const kAssetsDir = path.join(__dirname, "assets");
const kPublicDir = path.join(__dirname, "public");
const kOutDir = path.join(__dirname, "out");

const kAssetsDirToMove = ["sprites", "tilemaps", "tilesets", "sounds", "images"];
const kExtensionToExclude = new Set([".tsx", ".tmx"]);

fse.mkdirSync(kOutDir, { recursive: true });

function filterFiles(fileName) {
    return !kExtensionToExclude.has(path.extname(fileName));
}

async function main() {
    generateImportExport(path.join(kAssetsDir, "scripts", "behaviours"));
    generateImportExport(path.join(kAssetsDir, "scripts", "scenes"));

    await esbuild.build({
        entryPoints: [
            // path.join(kAssetsDir, "scripts", "pixi.js"),
            // path.join(kAssetsDir, "scripts", "layers.js"),
            path.join(kAssetsDir, "scripts", "main.js"),
            path.join(kPublicDir, "hud.js"),
            path.join(kPublicDir, "css", "main.css")
        ],
        loader: {
            ".jpg": "file",
            ".png": "file",
            ".woff": "file",
            ".woff2": "file",
            ".eot": "file",
            ".ttf": "file",
            ".svg": "file",
            ".json": "file"
        },
        platform: "browser",
        bundle: true,
        sourcemap: true,
        treeShaking: true,
        outdir: kOutDir
    });

    //Copy specific file
    fse.copyFileSync(path.join(kAssetsDir, "favicon.ico"), path.join(kOutDir, "favicon.ico"));
    fse.copyFileSync(path.join(__dirname, "editor.html"), path.join(kOutDir, "index.html"));

    // Copy assets folders
    await Promise.all(kAssetsDirToMove.map((name) => {
        return fse.copy(path.join(kAssetsDir, name), path.join(kOutDir, name), { filter: filterFiles })
    }))
}

main().catch((error) => {
    console.error(error);
    process.exit(1)
});
