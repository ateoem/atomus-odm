import MappedDocument from "../../ODM/MappedDocument";
import ChildrenField from "../Field/ChildrenField";
import Field from "../Field/Field";
import FieldValue from "./FieldValue";

class ChildrenFieldValue extends FieldValue {
    constructor(field: Field, value: MappedDocument[] = []) {
        if (field instanceof ChildrenField === false) {
            throw new Error(`Field isn't of type "Children".`);
        }
        super(field, value);
    }

    public isEqual(value: any): boolean {
        return true;
        // return value instanceof ChildrenFieldValue
            // && 
    }
}

export default ChildrenFieldValue;
