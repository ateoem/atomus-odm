import Aggregate from "../Aggregate";
import ValueObject from "./ValueObject";

class ChildrenValueObject extends ValueObject {
    protected value: Aggregate[];

    constructor(children: Aggregate[] = []) {
        super(children);
    }

    public isEqual(value: ChildrenValueObject): boolean {
        if (! (value instanceof ValueObject) || this.constructor.name !== value.constructor.name) {
            return false;
        }

        return this.$value.isEqual(value);
    }
}

export default ChildrenValueObject;