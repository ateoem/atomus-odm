import Aggregate from "../Aggregate";
import AggregateCollection from "../AggregateCollection";
import ValueObject from "./ValueObject";

class ChildrenValueObject extends ValueObject {
    protected value: AggregateCollection;

    constructor(children: AggregateCollection) {
        super(children);
    }

    get $value(): AggregateCollection {
        return this.value;
    }

    public isEqual(valueObject: ChildrenValueObject): boolean {
        if (! (valueObject instanceof ChildrenValueObject) || this.constructor.name !== valueObject.constructor.name) {
            return false;
        }

        return this.$value.isEqual(valueObject.$value);
    }
}

export default ChildrenValueObject;