import DocumentMapping from "../Mapping/DocumentMapping";
import Field from "../Mapping/Field";
import ChildField from "../Mapping/Fields/ChildField";
import ChildrenField from "../Mapping/Fields/ChildrenField";
import FieldType from "../Mapping/FieldType";
import Document from "./Document";
import DocumentChange from "./DocumentChange";
import DocumentChanges from "./DocumentChanges";
import FieldValue from "./FieldValue";

class MappedDocument extends Document {

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

    public get $mapping(): DocumentMapping {
        return this.documentMapping;
    }

    public get $changes(): Map<string, DocumentChange> {
        return this.changes.$changed;
    }

    private changes: DocumentChanges;
    private child: Map<string, MappedDocument>;
    private children: Map<string, MappedDocument[]>;
    private name: string = "";
    private documentMapping: DocumentMapping;
    private fieldValues: Map<string, FieldValue>;

    constructor(
        mapping: DocumentMapping,
        fieldValues: FieldValue[] = [],
    ) {
        super();
        this.fieldValues = new Map();
        fieldValues.forEach((fieldValue: FieldValue) => this.fieldValues.set(fieldValue.$name, fieldValue));
        this.changes = new DocumentChanges();
        this.child = new Map();
        this.children = new Map();
        this.name = mapping.$name;
        this.documentMapping = new DocumentMapping(
            mapping.$name,
            mapping.$fieldsArray,
        );

        this.computeFieldValues();
        this.mapChild();
        this.mapChildren();
        this.guardAgainstInconsistency();
    }

    public getChild(name: string): MappedDocument {
        if (!this.child.has(name)) {
            throw new Error(`Child under index "${name}" not found!`);
        }
        return this.child.get(name);
    }

    public getChildren(name: string): MappedDocument[] {
        if (!this.children.has(name)) {
            throw new Error(`Children under index "${name}" not found!`);
        }
        return this.children.get(name);
    }

    public setChildren(name: string, documents: MappedDocument[]) {
        this.children.set(name, documents);
    }

    public computeChanges(dirtyDocument: MappedDocument): boolean {
        if (dirtyDocument.$fieldValues.size !== this.$fieldValues.size) {
            throw new Error("Incosinstensy error: different size of aggregates.");
        }
        const changes = new DocumentChanges();
        let isAnythingChanged = false;
        this.$fieldValues.forEach((fieldValue) => {
            const dirtyFieldValue = dirtyDocument.$fieldValues.get(fieldValue.$name);

            if (dirtyFieldValue === undefined || !dirtyFieldValue.$field.isEqual(fieldValue.$field)) {
                throw new Error("Field not found!");
            }
            if (fieldValue.$field instanceof ChildField) {
                const childValue: MappedDocument = fieldValue.$value;
                const dirtyChildValue: MappedDocument = dirtyFieldValue.$value;
                childValue.computeChanges(dirtyChildValue);
                if (childValue.$changes.size !== 0) {
                    isAnythingChanged = true;
                }
            } else if (fieldValue.$field instanceof ChildrenField) {
                const max = Math.max(fieldValue.$value.length, dirtyFieldValue.$value.length);
                for (let i = 0; i < max; i++) {
                    if (!fieldValue.$value[i]) {
                        fieldValue.$value[i] = new MappedDocument(fieldValue.$field.$mapping);
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
            if (! (fieldValue.$field instanceof ChildField) ) {
                return;
            }
            this.child.set(fieldValue.$name, fieldValue.$value);
        });
    }

    private mapChildren() {
        this.fieldValues.forEach( (fieldValue: FieldValue) => {
            if (! (fieldValue.$field instanceof ChildrenField) ) {
                return;
            }
            this.children.set(fieldValue.$name, fieldValue.$value || []);
        });
    }

    private computeFieldValues() {
        this.$mapping.$fields.forEach((field: Field) => {
            if (!this.$fieldValues.has(field.$name)) {
                if (field instanceof ChildField) {
                    this.fieldValues.set(field.$name,
                        new FieldValue(field, new MappedDocument(field.$mapping)),
                    );
                } else if (field instanceof ChildrenField) {
                    this.fieldValues.set(field.$name, new FieldValue(field, []));
                } else {
                    this.fieldValues.set(field.$name, new FieldValue(field, ""));
                }
            }
        });
    }

    private guardAgainstInconsistency() {
        if (this.$fieldValues.size !== this.documentMapping.size()) {
            throw new Error("Document incosistent.");
        }

        this.fieldValues.forEach((fieldValue: FieldValue) => {
            const isPresentInMapping = this.documentMapping.get(fieldValue.$field.$name);
            if (!isPresentInMapping) {
                throw new Error("Document incosistent.");
            }
        });
    }
}

export default MappedDocument;
