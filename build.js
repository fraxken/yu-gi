// Import Node.js Dependencies
const path = require("path");
const fse = require("fs-extra");

// Import Third-party Dependencies
const esbuild = require("esbuild");

// CONSTANTS
const kAssetsDir = path.join(__dirname, "assets");
const kPublicDir = path.join(__dirname, "public");
const kOutDir = path.join(__dirname, "out");

fse.mkdirSync(kOutDir, { recursive: true });

async function main() {
    await esbuild.build({
        entryPoints: [
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

    //Copy images folder
    fse.copy(
        path.join(kAssetsDir, "sprites"),
        path.join(kOutDir, "sprites")
    );
}

main().catch(() => process.exit(1));