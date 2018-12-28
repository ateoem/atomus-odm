import AggregateChange from "./DocumentChange";

class DocumentChanges {
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

    public size(): number {
        return this.changed.size;
    }
}

export default DocumentChanges;
