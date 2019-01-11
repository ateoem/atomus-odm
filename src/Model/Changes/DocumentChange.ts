import generateValueObject from "../Mapping";
import generateFieldValue from "../Mapping";
import FieldValue from "../Mapping/FieldValue";
import Field from "../Schema/Field";

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
