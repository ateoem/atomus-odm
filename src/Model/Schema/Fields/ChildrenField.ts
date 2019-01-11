import DocumentMapping from "../DocumentMapping";
import Field from "../Field";
import FieldType from "../FieldType";

class ChildrenField extends Field {
    private mapping: DocumentMapping;

    constructor(name: string, mapping: DocumentMapping) {
        super(name, FieldType.children);
        this.mapping = mapping;
    }

    public get $mapping(): DocumentMapping {
        return this.mapping;
    }
}

export default ChildrenField;
