import validate from "uuid-validate";
import Field from "../Schema/Field";
import UuidField from "../Schema/Fields/UuidField";
import FieldValue from "./FieldValue";

class UuidFieldValue extends FieldValue {
    protected value: string;
    
    constructor(field: Field, value: string) {
        super(field);
        if (field instanceof UuidField === false) {
            throw new Error(`Field isn't of type uuid!`);
        }
        this.value = value;
    }

    public get $value(): string {
        return this.value;
    }
}

export default UuidFieldValue;
