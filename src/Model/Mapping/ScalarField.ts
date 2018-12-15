import Field from "./Field";
import FieldType from "./FieldType";

class ScalarField extends Field {
    private type: FieldType;

    constructor(name: string, type: FieldType) {
        super();
        this.type = type;
        this.name = name;
    }

    get $type(): FieldType {
        return this.type;
    }
}

export default ScalarField;
