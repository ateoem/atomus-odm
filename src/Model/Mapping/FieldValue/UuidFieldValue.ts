import validate from "uuid-validate";
import Field from "../Field/Field";
import IdField from "../Field/IdField";
import FieldValue from "./FieldValue";

class IdFieldValue extends FieldValue {
    constructor(field: IdField, value: string = "") {
        super(field, value);
    }
}

export default IdFieldValue;
