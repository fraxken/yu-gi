declare namespace Tiled {
    export interface AnimationFrame {
        tileid: number;
        duration: number;
    }

    export interface Tile {
        id: number;
        properties?: Property[];
        animation: {
            frame: AnimationFrame[];
        }
    }

    export interface TileSet {
        firstgid: number;
        source: string;
        name: string;
        tilewidth: number;
        tileheight: number;
        tilecount: number;
        columns: number;
        margin: number;
        image: {
            source: string;
            width: number;
            height: number;
        }
        tile?: Tile | Tile[];
    }

    export interface TileChunk {
        data: string;
        width: number;
        height: number;
        x: number;
        y: number;
    }

    export interface TileObject {
        id: number;
        name: string;
        width: number;
        height: number;
        x: number;
        y: number;
        visible: boolean;
        rotation: number;
        type: string;
        ellipse?: boolean;
        properties?: Property[];
    }

    export interface TileLayer {
        id: number;
        data?: string;
        chunks: TileChunk[];
        width: number;
        height: number;
        x: number;
        y: number;
        name: string;
        opacity: number;
        startx: number;
        starty: number;
        type: "csv" | "tilelayer" | "base64" | "objectgroup";
        visible: boolean;
        draworder?: "topdown" | "index";
        properties?: Property[];
        tintcolor?: string;
        objects?: TileObject[];
    }

    export interface Property {
        name: string;
        type: "string" | "int" | "float" | "bool" | "color" | "file";
        value: any;
    }

    export interface TileMap {
        backgroundcolor?: string;
        compressionlevel: number;
        editorsettings: {
            export: {
                format: "json";
                target: string;
            };
        };
        width: number;
        height: number;
        tilewidth: number;
        tileheight: number;
        hexsidelength?: number;
        infinite: boolean;
        nextlayerid: number;
        nextobjectid: number;
        orientation: "orthogonal" | "isometric" | "staggered" | "hexagonal";
        renderorder: "right-down" | "right-up" | "left-down" | "left-up";
        staggeraxis?: "x" | "y";
        staggerindex?: "odd" | "even";
        tiledversion: string;
        version: number;
        type: "map";
        tilesets: TileSet[];
        layers: TileLayer[];
        properties?: Property[];
    }
}

// interface Window {
//     game: Engine;
// }

// declare var game: Engine;
