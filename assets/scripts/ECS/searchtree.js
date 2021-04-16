// Import internal dependencies
import { Actor, ActorTree } from ".";

// CONSTANTS
const kAlwaysTrue = () => true;

export default class SearchTree {
    /**
     * @param {!RegExp | string} pattern
     * @returns {(actor: Actor) => boolean}
     */
    static parsePattern(pattern) {
        const type = typeof pattern;

        return (/** @type {Actor} */ actor) => {
            return type === "string" ? actor.name.startsWith(pattern) : pattern.test(actor.name);
        }
    }

    /**
     * @param {!RegExp | string} pattern
     * @param {(actor: Actor) => boolean} filter
     */
    constructor(pattern, filter = null) {
        this.pattern = SearchTree.parsePattern(pattern);
        this.filter = filter || kAlwaysTrue;

        this.active = false;

        /** @type {Set<ActorTree>} */
        this.sources = new Set();

        /** @type {Set<Actor>} */
        this.currentActorsRef = new Set();
    }

    /**
     * @returns {Actor[]}
     */
    get actors() {
        return [...this.currentActorsRef];
    }

    search() {
        for (const source of this.sources) {
            for (const actor of source.getActors(true)) {
                this.addActor(actor);
            }
        }

        this.active = true;
    }

    /**
     * @param {!ActorTree} actorTree
     */
    use(tree) {
        if (!(tree instanceof ActorTree)) {
            throw new TypeError("tree must be an instanceof ActorTree");
        }

        this.sources.add(tree);
        const bindFn = this.addActor.bind(this);
        tree.on("appendActor", bindFn);
        tree.once("cleanup", () => {
            this.sources.delete(tree);
            tree.removeListener("appendActor", bindFn);
        });
    }

    /**
     * @param {!Actor} actor
     */
    addActor(actor) {
        if (!this.active || !this.pattern(actor) || !this.filter(actor)) {
            return false;
        }

        this.currentActorsRef.add(actor);
        actor.once("destroy", () => {
            this.currentActorsRef.delete(actor);
        });

        return true;
    }

    *[Symbol.iterator]() {
        yield* this.currentActorsRef;
    }
}
