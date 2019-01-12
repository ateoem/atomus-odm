import Aggregate from "../Aggregate";
import ChildField from "../Field/ChildField";
import FieldValue from "./FieldValue";

class ChildFieldValue extends FieldValue {
    constructor(field: ChildField, value: null|Aggregate = null) {
        super(field, value);
    }
}

export default ChildFieldValue;
