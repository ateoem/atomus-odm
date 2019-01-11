import Field from "../Field";
import FieldType from "../FieldType";

class NumberField extends Field {
    constructor(name: string) {
        super(name, FieldType.number);
    }
}

export default NumberField;
