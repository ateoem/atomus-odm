abstract class Field {
    protected name: string = "";

    get $name(): string {
        return this.name;
    }

    public isEqual(comparedField: Field) {
        return comparedField.$name === this.$name;
    }
}

export default Field;
