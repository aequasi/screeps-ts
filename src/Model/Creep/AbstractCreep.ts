import Room from 'Model/Room';
import Spawn from 'Model/Spawn';

export default abstract class AbstractCreep<T extends CreepType> {
    public constructor(
        public readonly room: Room,
        public readonly id: string,
        public readonly type: T,
        public readonly creep: Creep,
    ) {
    }

    public abstract act(): ScreepsReturnCode;

    protected get spawn(): Spawn {
        return this.room.spawns[0];
    }

    protected remember<K extends keyof CreepMemory>(key: K, value?: CreepMemory[K]): CreepMemory[K] {
        if (value === undefined) {
            return this.creep.memory[key];
        }

        this.creep.memory[key] = value;

        return value;
    }

    forget<K extends keyof CreepMemory>(key: K): void {
        delete this.creep.memory[key];
    }

    protected moveToSpawn(): ScreepsReturnCode {
        return this.creep.moveTo(this.spawn.spawn.pos);
    }
}
