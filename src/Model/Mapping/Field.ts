import FieldType from "./FieldType";

class Field {
    protected type: FieldType;
    protected name: string;
    protected metadata: object;

    constructor(name: string, type: FieldType, metadata: object = {}) {
        this.type = type;
        this.name = name;
        this.metadata = metadata;
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
