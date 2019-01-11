import ICloneable from "../../Common/IClonable";
import IEqualable from "../../Common/IEqualable";
import FieldType from "../Enum/FieldType";

abstract class Field implements ICloneable, IEqualable {
    protected type: FieldType;
    protected name: string;

    constructor(name: string, type: FieldType) {
        this.type = type;
        this.name = name;
    }

    get $type(): FieldType {
        return this.type;
    }

    get $name(): string {
        return this.name;
    }

    public isEqual(value: any) {
        return value instanceof Field
            && value.$name === this.$name
            && value.$type === this.type;
    }

    public abstract clone(): Field;
}

export default Field;
