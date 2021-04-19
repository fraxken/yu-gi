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
     * @param {number} [options.maxRooms=10]
     * @param {number} [options.minRooms=6]
     * @param {number} [options.specialRooms=1]
     * @param {number} [options.maxBoss=1]
     * @param {boolean} [options.includeSecretRoom=false]
     * @param {number} [options.roomWidth]
     * @param {number} [options.roomHeight]
     */
    constructor(size = 10, options = {}) {
        this.floorSize = size;
        this.maxRooms = options.maxRooms || 10;
        this.minRooms = options.minRooms || 6;
        this.maxBoss = options.maxBoss || 1;
        this.specialRooms = options.specialRooms || 1;
        this.includeSecretRoom = options.includeSecretRoom || false;
        this.roomWidth = options.roomWidth || 10;
        this.roomHeight = options.roomHeight || 10;

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

        yield { x, y, type: RoomSpawner.RoomName[this.floorPlan[i]] };
        const neighbours = this.getNeighboursNodes(i);

        if (neighbours.left !== 0) {
            yield* this.explore(i - 1, x - this.roomWidth, y, visitedNodes);
        }
        if (neighbours.right !== 0) {
            yield* this.explore(i + 1, x + this.roomWidth, y, visitedNodes);
        }
        if (neighbours.top !== 0) {
            yield* this.explore(i - this.floorSize, x, y + this.roomHeight, visitedNodes);
        }
        if (neighbours.bottom !== 0) {
            yield* this.explore(i + this.floorSize, x, y - this.roomHeight, visitedNodes);
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
