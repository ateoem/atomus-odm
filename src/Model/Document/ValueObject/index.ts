import Field from "../../Mapping/Field";
import FieldType from "../../Mapping/FieldType";
import ChildrenValue from "./ChildrenValue";
import ChildValue from "./ChildValue";
import StringValue from "./StringValue";
import UuidValue from "./UuidValue";
import ValueObject from "./ValueObject";

const ValueObjectMap: Map<FieldType, any> = new Map();

ValueObjectMap.set(FieldType.string, StringValue);
ValueObjectMap.set(FieldType.uuid, UuidValue);
ValueObjectMap.set(FieldType.child, ChildValue);
ValueObjectMap.set(FieldType.children, ChildrenValue);

const generateValueObject = (field: Field, value: any): ValueObject => {
    const valueObject = ValueObjectMap.get(field.$type);
    if (!valueObject) {
        throw new Error("Field not found!");
    }

    return new valueObject(value);
};

export default generateValueObject;
