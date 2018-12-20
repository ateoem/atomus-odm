import Aggregate from "../Aggregate/Aggregate";
import AggregateChange from "../Aggregate/AggregateChange";
import AggregateChanges from "../Aggregate/AggregateChanges";

class ManagedAggregate {
    private aggregate: Aggregate;
    private changes: AggregateChanges;

    constructor($aggregate: Aggregate) {
        this.aggregate = $aggregate;
    }

    public id() {
        return this.aggregate.$id;
    }

    /**
     * Getter $aggregate
     * @return {Aggregate}
     */
    public get $aggregate(): Aggregate {
        return this.aggregate;
    }

    /**
     * Getter $changes
     * @return {AggregateChanges}
     */
    public get $changes(): Map<string, AggregateChange> {
        return this.changes.$changed;
    }

    /**
     * @param {AggregateChanges} value
     */
    public updateChanges(value: AggregateChanges) {
        this.changes = value;
    }

}

export default ManagedAggregate;
