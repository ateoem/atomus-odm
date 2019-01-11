import FieldType from "../Enum/FieldType";
import Field from "./Field";

class NumberField extends Field {
    constructor(name: string) {
        super(name, FieldType.number);
    }

    public clone(): NumberField {
        return new NumberField(this.name);
    }
}

export default NumberField;
