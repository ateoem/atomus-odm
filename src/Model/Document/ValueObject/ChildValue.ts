import MappedDocument from "../MappedDocument";
import ValueObject from "./ValueObject";

class ChildValue extends ValueObject {
    constructor(value: MappedDocument) {
        super(value);
        this.value = value;
    }

    public get $value(): MappedDocument {
        return this.value;
    }
}

export default ChildValue;
