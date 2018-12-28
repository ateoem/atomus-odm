import AggregateChange from "./DocumentChange";

class AggregateChanges {
    private changed: Map<string, AggregateChange>;

    constructor() {
        this.changed = new Map();
    }

    public setChange(change: AggregateChange) {
        this.changed.set(change.$field.$name, change);
    }

    public get $changed(): Map<string, AggregateChange> {
        return this.changed;
    }

    public get(key: string) {
        return this.changed.get(key);
    }

    public has(key: string) {
        return this.changed.has(key);
    }

    public set(key: string, value: AggregateChange) {
        return this.changed.set(key, value);
    }

    public size(): number {
        return this.changed.size;
    }
}

export default AggregateChanges;
