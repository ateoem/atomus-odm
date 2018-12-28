import Field from "../Mapping/Field";
import generateValueObject from "./ValueObject";
import ValueObject from "./ValueObject/ValueObject";

class DocumentChange {
    private field: Field;
    private old: ValueObject;
    private changed: ValueObject;

    constructor(field: Field, old: any, changed: any) {
        this.field = field;
        this.old = generateValueObject(field, old);
        this.changed = generateValueObject(field, changed);
    }

    public get $field(): Field {
        return this.field;
    }

    public get $old(): any {
        return this.old.$value;
    }

    public get $changed(): any {
        return this.changed.$value;
    }
}

export default DocumentChange;
