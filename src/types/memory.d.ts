import {EnergySource} from 'types/custom';

declare global {
    interface CreepMemory {
        role: string;
        room: string;
        state?: 'mining' | 'depositing';
    }

    interface Memory {
        uuid: number;
        log: any;
        [key: string]: any;
        energySources: {[key: string]: EnergySource}
    }
}
