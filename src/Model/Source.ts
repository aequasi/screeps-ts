import Room from 'Model/Room';
import {AbstractCreep} from 'Model/Creep';

export default class _Source {
    private static isCreepAlive(creepDict: { creep: Creep }) {
        let creep = creepDict.creep;

        return Game.creeps[creep.name] !== null;
    }

    public get positions() {
        return this.getMemory().positions;
    }

    public get creeps() {
        return this.getMemory().creeps;
    }

    public get carriers() {
        return this.getMemory().carriers;
    }

    public constructor(public readonly room: Room, public readonly id: string, public readonly source: Source) {
        let sourceMemory = this.getMemory();

        // Loop through the 3x3 grid around the source, and log what positions are accessible
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                // The source itself, cannot be occupied, so we skip it
                if (x === 0 && y === 0) {
                    continue;
                }

                const pos = Cache.remember(
                    `room-${room.room.name}-position-at-${this.source.pos.x + x}-${this.source.pos.y + y}`,
                    () => this.room.room.getPositionAt(this.source.pos.x + x, this.source.pos.y + y),
                );

                if (pos && !sourceMemory.positions.find(p => p.x == pos.x && p.y == pos.y)) {
                    sourceMemory.positions.push(pos);
                }
            }
        }

        for (const [index, creep] of Object.entries(sourceMemory.creeps)) {
            if (!Game.creeps[creep.creep.name]) {
                sourceMemory.creeps = sourceMemory.creeps.splice(index as any, 1);
            }
        }
        for (const index of Object.keys(sourceMemory.carriers)) {
            const id = sourceMemory.carriers[index as any];
            if (!Game.creeps[id]) {
                sourceMemory.carriers = sourceMemory.carriers.splice(index as any, 1);
            }
        }

        const memory           = Cache.memoryGet('energySources');
        memory[this.source.id] = sourceMemory;
        Cache.memorySet('energySources', memory);
    }

    /**
     * Gets all the available positions around this source. Filters out terrain, and walls
     * @private
     */
    public getAvailablePositions(checkOccupied = true) {
        return this.positions.map(p => {
            // Fetch the position
            // @todo See if this is worth keeping in memory
            const pos = Cache.remember(
                `room-${this.room.room.name}-position-at-${p.x}-${p.y}`,
                () => this.room.room.getPositionAt(p.x, p.y),
            );
            if (!pos) {
                return null;
            }

            // @todo See if this is worth keeping in memory
            const look = Cache.remember('look-position-' + p.x + 'x' + p.y, pos.look.bind(pos));

            for (const position of look) {
                // If There is a wall, its not available
                if (position.type === 'terrain' && position.terrain === 'wall') {
                    return null;
                }

                // If a creep owns this spot already, and that creep still exists, its not available
                let creepDict = this.creeps.find((dict) => pos.isEqualTo(dict.position));
                if (checkOccupied && creepDict) {
                    if (_Source.isCreepAlive(creepDict)) {
                        return null;
                    }

                    this.removeCreepByIndex(this.creeps.findIndex(dict => dict.position.isEqualTo(pos)));
                }
            }

            return pos;
        }).filter(pos => pos !== null);
    }

    public getAvailablePosition(creep: AbstractCreep<CreepMiner>) {
        const cachedPosition = this.getCachedPosition(creep);
        if (cachedPosition) {
            return cachedPosition;
        }

        let positions = this.getAvailablePositions();

        if (positions.length == 0) {
            throw new Error('There are no positions in this creep\'s room.');
        }

        let pos = _.sample(positions);

        this.addCreep(creep, pos!);

        return pos;
    }

    public getCreep(creep: AbstractCreep<CreepMiner>) {
        return this.creeps.find((x) => x.creep.id === creep.id);
    }

    /**
     * Adds this creep, and their location, to the memory, so the next loop is aware of whats goin on
     * @param creep
     * @param position
     */
    public addCreep(creep: AbstractCreep<CreepMiner>, position: RoomPosition) {
        let sourceMemory = this.getMemory();

        if (!sourceMemory.creeps.find(c => c.creep.id == creep.id)) {
            sourceMemory.creeps.push({creep: creep.creep, position: position});
        }

        let memory             = Cache.memoryGet('energySources');
        memory[this.source.id] = sourceMemory;
        Cache.memorySet('energySources', memory);
    }

    /**
     * Adds this carrier to the memory, so the next loop is aware of whats goin on
     * @param creep
     */
    public addCarrier(creep: AbstractCreep<CreepCarrier>) {
        let sourceMemory = this.getMemory();

        if (!sourceMemory.carriers.find(c => c == creep.id)) {
            sourceMemory.carriers.push(creep.id as Id<Creep>);
        }

        let memory             = Cache.memoryGet('energySources');
        memory[this.source.id] = sourceMemory;
        Cache.memorySet('energySources', memory);
    }

    public removeCreep(creep: AbstractCreep<CreepMiner>) {
        let sourceMemory = this.getMemory();
        const index      = sourceMemory.creeps.findIndex((x) => x.creep.id === creep.id);
        if (index >= 0) {
            this.removeCreepByIndex(index);
        }
    }

    public removeCarrier(creep: AbstractCreep<CreepCarrier>) {
        let sourceMemory = this.getMemory();
        const index      = sourceMemory.carriers.findIndex((x) => x === creep.id);
        if (index >= 0) {
            this.removeCarrierByIndex(index);
        }
    }

    private getMemory() {
        const memory = Cache.memoryRemember('energySources', () => {
            return {};
        });

        memory[this.source.id] = _.extend({positions: [], creeps: [], carriers: []}, memory[this.source.id]);

        return memory[this.source.id];
    }

    /**
     * Grabs the creeps mining location from memory
     * @param creep
     * @private
     */
    private getCachedPosition(creep: AbstractCreep<CreepMiner>) {
        let memory = this.getMemory();

        let c = memory.creeps.find(c => c.creep.id == creep.id);
        if (!c) {
            return null;
        }

        let p = c.position;

        return Cache.remember(
            `room-${this.room.room.name}-position-at-${p.x}-${p.y}`,
            () => this.room.room.getPositionAt(p.x, p.y),
        );
    }

    private removeCreepByIndex(index: number) {
        let sourceMemory    = this.getMemory();
        sourceMemory.creeps = sourceMemory.creeps.splice(index, 1);

        let memory             = Cache.memoryGet('energySources');
        memory[this.source.id] = sourceMemory;
        Cache.memorySet('energySources', memory);
    }

    private removeCarrierByIndex(index: number) {
        let sourceMemory    = this.getMemory();
        sourceMemory.carriers = sourceMemory.carriers.splice(index, 1);

        let memory             = Cache.memoryGet('energySources');
        memory[this.source.id] = sourceMemory;
        Cache.memorySet('energySources', memory);
    }
}
