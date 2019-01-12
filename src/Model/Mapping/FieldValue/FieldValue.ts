import ICloneable from "../../Common/IClonable";
import FieldType from "../Enum/FieldType";
import Field from "../Field/Field";

abstract class FieldValue implements ICloneable {
    private value: any;
    private field: Field;

    constructor($field: Field, value?: any) {
        this.field = $field;
        this.value = value;
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

    public get $value(): string {
        return this.value;
    }
    
    public clone(): FieldValue {
        return this.constructor(this.$field, this.$value); 
    }

    public isEqual(value: any): boolean {
        return value instanceof FieldValue
            && value.constructor.name === this.constructor.name
            && value.$field.isEqual(this.field)
            && value.$value === this.value;
    }
}

export default FieldValue;
