import Document from "./Document";
import AggregateChange from "./DocumentChange";
import AggregateChanges from "./DocumentChanges";
import MappedAggregate from "./MappedDocument";

class ManagedAggregate extends Document {
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
     * @return {Document}
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
