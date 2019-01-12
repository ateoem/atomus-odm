import ICloneable from "../../Common/IClonable";
import FieldType from "../Enum/FieldType";
import Field from "../Field/Field";
import ValueObject from "../ValueObject/ValueObject";
import ValueObjectFactory from "../ValueObject/ValueObjectFactory";
import ValueChange from "../ValueChange";

abstract class FieldValue implements ICloneable {
    private valueObject: ValueObject;
    private field: Field;
    private change?: ValueChange;

    constructor(field: Field, value?: any) {
        this.field = field;
        this.valueObject = ValueObjectFactory(field, value);
        this.change = null;
    }

    public get isDirty(): boolean {
        return Boolean(this.change);
    }

    public get $changes(): ValueChange {
        return this.change;
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
        return this.valueObject.$value;
    }

    public get $valueObject(): ValueObject {
        return this.valueObject;
    }
    
    public clone(): FieldValue {
        return this.constructor(this.$field, this.$value); 
    }

    public isEqual(fieldValue: any): boolean {
        return fieldValue instanceof FieldValue
            && fieldValue.constructor.name === this.constructor.name
            && fieldValue.$field.isEqual(this.field)
            && fieldValue.$valueObject.isEqual(this.valueObject);
    }
}

export default FieldValue;
