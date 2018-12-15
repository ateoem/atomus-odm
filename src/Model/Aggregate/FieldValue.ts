import Field from "../Mapping/Field";

class FieldValue {
    private field: Field;
    private value: object;

    constructor($field: Field, $value: object) {
        this.field = $field;
        this.value = $value;
    }

    public get $field(): Field {
        return this.field;
    }

    public get $value(): object {
        return this.value;
    }
}

export default FieldValue;
