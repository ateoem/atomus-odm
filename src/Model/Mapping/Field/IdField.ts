import FieldType from "../Enum/FieldType";
import Field from "./Field";

class IdField extends Field {
    constructor(name: string) {
        super(name, FieldType.uuid);
    }

    public clone(): IdField {
        return new IdField(this.name);
    }
}

export default IdField;
