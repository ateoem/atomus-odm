import {v1 as uuid} from "uuid";
import AggregateMapping from "../Mapping/AggregateMapping";
import Field from "../Mapping/Field";
import FieldType from "../Mapping/FieldType";
import Aggregate from "./Aggregate";
import AggregateChange from "./AggregateChange";
import AggregateChanges from "./AggregateChanges";
import FieldValue from "./FieldValue";

class MappedAggregate extends Aggregate {
    private name: string = "";
    private aggregateMapping: AggregateMapping;
    private fieldValues: Map<string, FieldValue>;

    constructor(
            aggregateMapping: AggregateMapping,
            fieldValues: FieldValue[] = [],
            ) {
        super();
        this.fieldValues = new Map();
        fieldValues.forEach((fieldValue: FieldValue) => this.fieldValues.set(fieldValue.$field.$name, fieldValue));

        this.name = aggregateMapping.$name;
        this.aggregateMapping = new AggregateMapping(aggregateMapping.$name);
        this.aggregateMapping.addFields(...aggregateMapping.$fieldsArray);

        const isUuidPresent = this.fieldValues.has("id");

        if (!isUuidPresent) {
            const uuidField = new Field("id", FieldType.uuid);
            const uuidFieldValue = new FieldValue(uuidField, {value: uuid()});
            this.fieldValues.set("id", uuidFieldValue);
            this.aggregateMapping.addField(uuidField);
        }

        this.$mapping.$fields.forEach((field: Field) => {
            if (!this.$fieldValues.has(field.$name)) {
                this.fieldValues.set(field.$name, new FieldValue(field, {value: ""}));
            }
        });
        this.guardAgainstInconsistency();
    }

    public get $id(): string {
        return this.fieldValues.get("id").$value;
    }

    public get $name(): string {
        return this.name;
    }

    public get $fieldValues() {
        return this.fieldValues;
    }

    public get $mapping(): AggregateMapping {
        return this.aggregateMapping;
    }

    public computeChanges(dirtyAggregate: MappedAggregate): AggregateChanges {
        if (dirtyAggregate.$fieldValues.size !== this.fieldValues.size) {
            throw new Error("Incosinstensy error.");
        }
        const changes = new AggregateChanges();
        this.$fieldValues.forEach( (fieldValue) => {
            const dirtyFieldValue = dirtyAggregate.$fieldValues.get(fieldValue.$field.$name);

            if (dirtyFieldValue === undefined || !dirtyFieldValue.$field.isEqual(fieldValue.$field)) {
                 throw new Error("Field not found!");
            }
            if (JSON.stringify(dirtyFieldValue.$value) !== JSON.stringify(fieldValue.$value)) {
                changes.setChange(new AggregateChange(fieldValue.$field, fieldValue.$value, dirtyFieldValue.$value));
            }
        });

        return changes;
    }

    private guardAgainstInconsistency() {
        if (this.$fieldValues.size !== this.aggregateMapping.$fields.size) {
            throw new Error("Aggregate incosistent.");
        }

        this.fieldValues.forEach( (fieldValue: FieldValue) => {
            const isPresentInMapping = this.aggregateMapping.$fields.get(fieldValue.$field.$name);
            if (!isPresentInMapping) {
                throw new Error("Aggregate incosistent.");
            }
        });
    }
}

export default MappedAggregate;
