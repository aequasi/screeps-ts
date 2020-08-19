import Room from 'Model/Room';
import {AbstractCreep} from 'Model/Creep';

export default class _Source {
    private static isCreepAlive(creepDict: {creep: Creep}) {
        let creep = creepDict.creep;

        return Game.creeps[creep.name] !== null;
    }

    private get positions() {
        return this.getMemory().positions;
    }

    private get creeps() {
        return this.getMemory().creeps;
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

        const memory           = Cache.memoryGet('energySources');
        memory[this.source.id] = sourceMemory;
        Cache.memorySet('energySources', memory);
    }

    /**
     * Gets all the available positions around this source. Filters out terrain, and walls
     * @private
     */
    public getAvailablePositions() {
        return this.positions.map(p => {
            // Fetch the position
            // @todo See if this is worth keeping in memory
            const pos  = Cache.remember(
                `room-${this.room.room.name}-position-at-${p.x}-${p.y}`,
                () => this.room.room.getPositionAt(p.x, p.y),
            );
            if (!pos) {
                return null
            }

            // @todo See if this is worth keeping in memory
            const look = Cache.remember('look-position-' + p.x + 'x' + p.y, pos.look.bind(pos));

            for (const position of look) {
                // If There is a wall, its not available
                if (position.type === 'terrain' && position.terrain === 'wall') {
                    return null;
                }

                // If a creep owns this spot already, and that creep still exists, its not available
                let creepDict = this.creeps.find(dict => dict.position.isEqualTo(pos));
                if (creepDict) {
                    if (_Source.isCreepAlive(creepDict)) {
                        continue;
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

    private getMemory() {
        const memory = Cache.memoryRemember('energySources', () => {
            return {};
        });
        if (!memory[this.source.id]) {
            memory[this.source.id] = {positions: [], creeps: []};
        }

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

    /**
     * Adds this creep, and their location, to the memory, so the next loop is aware of whats goin on
     * @param creep
     * @param position
     * @private
     */
    private addCreep(creep: AbstractCreep<CreepMiner>, position: RoomPosition) {
        let sourceMemory = this.getMemory();

        if (!sourceMemory.creeps.find(c => c.creep.id == creep.id)) {
            sourceMemory.creeps.push({creep: creep.creep, position: position});
        }

        let memory             = Cache.memoryGet('energySources');
        memory[this.source.id] = sourceMemory;
        Cache.memorySet('energySources', memory);
    }

    private removeCreepByIndex(index: number) {
        let sourceMemory    = this.getMemory();
        sourceMemory.creeps = sourceMemory.creeps.splice(index, 1);

        let memory             = Cache.memoryGet('energySources');
        memory[this.source.id] = sourceMemory;
        Cache.memorySet('energySources', memory);
    }
}
