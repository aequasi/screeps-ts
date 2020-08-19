import {ErrorMapper} from 'utils/ErrorMapper';
import WorldManager from 'Manager/WorldManager';
import Cache from 'utils/Cache';
//import profiler from 'screeps-profiler';

// profiler.enable();
// require('screeps-perf')();

global.log = function () {
    for (let index = 0; index < arguments.length; index++) {
        if (typeof arguments[index] === 'object') {
            try {
                arguments[index] = JSON.stringify(arguments[index]);
            } catch (e) {
                arguments[index] = 'circular object';
            }
        }
    }

    console.log.apply(null, arguments as any);
};

global.WorldManager = new WorldManager();
global.Cache = new Cache();

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
let tick          = 0;
export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    log('<--------------------------------------------------->');

    tick++;
    try {
//        profiler.wrap(global.WorldManager.tick.bind(global.WorldManager, tick));
        global.WorldManager.tick(tick);
    } catch (e) {
        log(e.stack);
    }
});

