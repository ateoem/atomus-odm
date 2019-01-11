import generateValueObject from "./";
import generateFieldValue from "./";
import Field from "./Field/Field";
import FieldValue from "./FieldValue/FieldValue";

class DocumentChange {
    private field: Field;
    private old: FieldValue;
    private updated: FieldValue;

    constructor(field: Field, old: any, updated: any) {
        this.field = field;
        this.old = generateFieldValue(field, old);
        this.updated = generateFieldValue(field, updated);
    }

    public get $field(): Field {
        return this.field;
    }

    public get $old(): any {
        return this.old.$value;
    }

    public get $updated(): any {
        return this.updated.$value;
    }
}

export default DocumentChange;
