import AggregateChange from "./AggregateChange";

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
}

export default AggregateChanges;
