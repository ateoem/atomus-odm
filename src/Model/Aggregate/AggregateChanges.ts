import AggregateChange from "./AggregateChange";

class AggregateChanges {
    private changed: AggregateChange[];

    constructor() {
        this.changed = [];
    }

    public addChange(change: AggregateChange) {
        this.changed.push(change);
    }

    public length(): number {
        return this.changed.length;
    }

    public get $changed(): AggregateChange[] {
        return this.changed;
    }
}

export default AggregateChanges;
