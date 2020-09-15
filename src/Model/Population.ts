import Room from 'Model/Room';
import settings from 'settings';

export default class Population {
    public readonly distribution: Settings['creeps'] = {} as any;
    private population                               = 0;

    constructor(private readonly room: Room) {
        _.assign(this.distribution, settings.creeps);

        const self = this;
        for (const name of Object.keys(this.distribution)) {
            if (typeof this.distribution[name as CreepType].total === 'undefined') {
                Object.defineProperty(this.distribution[name as CreepType], 'total', {
                    get: function currentPercentage() {
                        return self.room.room.find(FIND_MY_CREEPS).filter((x) => x.memory.role === name).length;
                    },
                });
            }
            if (typeof this.distribution[name as CreepType].currentPercentage === 'undefined') {
                Object.defineProperty(this.distribution[name as CreepType], 'currentPercentage', {
                    get: function currentPercentage() {
                        return this.total / self.room.creeps.length;
                    },
                });
            }
        }

        room.creeps.forEach((creep) => {
            let memory          = creep.creep.memory;
            let type: CreepType = memory.role as any;

            if (!type) {
                type = memory.role = creep.creep.memory.role = creep.creep.name.split('-')[0] as any;
            }

            if (!this.distribution[type]) {
                throw new Error('Unknown creep type: ' + type);
            }
        });
    }
}
