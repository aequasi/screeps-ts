import GlobalWorldManager from 'Manager/WorldManager';
import GlobalCache from 'utils/Cache';
import {LoDashStatic} from 'lodash';

declare global {
    namespace NodeJS {
        interface Global {
            log(...args: any[]): void;
            WorldManager: GlobalWorldManager;
            Cache: GlobalCache;
            _: LoDashStatic;
        }
    }

    const _: LoDashStatic;
    function log(...args: any[]): void;
    const WorldManager: GlobalWorldManager;
    const Cache: GlobalCache;
}

