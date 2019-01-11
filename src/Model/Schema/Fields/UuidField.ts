import Field from "../Field";
import FieldType from "../FieldType";

class UuidField extends Field {
    constructor(name: string) {
        super(name, FieldType.uuid);
    }
}

export default UuidField;
