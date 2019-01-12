import ValueObject from "./ValueObject";

class NumberValueObject extends ValueObject {
    constructor(numberValue: any) {
        super(parseFloat(numberValue));
    }
}

export default NumberValueObject;
