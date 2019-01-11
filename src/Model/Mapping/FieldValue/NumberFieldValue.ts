import validate from "uuid-validate";
import Field from "../Field/Field";
import NumberField from "../Field/NumberField";
import StringField from "../Field/StringField";
import FieldValue from "./FieldValue";

class NumberFieldValue extends FieldValue {
    constructor(field: NumberField, value: any = 0) {
        super(field, !Number(value) ? 0 : Number(value));
    }
}

export default NumberFieldValue;
