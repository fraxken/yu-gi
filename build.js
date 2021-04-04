// Import Node.js Dependencies
const path = require("path");
const fs = require("fs");

// Import Third-party Dependencies
const esbuild = require("esbuild");

// CONSTANTS
const kAssetsDir = path.join(__dirname, "assets");
const kOutDir = path.join(__dirname, "out");

fs.mkdirSync(kOutDir, { recursive: true });

async function main() {
    await esbuild.build({
        entryPoints: [path.join(kAssetsDir, "scripts", "main.js")],
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

    fs.copyFileSync(path.join(kAssetsDir, "favicon.ico"), path.join(kOutDir, "favicon.ico"))
    fs.copyFileSync(path.join(__dirname, "editor.html"), path.join(kOutDir, "index.html"));
}
main().catch(() => process.exit(1));