import {v1 as uuid} from "uuid";
import Document from "./Document";
import AggregateChange from "./DocumentChange";
import AggregateChanges from "./DocumentChanges";
import DocumentChanges from "./DocumentChanges";
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

    public get $changes() {
        return this.aggregate.$changes;
    }

    public get $isDirty() {
        return this.isDirty;
    }

    private aggregate: MappedAggregate;
    private isDirty: boolean;

    constructor($aggregate: MappedAggregate) {
        super();
        this.aggregate = $aggregate;
        this.computeUuid();
        this.isDirty = false;
    }

    public getChild(name: string): MappedAggregate {
        return this.aggregate.getChild(name);
    }

    public computeChanges(dirtyAggregate: ManagedAggregate|MappedAggregate): boolean {
        const aggregateToCompare = (dirtyAggregate instanceof MappedAggregate)
            ? dirtyAggregate : dirtyAggregate.$aggregate;
        const isDirty = this.aggregate.computeChanges(aggregateToCompare);
        this.isDirty = isDirty;
        return isDirty;
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
