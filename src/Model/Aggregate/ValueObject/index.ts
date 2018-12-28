import Field from "../../Mapping/Field";
import FieldType from "../../Mapping/FieldType";
import StringValue from "./StringValue";
import UuidValue from "./UuidValue";
import ValueObject from "./ValueObject";

const ValueObjectMap: Map<FieldType, any> = new Map();

ValueObjectMap.set(FieldType.string, StringValue);
ValueObjectMap.set(FieldType.uuid, UuidValue);

const generateValueObject = (field: Field, value: any): ValueObject => {
    const valueObject = ValueObjectMap.get(field.$type);
    if (!valueObject) {
        throw new Error("Field not found!");
    }

    return new valueObject(value);
};

export default generateValueObject;
