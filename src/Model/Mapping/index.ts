import Field from "../Schema/Field";
import FieldType from "../Schema/FieldType";
import ChildValue from "./ChildFieldValue";
import ChildFieldValue from "./ChildFieldValue";
import ChildrenValue from "./ChildrenFieldValue";
import ChildrenFieldValue from "./ChildrenFieldValue";
import FieldValue from "./FieldValue";
import StringFieldValue from "./StringFieldValue";
import StringValue from "./StringFieldValue";
import UuidFieldValue from "./UuidFieldValue";
import UuidValue from "./UuidFieldValue";

const ValueObjectMap: Map<FieldType, any> = new Map();

ValueObjectMap.set(FieldType.string, StringFieldValue);
ValueObjectMap.set(FieldType.uuid, UuidFieldValue);
ValueObjectMap.set(FieldType.child, ChildFieldValue);
ValueObjectMap.set(FieldType.children, ChildrenFieldValue);

const generateFieldValue = (field: Field, value: any): FieldValue => {
    const valueObject = ValueObjectMap.get(field.$type);
    if (!valueObject) {
        throw new Error("Field not found!");
    }
    return new valueObject(field, value);
};

export default generateFieldValue;
