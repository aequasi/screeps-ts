import AbstractCreep from 'Model/Creep/AbstractCreep';
import Source from 'Model/Source';
import Spawn from 'Model/Spawn';

type State = 'mining' | 'depositing' | undefined;

export default class _CreepMiner extends AbstractCreep<CreepMiner> {
    private source: Source | undefined;
    private deposit: Spawn | undefined;

    private get state(): State {
        return this.creep.memory.state;
    }

    private set state(state: State) {
        this.creep.memory.state = state;
    }

    private get target(): RoomPosition | undefined {
        return this.state === 'mining' ? this.source?.source.pos : this.deposit?.spawn.pos;
    }

    /**
     * Steps:
     *
     * 1. Should we be mining (do we currently not carry max energy)
     *      a. Yes? Move to source
     *          i. Find mining location
     *          ii. Move to mining location
     *          iii. Start mining until full
     *      b. No? Move to spawn
     *          i. Find closest spawn (this might change later)
     *          ii. Move to spawn
     *          iii. Deposit energy until empty
     *
     * Need to keep track of the current state: 'mining' | 'depositing'
     */
    public act(): void {
        if (!this.state) {
            this.state = 'mining';
        }

        if (!this.source) {
            this.source = this.getMiningSpot();
        }

        if (!this.deposit) {
            this.deposit = this.findDeposit();
        }

        log(this.id, this.state, this.isFull(), this.isEmpty());
        switch (this.state) {
            case 'mining':
                if (this.isFull()) {
                    log(`Switching ${this.id} to depositing`);
                    // Set state to depositing
                    // Find and move to spawn
                    this.state  = 'depositing';

                    return this.move();
                }

                log(`${this.id} harvesting ${this.source.id}`);

                // Attempt to harvest. If its not in range, move to it
                const harvest = this.creep.harvest(this.source.source);
                if (harvest === ERR_NOT_IN_RANGE) {
                    this.move();
                }
                break;
            case 'depositing':
                if (this.isEmpty()) {
                    log(`Switching ${this.id} to mining`);
                    this.state  = 'mining';

                    return this.move();
                }

                if (!this.creep.pos.inRangeTo(this.target!, 1)) {
                    return this.move();
                }

                log(`${this.id} depositing to ${this.deposit.id}`);
                this.creep.transfer(this.deposit?.spawn!, RESOURCE_ENERGY);
                break;

        }
    }

    /**
     * Move to closest mining spot
     * @private
     */
    private getMiningSpot(): Source {
        const sources = _.sortBy(this.room.sources, (s) => this.creep.pos.getRangeTo(s.source.pos));

        return Object.values(sources)[0];
    }

    /**
     * Move to first spawn
     * @private
     */
    private findDeposit(): Spawn {
        return this.room.spawns[0];
    }

    private move(): void {
        log(`${this.id} moving to ${this.target?.x}-${this.target?.y}`);

        this.creep.moveTo(this.target!);
    }

    private isFull(): boolean {
        return this.creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0;
    }

    private isEmpty(): boolean {
        return this.creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0;
    }
}
