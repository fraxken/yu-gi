// Import third-party dependencies
import { Sound, sound, Filter } from "@pixi/sound";

// Import Internal dependencies
import Engine from "../ECS/engine.class";

export default class BackgroundMediaPlayer {
    /**
     * @param {object} options
     * @param {string} options.defaultTrack
     * @param {Filter[]} options.defaultFilters
     * @param {Record<string, { name: string, volume?: number, filters?: Filter[] }[]>} options.tracks
     */
    constructor(options = {}) {
        const { tracks = {}, defaultTrack, defaultSoundVolume = 0.05, defaultFilters = [] } = options;
        if (typeof defaultTrack != "string") {
            throw new TypeError("defaultTrack must be a string");
        }
        if (!(defaultTrack in tracks)) {
            throw new Error(`Unable to found '${defaultTrack}' in options tracks!`);
        }

        this.isWaiting = false;
        this.isStarted = false;
        this.defaultSoundVolume = defaultSoundVolume;
        this.defaultFilters = defaultFilters;
        this.defaultTrack = defaultTrack;

        /** @type {Sound} */
        this.currentSound = null;

        /** @type {string} */
        this.currentTrack = null;

        /** @type {number} */
        this.currentSoundIndex = null;

        /** @type {Map<string, { name: string, volume?: number, filters?: Filter[] }[]>} */
        this.tracks = new Map(Object.entries(tracks));
    }

    /**
     *
     * @param {Engine} engine
     */
    bindToEngine(engine) {
        engine.app.renderer.view.addEventListener("mousedown", () => {
            this.play();
            setTimeout(() => engine.on("update", () => this.update()), 200);
        }, { once: true });

        return this;
    }

    getSound(trackName, index) {
        const currentTrack = this.tracks.get(trackName)[index];

        const currentSound = sound.find(currentTrack.name);
        currentSound.volume = currentTrack.volume || this.defaultSoundVolume;
        currentSound.loop = false;
        const soundFilters = [...this.defaultFilters];
        if (Array.isArray(currentTrack.filters)) {
            soundFilters.push(...currentTrack.filters);
        }
        currentSound.filters = soundFilters;

        return currentSound;
    }

    play(trackName = this.defaultTrack, startSound = null) {
        if (this.isStarted) {
            this.stop();
        }

        const track = this.tracks.get(trackName);
        const startIndex = startSound === null ? 0 : (track.findIndex(({ name }) => name === startSound) || 0);

        this.currentTrack = trackName;
        this.currentSoundIndex =  startIndex;
        this.currentSound = this.getSound(this.currentTrack, this.currentSoundIndex);
        this.currentSound.play();

        this.isStarted = true;
    }

    stop() {
        if (this.isStarted) {
            this.currentSound.stop();
        }

        this.currentSound = null;
        this.currentTrack = null;
        this.currentSoundIndex = null;

        this.isStarted = false;
    }

    get trackSize() {
        return this.tracks.get(this.currentTrack).length;
    }

    nextTrackSound(backward = false) {
        this.currentSound.stop();

        if (backward) {
            this.currentSoundIndex = this.currentSoundIndex - 1 <= 0 ? this.trackSize : this.currentSoundIndex - 1;
        }
        else {
            this.currentSoundIndex = this.currentSoundIndex + 1 >= this.trackSize ? 0 : this.currentSoundIndex + 1;
        }
        this.currentSound = this.getSound(this.currentTrack, this.currentSoundIndex);
        this.currentSound.play();

        setTimeout(() => {
            this.isWaiting = false;
        }, 1000);
    }

    update() {
        if (!this.isStarted || this.isWaiting || !this.currentSound.isLoaded) {
            return;
        }

        if (!this.currentSound.isPlaying) {
            console.log("[SOUND] Next track sound triggered!");
            this.isWaiting = true;
            this.nextTrackSound();
        }
    }
}
