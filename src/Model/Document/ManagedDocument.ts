import {v1 as uuid} from "uuid";
import Document from "./Document";
import DocumentChange from "./DocumentChange";
import AggregateChanges from "./DocumentChanges";
import FieldValue from "./FieldValue";
import MappedAggregate from "./MappedDocument";

class ManagedAggregate extends Document {

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
    public get $changes(): Map<string, DocumentChange> {
        return this.changes.$changed;
    }
    private aggregate: MappedAggregate;
    private changes: AggregateChanges;

    constructor($aggregate: MappedAggregate) {
        super();
        this.aggregate = $aggregate;
        this.changes = new AggregateChanges();
        this.computeUuid();
    }

    /**
     * @param {AggregateChanges} value
     */
    public updateChanges(value: AggregateChanges) {
        this.changes = value;
    }

    public computeChanges(dirtyAggregate: ManagedAggregate): AggregateChanges {
        return this.aggregate.computeChanges(dirtyAggregate.$aggregate);
    }

    private computeUuid() {
        const uuidField = this.aggregate.$mapping.$fields.get("id");
        if (!uuidField) {
            throw new Error("Id not present!");
        }
        const uuidFieldValue = this.aggregate.$fieldValues.get("id");
        if (uuidFieldValue.$value !== "") {
            return;
        }
        const uuidFieldValueTmp = new FieldValue(uuidField, uuid());
        this.aggregate.$fieldValues.set("id", uuidFieldValueTmp);
    }
}

export default ManagedAggregate;
