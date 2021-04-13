// Import third-party dependencies
import { Sound } from "@pixi/sound";

export default class BackgroundMediaPlayer {
    /**
     * @param {object} options
     * @param {string} options.defaultTrack
     * @param {Record<string, string[]>} options.tracks
     */
    constructor(options = {}) {
        const { tracks = {}, defaultTrack } = options;
        if (typeof defaultTrack != "string") {
            throw new TypeError("defaultTrack must be a string");
        }
        if (!(defaultTrack in tracks)) {
            throw new Error(`Unable to found '${defaultTrack}' in options tracks!`);
        }

        this.isStarted = false;
        this.defaultTrack = defaultTrack;

        /** @type {Sound} */
        this.currentSound = null;

        /** @type {string} */
        this.currentTrack = null;

        /** @type {number} */
        this.currentSoundIndex = null;

        /** @type {Map<string, string[]>} */
        this.tracks = new Map(Object.entries(tracks));
    }

    start() {
        if (this.isStarted) {
            return;
        }

        this.currentTrack = this.defaultTrack;

        this.isStarted = true;
    }

    stop() {
        if (!this.isStarted) {
            return;
        }

        this.isStarted = false;
    }

    update() {

    }
}
