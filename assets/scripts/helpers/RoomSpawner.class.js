class RoomSpawner {
    static BossRoom = "B";
    static SecretRoom = "S";
    static EndRoom = "E";
    static SpecialRoom = "L";
    static StartRoom = "X";

    static RoomName = Object.freeze({
        [RoomSpawner.BossRoom]: "boss",
        [RoomSpawner.SecretRoom]: "secret",
        [RoomSpawner.EndRoom]: "end",
        [RoomSpawner.SpecialRoom]: "special",
        [RoomSpawner.StartRoom]: "start",
        1: "room"
    });

    /**
     * @param {!number} size
     * @param {object} options
     * @param {number} [options.maxRooms=4]
     * @param {number} [options.minRooms=3]
     * @param {number} [options.specialRooms=1]
     * @param {number} [options.maxBoss=1]
     * @param {boolean} [options.includeSecretRoom=false]
     * @param {number} [options.roomWidth=40]
     * @param {number} [options.roomHeight=26]
     * @param {number} [options.marginWidth=10]
     * @param {number} [options.marginHeight=10]
     * @param {number} [options.tileSize=16]
     */
    constructor(size = 10, options = {}) {
        this.floorSize = size;
        this.maxRooms = options.maxRooms || 4;
        this.minRooms = options.minRooms || 3;
        this.maxBoss = options.maxBoss || 1;
        this.specialRooms = options.specialRooms || 0;
        this.includeSecretRoom = options.includeSecretRoom || false;
        this.tileSize = options.tileSize || 16;
        this.roomWidth = (options.roomWidth || 40) * this.tileSize;
        this.roomHeight = (options.roomHeight || 26) * this.tileSize;
        this.marginWidth = (options.marginWidth || 2) * this.tileSize;
        this.marginHeight = (options.marginHeight || 2) * this.tileSize;

        this.reset();
    }

    get size() {
        return this.floorSize * this.floorSize;
    }

    reset() {
        this.started = false;
        this.endRoom = null;

        this.endRooms = [];
        this.cellQueue = [];
        this.floorPlan = [];

        for (let i = 0; i <= this.size; i++) {
            this.floorPlan[i] = 0;
        }
        this.floorPlanCount = 0;
        this.startPosition = Math.floor((this.size / 2) - (this.floorSize / 2));
    }

    randomEndRoom() {
        const index = Math.floor(Math.random() * this.endRooms.length);
        const i = this.endRooms[index];
        this.endRooms.splice(index, 1);

        return i;
    }

    isGivenRoomNeighbour(room, i) {
        return room === i - 1 || room === i + 1 || room === i + this.floorSize || room === i - this.floorSize;
    }

    pickSecretRoom() {
        for (let tentative = 0; tentative < 900; tentative++) {
            // TODO: restrict x and y to floorSize ?
            const x = Math.floor(Math.random() * 9) + 1;
            const y = Math.floor(Math.random() * 8) + 2;

            const i = y * this.floorSize + x;

            if (this.floorPlan[i] || this.isGivenRoomNeighbour(this.endRoom, i)) {
                continue;
            }

            const nCount = this.neighboursCount(i);
            if (nCount >= 3 || (tentative > 300 && nCount >= 2) || (tentative > 600 && nCount >= 1)) {
                return i;
            }
        }
    }

    /**
     * @param {!number} i cell position
     * @returns {number}
     */
    neighboursCount(i) {
        return this.floorPlan[i - this.floorSize] + this.floorPlan[i - 1] + this.floorPlan[i + 1] + this.floorPlan[i + this.floorSize];
    }

    /**
     * @param {!number} i cell position
     */
    visit(i) {
        if (this.floorPlan[i]) {
            return false;
        }

        const neighbours = this.neighboursCount(i);
        if (neighbours > 1 || this.floorPlanCount >= this.maxRooms || (Math.random() < 0.5 && i !== this.startPosition)) {
            return false;
        }

        this.cellQueue.push(i);
        this.floorPlan[i] = 1;
        this.floorPlanCount += 1;

        // img(scene, i, 'cell')
        return true;
    }

    reDraw() {
        this.reset();
        this.draw();
    }

    draw() {
        if (this.started) {
            return;
        }

        this.started = true;
        this.visit(this.startPosition);

        while (this.cellQueue.length > 0) {
            const i = this.cellQueue.shift();
            const x = i % this.floorSize;

            let created = false;
            if (x > 1) {
                created = created | this.visit(i - 1);
            }
            if (x < 9) {
                created = created | this.visit(i + 1);
            }
            if (i > 20) {
                created = created | this.visit(i - this.floorSize);
            }
            if (i < 70) {
                created = created | this.visit(i + this.floorSize);
            }

            if (!created) {
                this.endRooms.push(i);
            }
        }

        if (this.floorPlanCount < this.minRooms) {
            return this.reDraw();
        }

        for (let i = 0; i < this.maxBoss; i++) {
            const bossRoom = this.endRooms.pop();
            if (!bossRoom) {
                return this.reDraw();
            }

            if (i === 0) {
                this.endRoom = bossRoom;
                this.floorPlan[bossRoom] = RoomSpawner.EndRoom;
            }
            else {
                this.floorPlan[bossRoom] = RoomSpawner.BossRoom;
            }
        }

        for (let i = 0; i < this.specialRooms; i++) {
            const position = this.randomEndRoom();
            if (!position) {
                return this.reDraw();
            }
            this.floorPlan[position] = RoomSpawner.SpecialRoom;
        }

        if (this.includeSecretRoom) {
            const secretRoom = this.pickSecretRoom();
            if (!secretRoom) {
                return this.reDraw();
            }
            this.floorPlan[secretRoom] = RoomSpawner.SecretRoom;
        }

        this.floorPlan[this.startPosition] = RoomSpawner.StartRoom;
    }

    print() {
        for (let i = 0; i < this.size; i++) {
            if (i % this.floorSize === 0) {
                process.stdout.write("\n");
            }

            const kind = this.floorPlan[i];
            process.stdout.write((kind === 0 ? " " : String(kind)) + " ");
        }
    }

    getNeighboursNodes(i) {
        return {
            top: this.floorPlan[i - this.floorSize],
            left: this.floorPlan[i - 1],
            right: this.floorPlan[i + 1],
            bottom: this.floorPlan[i + this.floorSize]
        }
    }

    *explore(i, x, y, visitedNodes) {
        if (visitedNodes.has(i)) {
            return;
        }
        visitedNodes.add(i);

        const neighbours = this.getNeighboursNodes(i);
        const hasLeft = neighbours.left !== 0;
        const hasRight = neighbours.right !== 0;
        const hasTop = neighbours.top !== 0;
        const hasBottom = neighbours.bottom !== 0;

        yield {
            id: i,
            doors: {
                top: hasTop ? i - this.floorSize : null,
                bottom: hasBottom ? i + this.floorSize : null,
                left: hasLeft ? i - 1 : null,
                right: hasRight ? i + 1 : null
            },
            x, y, type: RoomSpawner.RoomName[this.floorPlan[i]]
        };

        const roomHeight = this.roomHeight + this.marginHeight;
        const roomWidth = this.roomWidth + this.marginWidth;
        if (hasLeft) {
            yield* this.explore(i - 1, x - roomWidth, y, visitedNodes);
        }
        if (hasRight) {
            yield* this.explore(i + 1, x + roomWidth, y, visitedNodes);
        }
        if (hasTop) {
            yield* this.explore(i - this.floorSize, x, y - roomHeight, visitedNodes);
        }
        if (hasBottom) {
            yield* this.explore(i + this.floorSize, x, y + roomHeight, visitedNodes);
        }
    }

    *getWorldRooms() {
        const visited = new Set();

        try {
            yield* this.explore(this.startPosition, 0, 0, visited);
        }
        finally {
            visited.clear();
        }
    }
}

module.exports = RoomSpawner;
