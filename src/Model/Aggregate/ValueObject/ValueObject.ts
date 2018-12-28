abstract class ValueObject {
    protected value: any;

    constructor(value: any) {
        this.value = value;
    }

    public get $value(): any {
        return this.value;
    }
}

export default ValueObject;
