import { IEvents } from "./events";

export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model;
}

export abstract class Model<T> {
    protected data: T;

    constructor(data: Partial<T>, protected events: IEvents) {
        this.data = { ...data } as T;
    }

    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }

    update(data: Partial<T>): void {
        this.data = { ...this.data, ...data };
        this.emitChanges('model:updated', data);
    }

    getData(): T {
        return { ...this.data };
    }

    get<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }

    set<K extends keyof T>(key: K, value: T[K]): void {
        this.data[key] = value;
        this.emitChanges('model:propertyChanged', { key, value });
    }

    abstract reset(): void;

    validate(): boolean {
        return true;
    }

    toJSON(): string {
        return JSON.stringify(this.data);
    }
}