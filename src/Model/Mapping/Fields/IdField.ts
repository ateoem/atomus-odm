import Field from "../Field";
import FieldType from "../FieldType";

class IdField extends Field {
    constructor(name: string) {
        super(name, FieldType.uuid);
    }
}

export default IdField;
