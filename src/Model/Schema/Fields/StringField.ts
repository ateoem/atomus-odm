import Field from "../Field";
import FieldType from "../FieldType";

class StringField extends Field {
    constructor(name: string) {
        super(name, FieldType.string);
    }
}

export default StringField;
