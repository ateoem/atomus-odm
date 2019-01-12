import ICloneable from "../../Common/IClonable";
import IEqualable from "../../Common/IEqualable";
import ValueChange from "../ValueChange";

abstract class ValueObject implements ICloneable, IEqualable {
    protected value: any;
    
    constructor(value: any) {
        this.value = value;
    }

    get $value() {
        return this.value;
    }

    public clone(): ValueObject {
        return (this.constructor(this.$value));
    }
    // public abstract computeChanges(value: ValueObject): DocumentChange|DocumentChanges;

    public isEqual(value: any): boolean {
        return value instanceof ValueObject
            && this.constructor.name === value.constructor.name
            && value.$value === this.$value;
    }

    public getChange(valueObject: ValueObject): ValueChange {
        return new ValueChange(this, valueObject);
    }
}

export default ValueObject;