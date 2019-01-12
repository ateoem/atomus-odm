import FieldType from "../Enum/FieldType";
import Field from "../Field/Field";
import ChildrenValueObject from "./ChildrenValueObject";
import ChildValueObject from "./ChildValueObject";
import IdValueObject from "./IdValueObject";
import NumberValueObject from "./NumberValueObject";
import StringValueObject from "./StringValueObject";
import ValueObject from "./ValueObject";

const ValueObjectMap: Map<FieldType, any> = new Map();

ValueObjectMap.set(FieldType.string, StringValueObject);
ValueObjectMap.set(FieldType.uuid, IdValueObject);
ValueObjectMap.set(FieldType.number, NumberValueObject);
ValueObjectMap.set(FieldType.child, ChildValueObject);
ValueObjectMap.set(FieldType.children, ChildrenValueObject);

const ValueObjectFactory = (field: Field, value?: any): ValueObject => {
    const valueObject = ValueObjectMap.get(field.$type);
    if (!valueObject) {
        throw new Error("Field not found!");
    }
    
    return new valueObject(value);
};

export default ValueObjectFactory;
