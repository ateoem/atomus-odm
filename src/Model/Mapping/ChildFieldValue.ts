import MappedDocument from "../ODM/MappedDocument";
import Field from "../Schema/Field";
import ChildField from "../Schema/Fields/ChildField";
import ChildrenField from "../Schema/Fields/ChildrenField";
import FieldValue from "./FieldValue";

class ChildFieldValue extends FieldValue {
    protected value: MappedDocument;

    constructor(field: Field, value: MappedDocument) {
        super(field);
        if (field instanceof ChildField === false) {
            throw new Error(`Field isn't of type "Children".`);
        }
        this.value = value;
    }

    public get $value(): MappedDocument {
        return this.value;
    }
}

export default ChildFieldValue;
