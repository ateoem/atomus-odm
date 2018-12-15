import Field from "./ScalarField";

class AggregateMapping {
    private fields: Field[];
    private name: string;

    constructor(name: string, fields: Field[]) {
        this.name = name;
        this.fields = fields;
        // this.guardAgainstCircularReference(children);
    }

    /**
     * Getter $fields
     * @return {Field[]}
     */
    public get $fields(): Field[] {
        return this.fields;
    }

    /**
     * Getter $name
     * @return {string}
     */
    public get $name(): string {
        return this.name;
    }

    private guardAgainstCircularReference(): void {
        // children.forEach(child => {
        //     if (child.children.indexOf(this) !== -1) throw new Error();
        // });
    }
}

export default AggregateMapping;
