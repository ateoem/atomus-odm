import validate from "uuid-validate";
import Field from "../Schema/Field";
import StringField from "../Schema/Fields/StringField";
import FieldValue from "./FieldValue";

class StringFieldValue extends FieldValue {
    protected value: string;
    
    constructor(field: Field, value: any) {
        super(field);
        if (field instanceof StringField === false) {
            throw new Error(`Field isn't of type uuid!`);
        }
        if (typeof value.toString === "function") {
            this.value = value.toString();
        } else {
            this.value = value;
        }
    }

    public get $value(): string {
        return this.value;
    }
}

export default StringFieldValue;
