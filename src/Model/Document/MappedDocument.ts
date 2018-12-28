import AggregateMapping from "../Mapping/DocumentMapping";
import Field from "../Mapping/Field";
import FieldType from "../Mapping/FieldType";
import Document from "./Document";
import DocumentChange from "./DocumentChange";
import AggregateChanges from "./DocumentChanges";
import DocumentChanges from "./DocumentChanges";
import FieldValue from "./FieldValue";

class MappedAggregate extends Document {

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

    public get $changes(): Map<string, DocumentChange> {
        return this.changes.$changed;
    }

    public get $childChanges(): Map<string, DocumentChanges> {
        return this.childChanges;
    }

    private changes: AggregateChanges;
    private childChanges: Map<string, AggregateChanges>;
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
        this.changes = new AggregateChanges();
        this.childChanges = new Map();

        this.name = aggregateMapping.$name;
        this.aggregateMapping = new AggregateMapping(
            aggregateMapping.$name,
            aggregateMapping.$fieldsArray,
        );

        this.computeFieldValues();
        this.guardAgainstInconsistency();
    }

    public computeChanges(dirtyAggregate: MappedAggregate): AggregateChanges {
        if (dirtyAggregate.$fieldValues.size !== this.$fieldValues.size) {
            const b = 1;
            throw new Error("Incosinstensy error.");
        }
        const changes = new AggregateChanges();
        this.$fieldValues.forEach((fieldValue) => {
            const dirtyFieldValue = dirtyAggregate.$fieldValues.get(fieldValue.$name);

            if (dirtyFieldValue === undefined || !dirtyFieldValue.$field.isEqual(fieldValue.$field)) {
                throw new Error("Field not found!");
            }
            if (fieldValue.$type !== FieldType.child) {
                if (dirtyFieldValue.$value !== fieldValue.$value) {
                    changes.setChange(new DocumentChange(fieldValue.$field, fieldValue.$value, dirtyFieldValue.$value));
                }
            } else {
                const childValue: MappedAggregate = fieldValue.$value;
                const dirtyChildValue: MappedAggregate = dirtyFieldValue.$value;
                this.childChanges.set(childValue.$name, childValue.computeChanges(dirtyChildValue));
            }
        });
        this.changes = changes;
        return changes;
    }

    private computeFieldValues() {
        this.$mapping.$fields.forEach((field: Field) => {
            if (!this.$fieldValues.has(field.$name)) {
                if (field.$type === FieldType.child) {
                    this.fieldValues.set(field.$name,
                        new FieldValue(field, new MappedAggregate(field.$metadata.mapping)),
                    );
                } else {
                    this.fieldValues.set(field.$name, new FieldValue(field, ""));
                }
            }
        });
    }

    private guardAgainstInconsistency() {
        if (this.$fieldValues.size !== this.aggregateMapping.size()) {
            throw new Error("Aggregate incosistent.");
        }

        this.fieldValues.forEach((fieldValue: FieldValue) => {
            const isPresentInMapping = this.aggregateMapping.get(fieldValue.$field.$name);
            if (!isPresentInMapping) {
                throw new Error("Aggregate incosistent.");
            }
        });
    }
}

export default MappedAggregate;
