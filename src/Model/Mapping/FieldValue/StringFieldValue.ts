import validate from "uuid-validate";
import Field from "../Field/Field";
import StringField from "../Field/StringField";
import FieldValue from "./FieldValue";

class StringFieldValue extends FieldValue {
    constructor(field: StringField, value: any = "") {
        super(field, typeof value.toString === "function" ? value.toString() : value);
    }
}

export default StringFieldValue;
