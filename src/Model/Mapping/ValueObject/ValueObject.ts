import ICloneable from "../../Common/IClonable";
import IEqualable from "../../Common/IEqualable";
import DocumentChange from "../DocumentChange";
import DocumentChanges from "../DocumentChanges";

abstract class ValueObject implements ICloneable, IEqualable {
    protected value: any;
    
    constructor(value: any) {
        this.value = value;
    }

    get $value() {
        return this.value;
    }

    public clone() {
        return (this.constructor(this.$value));
    }
    // public abstract computeChanges(value: ValueObject): DocumentChange|DocumentChanges;

    public isEqual(value: any): boolean {
        return value instanceof ValueObject
            && this.constructor.name === value.constructor.name
            && value.$value === this.$value;
    }

}

export default ValueObject;