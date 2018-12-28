import Field from "../Mapping/Field";
import generateValueObject from "./ValueObject";
import ValueObject from "./ValueObject/ValueObject";

class FieldValue {
    private field: Field;
    private valueObject: ValueObject;

    constructor($field: Field, $value: any) {
        this.field = $field;
        this.valueObject = generateValueObject($field, $value);
    }

    public get $name(): string {
        return this.$field.$name;
    }

    public get $field(): Field {
        return this.field;
    }

    public get $value(): any {
        return this.valueObject.$value;
    }
}

export default FieldValue;
