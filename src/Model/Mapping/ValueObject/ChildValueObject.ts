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

    public isEqual(valueObject: any): boolean {
        if (! (valueObject instanceof ChildValueObject) || this.constructor.name !== valueObject.constructor.name) {
            return false;
        }

        return this.$value.isEqual(valueObject.$value);
    }
}

export default ChildValueObject;