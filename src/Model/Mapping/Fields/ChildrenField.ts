import AggregateMapping from "../DocumentMapping";
import Field from "../Field";
import FieldType from "../FieldType";

class ChildrenField extends Field {
    private mapping: AggregateMapping;

    constructor(name: string, mapping: AggregateMapping) {
        super(name, FieldType.children);
        this.mapping = mapping;
    }

    public get $mapping(): AggregateMapping {
        return this.mapping;
    }
}

export default ChildrenField;
