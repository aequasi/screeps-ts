import {EnergySource} from 'types/custom';

declare global {
    interface CreepMemory {
        role: string;
        room: string;
        carrierState?: 'pickup' | 'dropoff';
        source?: string;

        [key: string]: any;
    }

    interface Memory {
        uuid: number;
        log: any;

        [key: string]: any;

        energySources: { [key: string]: EnergySource }
    }
}
