"use strict";

// Require Node.js Dependencies
const fs = require("fs");
const path = require("path");

// Require Third-party Dependencies
const { ESTree } = require("node-estree");
const astring = require("astring");

function createImport(name) {
    const id = ESTree.Identifier(name);
    const declaration = ESTree.ImportDeclaration(
        [ESTree.ImportDefaultSpecifier(id)],
        ESTree.Literal("./" + name)
    );

    return { id, declaration };
}

function generateImportExport(baseDir) {
    const ast = [];
    const ids = new Set();
    const dirents = fs.readdirSync(baseDir, { withFileTypes: true });

    for (const dirent of dirents) {
        if (!dirent.isFile() || path.extname(dirent.name) !== ".js" || dirent.name === "index.js") {
            continue;
        }

        const { id, declaration } = createImport(path.basename(dirent.name, ".js"));
        ast.push(declaration);
        ids.add(id);
    }

    const specifiers = [...ids].map((id) => ESTree.ExportSpecifier(id, id));
    ast.push(ESTree.ExportNamedDeclaration(null, specifiers));
    const prog = ESTree.Program("module", ast);
    const code = astring.generate(prog);

    fs.writeFileSync(path.join(baseDir, "index.js"), code);
}

module.exports = { generateImportExport };
