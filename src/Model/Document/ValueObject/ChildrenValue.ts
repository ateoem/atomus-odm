import MappedAggregate from "../MappedDocument";
import ValueObject from "./ValueObject";

class ChildrenValue extends ValueObject {
    constructor(value: MappedAggregate[]) {
        super(value);
        this.value = value;
    }

    public get $value(): MappedAggregate {
        return this.value;
    }
}

export default ChildrenValue;
