import Aggregate from "../Aggregate";
import ValueObject from "./ValueObject";

class ChildValueObject extends ValueObject {
    protected value: Aggregate;

    constructor(child: Aggregate = null) {
        super(child);
    }

    get $value(): Aggregate {
        return this.value;
    }

    public isEqual(value: ChildValueObject): boolean {
        if (! (value instanceof ValueObject) || this.constructor.name !== value.constructor.name) {
            return false;
        }

        return this.$value.isEqual(value);
    }
}

export default ChildValueObject;