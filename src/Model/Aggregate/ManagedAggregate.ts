import Aggregate from "./Aggregate";
import AggregateChanges from "./AggregateChanges";

class ManagedAggregate {
    private aggregate: Aggregate;
    private changes: AggregateChanges;


    constructor($aggregate: Aggregate, $changes: AggregateChanges) {
        this.aggregate = $aggregate;
        this.changes = $changes;
    }

    public id() {
        return this.aggregate.id();
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
    public get $changes(): AggregateChanges {
        return this.changes;
    }

    /**
     * @param {AggregateChanges} value
     */
    public updateChanges(value: AggregateChanges) {
        this.changes = value;
    }

}

export default ManagedAggregate;