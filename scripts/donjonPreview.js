const RoomSpawner = require("../assets/scripts/helpers/RoomSpawner.class");

const [roomId = 1, niveauId = 1] = process.argv.slice(2);

const Settings = {
    1: {
        1: { minRooms: 4, maxRooms: 5 },
        2: { minRooms: 5, maxRooms: 7, specialRooms: 1 },
        3: { minRooms: 6, maxRooms: 8, specialRooms: 1, includeSecretRoom: true }
    },
    2: {
        1: { minRooms: 7, maxRooms: 10, specialRooms: 2 },
        2: { minRooms: 8, maxRooms: 12, specialRooms: 2 },
        3: { minRooms: 9, maxRooms: 14, specialRooms: 2, includeSecretRoom: true, maxBoss: 2 }
    },
    3: {
        1: { minRooms: 10, maxRooms: 15, specialRooms: 3, includeSecretRoom: true },
        2: { minRooms: 12, maxRooms: 17, specialRooms: 4, includeSecretRoom: true, maxBoss: 2 },
        3: { minRooms: 15, maxRooms: 20, specialRooms: 5, includeSecretRoom: true, maxBoss: 3 }
    }
}

console.log("X -> START ROOM");
console.log("L -> SPECIAL ROOM");
console.log("E -> END ROOM");
console.log("S -> S ROOM");
console.log("B -> BOSS ROOM");
console.log("----\n");

const dungeon = new RoomSpawner(10, {
    ...Settings[roomId][niveauId]
});
dungeon.draw();
dungeon.print();
