export default class Cache {
    private cacheMap: {[key: string]: any} = {};
    private randomId: number = Math.random() * (10000 + (Math.random() * 50));


    get<R>(key: string): R {
        return this.cacheMap[key + '_' + this.randomId];
    }

    set<R>(key: string, value: R): this {
        this.cacheMap[key + '_' + this.randomId] = value;

        return this;
    }

    forget(key: string): this {
        delete this.cacheMap[key + '_' + this.randomId];

        return this;
    }

    remember<R>(key: string, callback: (...args: any[]) => R, ...args: any[]): R {
        let value = this.get<R>(key);

        if (value === undefined) {
            this.set(key, callback.apply(null, args));

            return this.get<R>(key);
        }

        return value;
    }

    memoryGet<K extends keyof Memory>(key: K): Memory[K] {
        return Memory[key];
    }

    memorySet<K extends keyof Memory>(key: K, value: Memory[K]): this {
        Memory[key] = value;

        return this;
    }

    memoryForget<K extends keyof Memory>(key: K): this {
        delete Memory[key];

        return this;
    }

    memoryRemember<K extends keyof Memory>(key: K, callback: (...args: any[]) => Memory[K], ...args: any[]): Memory[K] {
        let value = this.memoryGet(key);

        if (value === undefined) {
            this.memorySet(key, callback.apply(null, args));

            return this.memoryGet(key);
        }

        return value;
    }
}
