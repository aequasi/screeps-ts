import AbstractCreep from 'Model/Creep/AbstractCreep';
import Source from 'Model/Source';

export default class _CreepCarrier extends AbstractCreep<CreepCarrier> {
    private get state(): CreepMemory['carrierState'] {
        return (this.remember('carrierState') ?? 'pickup');
    }

    private set state(value: CreepMemory['carrierState']) {
        this.remember('carrierState', value);
    }

    /**
     * Get assigned to a source
     * Store state of 'pickup' | 'dropoff'
     * If state === 'pickup' ->
     *      1. Find creep with most energy, grab it
     *      2. If we still have capacity, go to next, grab it
     *      3. When full, Set state to dropoff, and head back to spawn
     * If state === 'dropoff' ->
     *      1. Head to spawn
     *      2. Drop off energy
     *      3. When empty, Set state to 'pickup', and head back to resource
     */
    public act(): ScreepsReturnCode {
        const source = this.findResource();

        switch (this.state) {
            default:
            case 'pickup':
                // if we don't have capacity, switch
                if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                    this.state = 'dropoff';

                    return this.moveToSpawn();
                }

                const creeps = _.sortBy(source.creeps, (x) => {
                    const creep = Game.creeps[x.creep.name];
                    if (!creep) {
                        return -9999;
                    }

                    return creep.store.getUsedCapacity(RESOURCE_ENERGY);
                })
                                .reverse()
                                .filter((x) => !!x)
                                .filter((x) => !!Game.creeps[x.creep.name]);
                if (creeps.length === 0) {
                    return this.moveToSpawn();
                }

                const creep = Game.creeps[creeps[0].creep.name];
                this.creep.moveTo(creep.pos);
                if (!this.creep.pos.inRangeTo(creep.pos, 1)) {
                    return OK;
                }

                return creep.transfer(this.creep, RESOURCE_ENERGY);
            case 'dropoff':
                if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
                    this.state = 'pickup';

                    return OK;
                }

                const deposit = this.room.storeManager.getClosestEmptyStore(this.creep);
                log(`${this.creep.name} - ${source.id} - ${deposit?.id}`);
                if (!deposit) {
                    this.moveToSpawn();

                    return OK;
                }

                if (!this.creep.pos.inRangeTo(deposit, 1)) {
                    this.creep.moveTo(deposit);
                }

                this.creep.transfer(deposit.store as Structure, RESOURCE_ENERGY);

                return OK;
        }
    }

    /**
     * @todo Rewrite this logic to evenly balance the carriers across all sources in a room
     * @private
     */
    private findResource(): Source {
        let source: Source;
        const sourceId = this.remember('source');
        if (!sourceId) {
            const sources = _.sortBy(
                Object.values(this.room.getAvailableSources(false)),
                (s) => s.carriers.length,
            );
            log(`${sources[0].id} - ${sources[0].carriers.length}`)
            log(`${sources[1].id} - ${sources[1].carriers.length}`)
            source        = sources[0];
            source.addCarrier(this)
            this.remember('source', source.source.id);
        } else {
            source = this.room.sources.find((s) => s.source.id === sourceId)!;
        }

        return source;
    }
}
