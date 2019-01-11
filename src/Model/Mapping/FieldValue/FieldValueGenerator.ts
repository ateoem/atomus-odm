import FieldType from "../Enum/FieldType";
import Field from "../Field/Field";
import ChildFieldValue from "./ChildFieldValue";
import ChildrenFieldValue from "./ChildrenFieldValue";
import FieldValue from "./FieldValue";
import StringFieldValue from "./StringFieldValue";
import IdFieldValue from "./UuidFieldValue";

const ValueObjectMap: Map<FieldType, any> = new Map();

ValueObjectMap.set(FieldType.string, StringFieldValue);
ValueObjectMap.set(FieldType.uuid, IdFieldValue);
ValueObjectMap.set(FieldType.child, ChildFieldValue);
ValueObjectMap.set(FieldType.children, ChildrenFieldValue);

const FieldValueGenerator = (field: Field, value?: any): FieldValue => {
    const valueObject = ValueObjectMap.get(field.$type);
    if (!valueObject) {
        throw new Error("Field not found!");
    }
    if (!value) {
        return new valueObject(field);
    }

    return new valueObject(field, value);
};

export default FieldValueGenerator;
