import ValueObject from "./ValueObject";

class NumberValueObject extends ValueObject {
    constructor(numberValue: string) {
        super(numberValue);
    }
}

export default NumberValueObject;
