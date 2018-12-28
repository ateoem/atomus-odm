import FieldType from "./FieldType";

class Field {
    protected type: FieldType;
    protected name: string;
    protected metadata: any;

    constructor(name: string, type: FieldType, metadata: any = {}) {
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

    get $metadata(): any {
        return this.metadata;
    }

    public isEqual(comparedField: Field) {
        return comparedField.$name === this.$name
            && comparedField.$type === this.type;
    }
}

export default Field;
