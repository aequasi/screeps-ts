/**
 * @todo
 *
 * move min/max to a callback
 *
 * min: (room) => room.resources.length,
 * max: (room) => room.resource.getTotalPositions().length
 *
 */

const settings: Settings = {
    creeps: {
        CreepMiner:    {
            priority:               1,
            min:                    2,
            max:                    12,
            minTotalEnergyCapacity: 0,
            minPopulation:          0,
            finalStats:             [CARRY, WORK],
            levels:                 [
                {
                    level:     1,
                    abilities: [WORK, CARRY, MOVE],
                },
                {
                    level:     2,
                    abilities: [WORK, WORK, CARRY, MOVE],
                },
                {
                    level:     3,
                    abilities: [WORK, WORK, CARRY, CARRY, MOVE],
                },
                {
                    level:     4,
                    abilities: [WORK, WORK, WORK, CARRY, CARRY, MOVE],
                },
                {
                    level:     5,
                    abilities: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE],
                },
                {
                    level:     6,
                    abilities: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE],
                },
                {
                    level:     7,
                    abilities: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE],
                },
                {
                    level:     8,
                    abilities: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE],
                },
                {
                    level:     9,
                    abilities: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE],
                },
                {
                    level:     10,
                    abilities: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE],
                },
            ],
        },
        CreepBuilder:  {
            priority:               0,
            min:                    1,
            max:                    2,
            minTotalEnergyCapacity: 0,
            minPopulation:          4,
            finalStats:             [CARRY, WORK],
            levels:                 [
                {
                    level:     1,
                    abilities: [WORK, CARRY, MOVE],
                },
                {
                    level:     2,
                    abilities: [WORK, WORK, CARRY, MOVE],
                },
                {
                    level:     3,
                    abilities: [WORK, WORK, WORK, CARRY, MOVE],
                },
                {
                    level:     4,
                    abilities: [WORK, WORK, WORK, WORK, CARRY, MOVE],
                },
                {
                    level:     5,
                    abilities: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
                },
                {
                    level:     6,
                    abilities: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
                },
                {
                    level:     7,
                    abilities: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
                },
                {
                    level:     8,
                    abilities: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
                },
                {
                    level:     9,
                    abilities: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE],
                },
                {
                    level:     10,
                    abilities: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE],
                },
            ],
        },
        CreepCarrier:  {
            priority:               .5,
            min:                    2,
            max:                    2,
            minTotalEnergyCapacity: 0,
            minPopulation:          1,
            finalStats:             [CARRY, CARRY, MOVE],
            levels:                 [
                {
                    level:     1,
                    abilities: [CARRY, CARRY, MOVE],
                },
                {
                    level:     2,
                    abilities: [CARRY, CARRY, CARRY, MOVE],
                },
                {
                    level:     3,
                    abilities: [CARRY, CARRY, CARRY, MOVE, MOVE],
                },
                {
                    level:     4,
                    abilities: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                },
                {
                    level:     5,
                    abilities: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                },
                {
                    level:     6,
                    abilities: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                },
                {
                    level:     7,
                    abilities: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                },
                {
                    level:     8,
                    abilities: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                },
                {
                    level:     9,
                    abilities: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                },
                {
                    level:     10,
                    abilities: [
                        CARRY,
                        CARRY,
                        CARRY,
                        CARRY,
                        CARRY,
                        CARRY,
                        CARRY,
                        CARRY,
                        CARRY,
                        MOVE,
                        MOVE,
                        MOVE,
                        MOVE,
                        MOVE,
                    ],
                },
            ],
        },
        CreepHealer:   {
            priority:               0,
            min:                    0,
            max:                    2,
            minTotalEnergyCapacity: 2,
            minPopulation:          30,
            finalStats:             [TOUGH, HEAL, MOVE],
            levels:                 [
                {
                    level:     1,
                    abilities: [HEAL, MOVE],
                },
                {
                    level:     2,
                    abilities: [HEAL, HEAL, MOVE, TOUGH],
                },
                {
                    level:     3,
                    abilities: [HEAL, HEAL, HEAL, MOVE, TOUGH],
                },
                {
                    level:     4,
                    abilities: [HEAL, HEAL, HEAL, HEAL, MOVE, TOUGH],
                },
                {
                    level:     5,
                    abilities: [HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, TOUGH],
                },
                {
                    level:     6,
                    abilities: [HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, TOUGH],
                },
                {
                    level:     7,
                    abilities: [HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, TOUGH, TOUGH],
                },
                {
                    level:     8,
                    abilities: [HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, TOUGH, TOUGH],
                },
                {
                    level:     9,
                    abilities: [HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, TOUGH, TOUGH],
                },
                {
                    level:     10,
                    abilities: [HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH],
                },
            ],
        },
        CreepDefender: {
            priority:               0,
            min:                    1,
            max:                    5,
            minTotalEnergyCapacity: 0,
            minPopulation:          2,
            finalStats:             [TOUGH, ATTACK],
            levels:                 [
                {
                    level:     1,
                    abilities: [ATTACK, MOVE],
                },
                {
                    level:     2,
                    abilities: [TOUGH, MOVE, ATTACK],
                },
                {
                    level:     3,
                    abilities: [TOUGH, MOVE, ATTACK, ATTACK, MOVE],
                },
                {
                    level:     4,
                    abilities: [TOUGH, MOVE, ATTACK, ATTACK, ATTACK, MOVE],
                },
                {
                    level:     5,
                    abilities: [TOUGH, TOUGH, TOUGH, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE],
                },
                {
                    level:     6,
                    abilities: [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE],
                },
                {
                    level:     7,
                    abilities: [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        MOVE,
                        MOVE,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        MOVE,
                    ],
                },
                {
                    level:     8,
                    abilities: [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        MOVE,
                        MOVE,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        MOVE,
                    ],
                },
                {
                    level:     9,
                    abilities: [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        MOVE,
                        MOVE,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        MOVE,
                    ],
                },
                {
                    level:     10,
                    abilities: [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        MOVE,
                        MOVE,
                        MOVE,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        ATTACK,
                        MOVE,
                    ],
                },
            ],
        },
        CreepAttacker: {
            priority:               0,
            min:                    0,
            max:                    3,
            minTotalEnergyCapacity: 10,
            minPopulation:          40,
            finalStats:             [TOUGH, RANGED_ATTACK],
            levels:                 [
                {
                    level:     1,
                    abilities: [TOUGH, MOVE, RANGED_ATTACK],
                },
                {
                    level:     2,
                    abilities: [TOUGH, TOUGH, MOVE, RANGED_ATTACK],
                },
                {
                    level:     3,
                    abilities: [TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK],
                },
                {
                    level:     4,
                    abilities: [TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK],
                },
                {
                    level:     5,
                    abilities: [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK, MOVE],
                },
                {
                    level:     6,
                    abilities: [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE],
                },
                {
                    level:     7,
                    abilities: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE],
                },
                {
                    level:     8,
                    abilities: [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        MOVE,
                        MOVE,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        MOVE,
                    ],
                },
                {
                    level:     9,
                    abilities: [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        MOVE,
                        MOVE,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        MOVE,
                    ],
                },
                {
                    level:     10,
                    abilities: [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        MOVE,
                        MOVE,
                        MOVE,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        MOVE,
                    ],
                },
            ],
        },
        CreepScout:    {
            priority:               0,
            min:                    0,
            max:                    3,
            minTotalEnergyCapacity: 10,
            minPopulation:          40,
            finalStats:             [TOUGH, RANGED_ATTACK],
            levels:                 [
                {
                    level:     1,
                    abilities: [TOUGH, MOVE, RANGED_ATTACK],
                },
                {
                    level:     2,
                    abilities: [TOUGH, TOUGH, MOVE, RANGED_ATTACK],
                },
                {
                    level:     3,
                    abilities: [TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK],
                },
                {
                    level:     4,
                    abilities: [TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK],
                },
                {
                    level:     5,
                    abilities: [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK, MOVE],
                },
                {
                    level:     6,
                    abilities: [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE],
                },
                {
                    level:     7,
                    abilities: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE],
                },
                {
                    level:     8,
                    abilities: [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        MOVE,
                        MOVE,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        MOVE,
                    ],
                },
                {
                    level:     9,
                    abilities: [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        MOVE,
                        MOVE,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        MOVE,
                    ],
                },
                {
                    level:     10,
                    abilities: [
                        TOUGH,
                        TOUGH,
                        TOUGH,
                        MOVE,
                        MOVE,
                        MOVE,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        RANGED_ATTACK,
                        MOVE,
                    ],
                },
            ],
        },
    },
};

export default settings;
