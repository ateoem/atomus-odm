import MappedDocument from "../../ODM/MappedDocument";
import ChildField from "../Field/ChildField";
import ChildrenField from "../Field/ChildrenField";
import Field from "../Field/Field";
import FieldValue from "./FieldValue";

class ChildFieldValue extends FieldValue {
    constructor(field: ChildField, value: null|Document = null) {
        super(field, value);
    }
}

export default ChildFieldValue;
