import DocumentMapping from "../DocumentMapping";
import Field from "../Field";
import FieldType from "../FieldType";

class ChildField extends Field {
    private mapping: DocumentMapping;

    constructor(name: string, mapping: DocumentMapping) {
        super(name, FieldType.child);
        this.mapping = mapping;
    }

    public get $mapping(): DocumentMapping {
        return this.mapping;
    }
}

export default ChildField;
