import AbstractCreep from 'Model/Creep/AbstractCreep';

export interface EnergySource {
    positions: RoomPosition[];
    creeps: {creep: Creep; position: RoomPosition}[]
}



declare global {
    type CreepMiner = 'CreepMiner';
    type CreepScout = 'CreepScout';
    type CreepBuilder = 'CreepBuilder';
    type CreepCarrier = 'CreepCarrier';
    type CreepHealer = 'CreepHealer';
    type CreepDefender = 'CreepDefender';
    type CreepAttacker = 'CreepAttacker';
    type CreepType = CreepMiner | CreepScout | CreepBuilder | CreepCarrier | CreepHealer | CreepDefender | CreepAttacker;

    interface Distribution {
        /**
         * Current number of this creep type
         */
        total?: number;

        /**
         * Current percent of this creep type
         */
        currentPercentage?: number;

        /**
         * Priority of spawn chance
         */
        priority: number;

        /**
         * Current chance this creep will spawn next
         */
        chance?: number;

        /**
         * Minimum Amount to spawn
         */
        min: number;

        /**
         * Maximum amoutn to spawn
         */
        max: number;

        /**
         * Required total amount of energy required
         */
        minTotalEnergyCapacity: number;

        /**
         * Required number of total creeps to have, before allowing spawns
         */
        minPopulation: number;

        /**
         * BodyParConstant[] of each tier of this creep
         */
        levels: Level[];

        /**
         * BodyPartConstant[] to give to the creep after hitting max level
         */
        finalStats: BodyPartConstant[];
    }

    interface Level {
        level: number;
        cost?: number;
        abilities: BodyPartConstant[];
    }

    interface Settings {
        creeps: {[key in CreepType]: Distribution};
    }
}
