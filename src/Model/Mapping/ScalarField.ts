import Field from "./Field";
import FieldType from "./FieldType";

class ScalarField extends Field {
    protected type: FieldType;

    constructor(name: string, type: FieldType) {
        super();
        this.type = type;
        this.name = name;
    }

    get $type(): FieldType {
        return this.type;
    }

    public isEqual(comparedField: ScalarField) {
        return comparedField.$name === this.$name
            && comparedField.$type === this.type;
    }
}

export default ScalarField;
