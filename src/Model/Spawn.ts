import Room from 'Model/Room';
import CreepFactory from 'Factory/CreepFactory';
import settings from 'settings';
import set = Reflect.set;


export default class _Spawn {
    public constructor(public readonly room: Room, public readonly id: string, public readonly spawn: StructureSpawn) {
    }

    public spawnNextCreep() {
        const type = this.getNextSpawnType();
        if (type === false) {
            Cache.memoryForget('next-spawn-' + this.id);

            return;
        }

        if (CreepFactory.spawn(this, type) === OK) {
            Cache.memoryForget('next-spawn-' + this.id);
        }
    }

    private getNextSpawnType(): CreepType | false {
        return Cache.memoryRemember(
            'next-spawn-' + this.id,
            () => {
                // If the spawn is currently spawning, return false
                if (this.spawn.spawning) {
                    return false;
                }

                // If we have less than 20% energy, don't start spawning
                if (this.room.room.energyAvailable / this.room.room.energyCapacityAvailable <= .2) {
                    return false;
                }

                return this.filterSpawnables(this.room.population.distribution);
            },
        );
    }

    private filterSpawnables(distribution: Partial<Settings['creeps']>, minCheck = false): CreepType | false {
        const filtered: Partial<Settings['creeps']> = {};
        let counter                                 = 0;
        let restartWithMinCheck                     = false;

        for (const [t, settings] of Object.entries(distribution)) {
            const type = t as CreepType;

            const currentCount = this.room.getCreepsOfType(type as CreepType).length;

            // Make sure we have a high enough pop to spawn this creep
            if (this.room.creeps.length < settings!.minPopulation) {
                continue;
            }

            // Make sure we have enough extension buildings for the given type
            if (this.room.room.energyCapacityAvailable < settings!.minTotalEnergyCapacity) {
                continue;
            }

            // For the miners, we need to make sure there is room for them at the sources
            if (type === 'CreepMiner') {
                const sources      = this.room.getAvailableSources();
                const allowedSlots = sources
                    .map((source) => source.getAvailablePositions().length)
                    .reduce((a, b) => a + b, 0);

                // Don't spawn more miners if there are no slots available
                if (allowedSlots <= 0 || settings!.total! >= allowedSlots) {
                    continue;
                }
            }

            // Only spawn half as many Carriers as Miners
            if (type === 'CreepCarrier') {
                const miners = this.room.getCreepsOfType('CreepMiner')
                if (settings!.total! >= miners.length / 2) {
                    continue;
                }
            }

            // Have we reached the max amount of this creep that we want
            if (settings!.total! >= settings!.max) {
                continue;
            }

            /**
             * If there are less creeps than required, do this:
             * 1) Check if we are currently running through with minCheck
             * 2) If we aren't, and we are on the first iteration, turn on the minCheck
             * 3) If we aren't, and we aren't on the first iteration, restart, with minCheck on
             * 4) If we are, keep checking
             *
             * If there are more creeps than the min required, keep checking
             */
            if (settings!.min > currentCount) {
                if (!minCheck) {
                    if (counter === 0) {
                        minCheck = true;
                    } else {
                        restartWithMinCheck = true;
                        break;
                    }
                }
            }

            filtered[type] = settings;
        }

        if (restartWithMinCheck) {
            return this.filterSpawnables(filtered, true);
        }

        for (const [t, settings] of Object.entries(filtered)) {
            const type = t as CreepType;
            settings!.chance = Math.floor((Math.random() * 10) + 1) * settings!.priority;
            if (settings!.chance <= 0) {
                delete filtered[type];
            }
        }

        let highest = 0;
        let highestIndex: CreepType | false = false;
        for (const [t, settings] of Object.entries(filtered)) {
            if (!minCheck) {
                return t as CreepType;
            }

            if (settings!.chance! > highest || highestIndex === false) {
                highest = settings!.chance!;
                highestIndex = t as CreepType;
            }
        }

        return highestIndex;
    }
}
