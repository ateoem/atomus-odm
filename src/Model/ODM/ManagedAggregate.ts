import Aggregate from "../Aggregate/Aggregate";
import AggregateChange from "../Aggregate/AggregateChange";
import AggregateChanges from "../Aggregate/AggregateChanges";
import MappedAggregate from "../Aggregate/MappedAggregate";

class ManagedAggregate extends Aggregate {
    private aggregate: MappedAggregate;
    private changes: AggregateChanges;

    constructor($aggregate: MappedAggregate) {
        super();
        this.aggregate = $aggregate;
        this.changes = new AggregateChanges();
    }

    public get $id() {
        return this.aggregate.$id;
    }

    /**
     * Getter $aggregate
     * @return {Aggregate}
     */
    public get $aggregate(): MappedAggregate {
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
