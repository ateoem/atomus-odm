import FieldType from "../Enum/FieldType";
import DocumentMapping from "../FieldCollection";
import FieldCollection from "../FieldCollection";
import Field from "./Field";

class ChildField extends Field {
    private fields: FieldCollection;

    constructor(name: string, fields: FieldCollection) {
        super(name, FieldType.child);
        this.fields = fields.clone();
    }

    public get $fields(): FieldCollection {
        return this.fields;
    }

    public clone(): ChildField {
        return new ChildField(this.name, this.fields);
    }

    public isEqual(value: any) {
        return value instanceof ChildField
            && value.$name === this.$name
            && value.$type === this.type
            && value.$fields.isEqual(this.$fields);
    }
}

export default ChildField;
