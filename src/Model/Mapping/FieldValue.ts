import Field from "../Schema/Field";
import FieldType from "../Schema/FieldType";

abstract class FieldValue {
    private field: Field;

    constructor($field: Field) {
        this.field = $field;
    }

    public get $name(): string {
        return this.$field.$name;
    }

    public get $field(): Field {
        return this.field;
    }

    public get $type(): FieldType {
        return this.field.$type;
    }

    abstract get $value(): any;
}

export default FieldValue;
