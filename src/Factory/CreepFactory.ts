import AbstractCreep from 'Model/Creep/AbstractCreep';
import * as Creeps from 'Model/Creep';
import Room from 'Model/Room';
import settings from 'settings';
import Spawn from 'Model/Spawn';

export default class CreepFactory {
    static ERRORS: Partial<{ [key in ScreepsReturnCode]: string }> = {
        '-1':  'ERR_NOT_OWNER',
        '-3':  'ERR_NAME_EXISTS',
        '-4':  'ERR_BUSY',
        '-6':  'ERR_NOT_ENOUGH_ENERGY',
        '-10': 'ERR_INVALID_ARGS',
    };

    public static create<T extends CreepType, R extends AbstractCreep<T>>(room: Room, creep: Creep): R {
        if (creep.memory.role in Creeps) {
            // @ts-ignore
            return new (Creeps[creep.memory.role])(room, creep.id, creep.memory.role, creep);
        }

        throw new Error('Invalid creep role: ' + creep.memory.role);
    }

    public static spawn<T extends CreepType, R extends AbstractCreep<T>>(spawn: Spawn, type: T): ScreepsReturnCode {
        const id   = ('' + new Date().getTime());
        const data = this.getBestCreepOfType(spawn.room, type);

        const {level, abilities} = data;
        const name               = `${type}-${level}-${id}`;

        // @todo handle energyStructures
        const code = spawn.spawn.spawnCreep(
            abilities,
            name,
            {memory: {role: type, room: spawn.room.name}},
        );
        if (code !== OK) {
            log(
                `Failed to build creep: ${type} @ ${level} (${CreepFactory.ERRORS[code]}) ` +
                `(Energy: ${spawn.room.room.energyAvailable} / ${this.getPointsForAbilities(abilities)})`,
            );

            return code;
        }

        return code;
    }

    private static getBestCreepOfType<T extends CreepType, R extends AbstractCreep<T>>(room: Room, type: T): Level {
        return settings.creeps[type].levels[0];
    }

    private static getPointsForAbilities(abilities: BodyPartConstant[]) {
        const POINTS: { [key in BodyPartConstant]: number } = {
            claim:         0, // @todo FIX
            tough:         10,
            move:          50,
            carry:         50,
            attack:        80,
            work:          100,
            ranged_attack: 150,
            heal:          200,
        };

        let points = 0;
        for (const index in abilities) {
            points += POINTS[abilities[index]];
        }

        return points;
    }
}
