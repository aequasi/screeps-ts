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
     * New Logic
     *
     * Creep will continue mining a single node, until a carrier is close enough.
     * Once a carrier is close enough, it will transfer the energy to the carrier
     *
     */
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
    public act(): ScreepsReturnCode {
        const resource = this.findResource();
        const spot     = this.findMiningSpot(resource);
        resource.addCreep(this, spot);

        if (!this.creep.pos.isEqualTo(spot)) {
            let moveStatus = this.creep.moveTo(spot);
            if (moveStatus === -2) {
                // If we can't get there. Do nothing (maybe instead move to spawn)
                return OK;
            }
        }

        this.pickupEnergy();
        this.giveEnergy();

        return this.creep.harvest(resource.source);
    }

    private pickupEnergy() {
        if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
            return;
        }

        const targets = this.creep.pos.findInRange(FIND_DROPPED_RESOURCES, 2)
                            .filter((x) => x.resourceType === RESOURCE_ENERGY);
        for (const target of targets) {
            this.creep.pickup(target);
        }
    }

    private giveEnergy() {
        const carriers = this.creep.pos.findInRange(FIND_MY_CREEPS, 1)
                             .filter((x) => x.memory.role === 'CreepCarrier');
        if (carriers.length === 0) {
            return;
        }

        for (const carrier of carriers) {
            if (carrier.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                this.creep.transfer(carrier, RESOURCE_ENERGY);
            }
        }
    }

    private findResource(): Source {
        let source: Source;
        const sourceId = this.remember('source');
        if (!sourceId) {
            const sources = _.sortBy(this.room.getAvailableSources(), (a) => this.creep.pos.getRangeTo(a.source.pos))
                             .filter((s) => s.getAvailablePositions().length > 0);
            source        = sources[0];
            this.remember('source', source.source.id);
        } else {
            source = this.room.sources.find((s) => s.source.id === sourceId)!;
        }

        return source;
    }

    private checkSpot(resource: Source, spot: RoomPosition): boolean {
        if (spot?.isEqualTo(this.creep.pos)) {
            return true;
        }

        const look = spot.look();
        if (!this.isSpotOccupied(look!)) {
            return true;
        }

        // log(`Spot ${spot} is occupied for ${this.id}. Removing creep and continuing`);
        // Try to move that thing
        // Else, continue;
        resource.removeCreep(this);

        return false;
    }

    private findMiningSpot(resource: Source): RoomPosition {
        const existing = resource.getCreep(this);
        if (existing) {
            const {x, y, roomName} = existing.position;
            const pos              = new RoomPosition(x, y, roomName);
            if (this.checkSpot(resource, pos)) {
                return pos;
            }
        }

        const spots = resource.getAvailablePositions();

        /**
         * Loop through all the spots
         *  * If we are already in a spot, stay there
         *  * If the spot is occupied, try the next stop
         *  * If there is any OTHER creep there, make them move (maybe)
         *  * If there is nothing there, lets move there
         */
        for (const spot of spots) {
            if (this.checkSpot(resource, spot!)) {
                return spot!;
            }
        }

        this.forget("source");
        resource.removeCreep(this)

        // Otherwise, go chill at spawn
        return this.room.spawns[0].spawn.pos;
    }

    /**
     * @todo Check to see if item CAN move
     */
    private isSpotOccupied(look: LookAtResult[]): boolean {
        for (const item of look) {
            if (item.type === LOOK_CREEPS) {
                if (item.creep!.memory.role === 'CreepMiner') {
                    return true;
                }

                Game.creeps[item.creep!.name].moveTo(this.room.spawns[0].spawn.pos);

                return false;
            }
        }

        return false;
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
        this.creep.moveTo(this.target!);
    }

    private isFull(): boolean {
        return this.creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0;
    }

    private isEmpty(): boolean {
        return this.creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0;
    }
}
