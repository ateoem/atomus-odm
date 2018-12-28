import validate from "uuid-validate";
import ValueObject from "./ValueObject";

class UuidValue extends ValueObject {
    constructor(value: string) {
        super(value);
        // if (!validate(value, 1)) {
        //     throw new Error("Not uuid!");
        // }
    }
}

export default UuidValue;
