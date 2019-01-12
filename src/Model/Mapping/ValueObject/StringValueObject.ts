import ValueObject from "./ValueObject";

class StringValueObject extends ValueObject {
    constructor(stringValue: any) {
        super(typeof stringValue.toString !== "function" ? stringValue : stringValue.toString());
    }
}

export default StringValueObject;