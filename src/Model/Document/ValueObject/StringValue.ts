import ValueObject from "./ValueObject";

class StringValue extends ValueObject {
    constructor(value: any) {
        super(value);
        this.value = String(value);
    }
}

export default StringValue;
