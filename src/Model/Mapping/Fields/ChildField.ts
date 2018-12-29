import AggregateMapping from "../DocumentMapping";
import Field from "../Field";
import FieldType from "../FieldType";

class ChildField extends Field {
    private mapping: AggregateMapping;

    constructor(name: string, mapping: AggregateMapping) {
        super(name, FieldType.child);
        this.mapping = mapping;
    }

    public get $mapping(): AggregateMapping {
        return this.mapping;
    }
}

export default ChildField;
