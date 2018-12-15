abstract class Field {
    protected name: string = "";

    get $name(): string {
        return this.name;
    }
}

export default Field;
