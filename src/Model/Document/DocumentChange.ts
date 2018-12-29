import Field from "../Mapping/Field";
import generateValueObject from "./ValueObject";
import ValueObject from "./ValueObject/ValueObject";

class DocumentChange {
    private field: Field;
    private old: ValueObject;
    private updated: ValueObject;

    constructor(field: Field, old: any, updated: any) {
        this.field = field;
        this.old = generateValueObject(field, old);
        this.updated = generateValueObject(field, updated);
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
