import StoreManager from 'Manager/StoreManager';

export default class Store {
    public get energy() {
        return this.store.store.getUsedCapacity(RESOURCE_ENERGY)
    }

    public get energyCapacity() {
        return this.store.store.getCapacity(RESOURCE_ENERGY);
    }

    constructor(public readonly store: StructureExtension | StructureSpawn) {
    }

    public isEmpty() {
        return this.energy / this.energyCapacity < StoreManager.EMPTY_LEVEL;
    }
}
