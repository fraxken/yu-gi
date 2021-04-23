import * as PIXI from "pixi.js";

export default class zIndexManager {
    static negativeId = 1;
    static positiveId = 3;

    /**
     * @param {!PIXI.Container | PIXI.Graphics} target
     * @param {!(PIXI.Container | PIXI.Graphics)[]} items
     */
    constructor(target, items = []) {
        this.target = target;
        this.target.zIndex = 2;

        this.items = new Set(items);
        this.started = true;
    }

    /**
     * @param {!PIXI.Container | PIXI.Graphics} item
     * @returns
     */
    addItem(item) {
        this.items.add(item);
        item.once("destroy", () => this.items.delete(item));

        return this;
    }

    stop() {
        this.items = new Set();
        this.started = false;
    }

    update() {
        if (!this.started || this.target === null) {
            return;
        }

        const targetY = this.target.position.y;
        for (const item of this.items) {
            // const midHeight = item.height / 2;
            const itemPosY = item.position.y;

            // at the top of the object
            if (itemPosY > targetY) {
                if (item.zIndex !== zIndexManager.positiveId) {
                    console.log("target at the top!");
                    item.zIndex = zIndexManager.positiveId;
                }
            }
            // at the bottom of the object
            else if (item.zIndex !== zIndexManager.negativeId) {
                console.log("target at the bottom!");
                item.zIndex = zIndexManager.negativeId;
            }
        }
    }
}
