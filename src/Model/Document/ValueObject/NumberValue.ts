import ValueObject from "./ValueObject";

class NumberValue extends ValueObject {
    constructor(value: any) {
        super(value);
        this.value = String(value);
    }
}

export default NumberValue;
