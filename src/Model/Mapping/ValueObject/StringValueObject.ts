import ValueObject from "./ValueObject";

class StringValueObject extends ValueObject {
    constructor(stringValue: string) {
        super(stringValue);
    }
}

export default StringValueObject;