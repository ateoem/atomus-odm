import FieldType from "../Enum/FieldType";
import Field from "./Field";

class StringField extends Field {
    constructor(name: string) {
        super(name, FieldType.string);
    }

    public clone(): StringField {
        return new StringField(this.name);
    }
}

export default StringField;
