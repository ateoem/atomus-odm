import FieldType from "../Enum/FieldType";
import Field from "../Field/Field";
import ChildFieldValue from "./ChildFieldValue";
import ChildrenFieldValue from "./ChildrenFieldValue";
import FieldValue from "./FieldValue";
import NumberFieldValue from "./NumberFieldValue";
import StringFieldValue from "./StringFieldValue";
import IdFieldValue from "./UuidFieldValue";

const FieldValuesMap: Map<FieldType, any> = new Map();

FieldValuesMap.set(FieldType.string, StringFieldValue);
FieldValuesMap.set(FieldType.uuid, IdFieldValue);
FieldValuesMap.set(FieldType.number, NumberFieldValue);
FieldValuesMap.set(FieldType.child, ChildFieldValue);
FieldValuesMap.set(FieldType.children, ChildrenFieldValue);

const FieldValueFactory = (field: Field, value?: any): FieldValue => {
    const fieldValue = FieldValuesMap.get(field.$type);
    if (!fieldValue) {
        throw new Error("Field not found!");
    }
    if (!value) {
        return new fieldValue(field);
    }

    return new fieldValue(field, value);
};

export default FieldValueFactory;
