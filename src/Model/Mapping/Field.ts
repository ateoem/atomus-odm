import FieldType from "./FieldType";

abstract class Field {
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

    public isEqual(comparedField: Field) {
        return comparedField.$name === this.$name
            && comparedField.$type === this.type;
    }
}

export default Field;
