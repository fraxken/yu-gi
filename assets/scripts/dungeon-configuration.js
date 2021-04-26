
module.exports = {
    //
    // PROFONDEUR 1
    //
    1: {
        1: {
            spawner: {
                minRooms: 2, maxRooms: 3, specialRooms: 1
            },
            ia: {
                defenseMultiplier: 1,
                attackMultiplier: 1,
                hpMultiplier: 5,
                missRatio: 0.45
            },
            goldMultiplier: 1
        },
        2: {
            spawner: {
                minRooms: 5, maxRooms: 7, specialRooms: 1
            },
            ia: {
                defenseMultiplier: 1,
                attackMultiplier: 1,
                hpMultiplier: 5,
                missRatio: 0.40
            },
            goldMultiplier: 1.25
        },
        3: {
            spawner: {
                minRooms: 6, maxRooms: 8, specialRooms: 1, includeSecretRoom: true, maxBoss: 2
            },
            ia: {
                defenseMultiplier: 1,
                attackMultiplier: 1,
                hpMultiplier: 5,
                missRatio: 0.35
            },
            goldMultiplier: 1.5
        }
    },
    //
    // PROFONDEUR 2
    //
    2: {
        1: {
            spawner: {
                minRooms: 7, maxRooms: 10, specialRooms: 2
            },
            ia: {
                defenseMultiplier: 1,
                attackMultiplier: 1,
                hpMultiplier: 1,
                missRatio: 0.30
            },
            goldMultiplier: 2
        },
        2: {
            spawner: {
                minRooms: 8, maxRooms: 12, specialRooms: 2
            },
            ia: {
                defenseMultiplier: 1,
                attackMultiplier: 1,
                hpMultiplier: 1,
                missRatio: 0.25
            },
            goldMultiplier: 2.5
        },
        3: {
            spawner: {
                minRooms: 9, maxRooms: 14, specialRooms: 2, includeSecretRoom: true, maxBoss: 2
            },
            ia: {
                defenseMultiplier: 1,
                attackMultiplier: 1,
                hpMultiplier: 1,
                missRatio: 0.15
            },
            goldMultiplier: 3
        }
    },
    //
    // PROFONDEUR 3
    //
    3: {
        1: {
            spawner: {
                minRooms: 10, maxRooms: 15, specialRooms: 3, includeSecretRoom: true
            },
            ia: {
                defenseMultiplier: 1,
                attackMultiplier: 1,
                hpMultiplier: 1,
                missRatio: 0.10
            },
            goldMultiplier: 4
        },
        2: {
            spawner: {
                minRooms: 12, maxRooms: 17, specialRooms: 4, includeSecretRoom: true
            },
            ia: {
                defenseMultiplier: 1,
                attackMultiplier: 1,
                hpMultiplier: 1,
                missRatio: 0.05
            },
            goldMultiplier: 6
        },
        3: {
            spawner: {
                minRooms: 15, maxRooms: 20, specialRooms: 5, includeSecretRoom: true, maxBoss: 2
            },
            ia: {
                defenseMultiplier: 1,
                attackMultiplier: 1,
                hpMultiplier: 1,
                missRatio: 0.02
            },
            goldMultiplier: 8
        }
    }
}
