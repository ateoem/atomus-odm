import AggregateMapping from "../Mapping/DocumentMapping";
import Field from "../Mapping/Field";
import ChildField from "../Mapping/Fields/ChildField";
import ChildrenField from "../Mapping/Fields/ChildrenField";
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

    private changes: AggregateChanges;
    private child: Map<string, MappedAggregate>;
    private children: Map<string, MappedAggregate[]>;
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
        this.child = new Map();
        this.children = new Map();
        this.name = aggregateMapping.$name;
        this.aggregateMapping = new AggregateMapping(
            aggregateMapping.$name,
            aggregateMapping.$fieldsArray,
        );

        this.computeFieldValues();
        this.mapChild();
        this.mapChildren();
        this.guardAgainstInconsistency();
    }

    public getChild(name: string): MappedAggregate {
        if (!this.child.has(name)) {
            throw new Error("No child found!");
        }
        return this.child.get(name);
    }

    public getChildren(name: string): MappedAggregate[] {
        if (!this.children.has(name)) {
            throw new Error("No child found!");
        }
        return this.children.get(name);
    }

    public computeChanges(dirtyAggregate: MappedAggregate): boolean {
        if (dirtyAggregate.$fieldValues.size !== this.$fieldValues.size) {
            throw new Error("Incosinstensy error.");
        }
        const changes = new AggregateChanges();
        let isAnythingChanged = false;
        this.$fieldValues.forEach((fieldValue) => {
            const dirtyFieldValue = dirtyAggregate.$fieldValues.get(fieldValue.$name);

            if (dirtyFieldValue === undefined || !dirtyFieldValue.$field.isEqual(fieldValue.$field)) {
                throw new Error("Field not found!");
            }
            if (fieldValue.$field instanceof ChildField) {
                const childValue: MappedAggregate = fieldValue.$value;
                const dirtyChildValue: MappedAggregate = dirtyFieldValue.$value;
                childValue.computeChanges(dirtyChildValue);
                if (childValue.$changes.size !== 0) {
                    isAnythingChanged = true;
                }
            } else if (fieldValue.$field instanceof ChildrenField) {
                const max = Math.max(fieldValue.$value.length, dirtyFieldValue.$value.length);
                for (let i = 0; i < max; i++) {
                    if (!fieldValue.$value[i]) {
                        fieldValue.$value[i] = new MappedAggregate(fieldValue.$field.$mapping);
                        isAnythingChanged = true;
                    } else if (!dirtyFieldValue.$value[i]) {
                        fieldValue.$value[i].$changes.set("delete", true);
                        isAnythingChanged = true;
                        continue;
                    }
                    fieldValue.$value[i].computeChanges(dirtyFieldValue.$value[i]);

                    if (fieldValue.$value[i].$changes.size !== 0) {
                        isAnythingChanged = true;
                    }
                }
            } else {
                if (dirtyFieldValue.$value !== fieldValue.$value) {
                    isAnythingChanged = true;
                    changes.setChange(new DocumentChange(fieldValue.$field, fieldValue.$value, dirtyFieldValue.$value));
                }
            }
        });
        this.changes = changes;
        return isAnythingChanged;
    }

    private mapChild() {
        this.fieldValues.forEach( (fieldValue: FieldValue) => {
            if (fieldValue.$type !== FieldType.child) {
                return;
            }
            this.child.set(fieldValue.$name, fieldValue.$value);
        });
    }

    private mapChildren() {
        this.fieldValues.forEach( (fieldValue: FieldValue) => {
            if (fieldValue.$type !== FieldType.children) {
                return;
            }
            this.children.set(fieldValue.$name, fieldValue.$value);
        });
    }

    private computeFieldValues() {
        this.$mapping.$fields.forEach((field: Field) => {
            if (!this.$fieldValues.has(field.$name)) {
                if (field instanceof ChildField) {
                    this.fieldValues.set(field.$name,
                        new FieldValue(field, new MappedAggregate(field.$mapping)),
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
