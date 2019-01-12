import ValueObject from "./ValueObject";

class IdValueObject extends ValueObject {
    constructor(idValue: string) {
        super(idValue);
    }
}

export default IdValueObject;