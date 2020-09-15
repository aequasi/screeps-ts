import _Source from 'Model/Source';
import Spawn from 'Model/Spawn';
import AbstractCreep from 'Model/Creep/AbstractCreep';
import CreepFactory from 'Factory/CreepFactory';
import Population from 'Model/Population';
import StoreManager from 'Manager/StoreManager';

export default class _Room {
    public readonly sources: _Source[]           = [];
    public readonly spawns: Spawn[]              = [];
    public readonly creeps: AbstractCreep<any>[] = [];
    public readonly storeManager: StoreManager;
    public readonly population: Population;

    public constructor(public readonly name: string, public readonly room: Room) {
        this.initialize<_Source, Source>(this.sources, FIND_SOURCES, (s) => new _Source(this, s.id, s));
        this.initialize<Spawn, StructureSpawn>(this.spawns, FIND_MY_SPAWNS, (s) => new Spawn(this, s.id, s));
        this.initialize<AbstractCreep<any>, Creep>(this.creeps, FIND_MY_CREEPS, (c) => CreepFactory.create(this, c));

        this.storeManager = new StoreManager(this);
        this.population = new Population(this);
    }

    private initialize<T, IT>(obj: T[], findConst: FindConstant, callback: (s: IT) => T): void {
        const items = this.room.find(findConst) as unknown as IT[];

        for (const item of items) {
            const key        = 'id' in item ? 'id' : 'name';
            const identifier = (item as any)[key];

            // @ts-ignore
            if (obj.filter((x) => x[key] === identifier).length === 0) {
                obj.push(callback(item));
            }
        }
    }

    public getCreepsOfType<T extends CreepType>(type: T): AbstractCreep<T>[] {
        return this.creeps.filter((c) => c.type === type);
    }

    public getAvailableSources(checkOccupied = false): _Source[] {
        return this.sources.filter((source) => source.getAvailablePositions(checkOccupied).length > 0);
    }
}
