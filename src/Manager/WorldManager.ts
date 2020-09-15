import Room from 'Model/Room';
import CreepManager from 'Manager/CreepManager';

export default class WorldManager {
    public readonly creepManager: CreepManager;
    public readonly rooms: {[key: string]: Room} = {};

    public constructor() {
        this.creepManager = new CreepManager(this);
    }

    public tick(tick: number) {
        this.findRooms();

        Object.values(this.rooms).forEach((room) => {
            room.spawns.forEach((spawn) => spawn.spawnNextCreep());
            room.creeps.forEach((creep) => {
                // @todo Re-add loop, need to make sure this doesn't nuke CPU though
                let code: ScreepsReturnCode;
                //do {
                    code = creep.act();
                //} while(code === OK);
            });
        })
    }

    private findRooms(): void {
        for (const [name, room] of Object.entries(Game.rooms)) {
            this.rooms[name] = new Room(name, room);
        }
    }
}
