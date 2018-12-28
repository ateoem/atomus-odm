import {v1 as uuid} from "uuid";
import AggregateMapping from "../Mapping/AggregateMapping";
import Field from "../Mapping/Field";
import FieldType from "../Mapping/FieldType";
import Aggregate from "./Aggregate";
import AggregateChange from "./AggregateChange";
import AggregateChanges from "./AggregateChanges";
import FieldValue from "./FieldValue";

class MappedAggregate extends Aggregate {

    public get $id(): string {
        return this.fieldValues.get("id").$value;
    }

    public get $name(): string {
        return this.name;
    }

    public get $fieldValues() {
        return this.fieldValues;
    }

    public get $fieldValuesArray() {
        return Array.from(this.$fieldValues.values());
    }

    public get $mapping(): AggregateMapping {
        return this.aggregateMapping;
    }

    private name: string = "";
    private aggregateMapping: AggregateMapping;
    private fieldValues: Map<string, FieldValue>;

    constructor(
            aggregateMapping: AggregateMapping,
            fieldValues: FieldValue[] = [],
            ) {
        super();
        this.fieldValues = new Map();
        fieldValues.forEach((fieldValue: FieldValue) => this.fieldValues.set(fieldValue.$name, fieldValue));

        this.name = aggregateMapping.$name;
        this.aggregateMapping = new AggregateMapping(
            aggregateMapping.$name,
            aggregateMapping.$fieldsArray,
        );

        this.computeUuid();
        this.computeFieldValues();
        this.guardAgainstInconsistency();
    }

    public computeChanges(dirtyAggregate: MappedAggregate): AggregateChanges {
        if (dirtyAggregate.$fieldValues.size !== this.fieldValues.size) {
            throw new Error("Incosinstensy error.");
        }
        const changes = new AggregateChanges();
        this.$fieldValues.forEach( (fieldValue) => {
            const dirtyFieldValue = dirtyAggregate.$fieldValues.get(fieldValue.$name);

            if (dirtyFieldValue === undefined || !dirtyFieldValue.$field.isEqual(fieldValue.$field)) {
                 throw new Error("Field not found!");
            }
            if (dirtyFieldValue.$value !== fieldValue.$value) {
                changes.setChange(new AggregateChange(fieldValue.$field, fieldValue.$value, dirtyFieldValue.$value));
            }
        });

        return changes;
    }

    private computeFieldValues() {
        this.$mapping.$fields.forEach((field: Field) => {
            if (!this.$fieldValues.has(field.$name)) {
                this.fieldValues.set(field.$name, new FieldValue(field, ""));
            }
        });
    }

    private computeUuid() {
        const uuidField = this.aggregateMapping.$fields.get("id");
        if (!uuidField) {
            throw new Error("Id not present!");
        }
        const uuidFieldValue = this.fieldValues.get("id");
        if (!uuidFieldValue) {
            const uuidFieldValueTmp = new FieldValue(uuidField, uuid());
            this.fieldValues.set("id", uuidFieldValueTmp);
        }
    }

    private guardAgainstInconsistency() {
        if (this.$fieldValues.size !== this.aggregateMapping.size()) {
            throw new Error("Aggregate incosistent.");
        }

        this.fieldValues.forEach( (fieldValue: FieldValue) => {
            const isPresentInMapping = this.aggregateMapping.get(fieldValue.$field.$name);
            if (!isPresentInMapping) {
                throw new Error("Aggregate incosistent.");
            }
        });
    }
}

export default MappedAggregate;
