import Room from 'Model/Room';

export default abstract class AbstractCreep<T extends CreepType> {
    public constructor(
        public readonly room: Room,
        public readonly id: string,
        public readonly type: T,
        public readonly creep: Creep,
    ) {
    }

    public abstract act(): void;
}
