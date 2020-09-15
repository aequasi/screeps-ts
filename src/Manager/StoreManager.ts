import Room from 'Model/Room';
import Store from 'Model/Store';

export default class StoreManager {
    public static readonly EMPTY_LEVEL = 0.5;

    private readonly stores: Store[];

    private get spawns() {
        return this.room.spawns;
    }

    constructor(public readonly room: Room) {
        this.stores = room.room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_EXTENSION})
                          .map((x) => new Store(x as unknown as StructureExtension));

        room.spawns.forEach(s => {
            this.stores.push(new Store(s.spawn));
        });
    }

    getSpawnStore() {
        return this.spawns[0];
    }

    getEmptyStores() {
        const empty = [];
        for (const store of this.stores) {
            if (this.isEmptyStore(store.store)) {
                empty.push(store.store);
            }
        }

        return empty;
    }

    isEmptyStore(store: StructureSpawn | StructureExtension) {
        return store.energy / store.energyCapacity < StoreManager.EMPTY_LEVEL;
    }

    getEmptyStoreById(id: Id<StructureSpawn | StructureExtension>) {
        const resource = Game.getObjectById(id);

        return resource && this.isEmptyStore(resource) ? resource : false;
    }

    getClosestEmptyStore(creep: Creep): StructureSpawn | StructureExtension {
        const resources                                          = this.getEmptyStores();
        let resource: StructureSpawn | StructureExtension | null = null;

        if (resources.length != 0) {
            resource = creep.pos.findClosestByRange<StructureSpawn | StructureExtension>(resources);
        }

        return (resource ?? this.getSpawnStore()) as any;
    }

    energy() {
        return this.stores.map(store => store.energy).reduce((a, b) => a + b, 0);
    }

    energyCapacity() {
        return this.stores.map(store => store.energyCapacity).reduce((a, b) => a + b, 0);
    }

    getFullStores() {
        return this.stores.filter(store => store.energy == store.energyCapacity);
    }
}
