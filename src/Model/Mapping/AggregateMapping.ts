import Field from "./Field";

class AggregateMapping {
    private fields: Map<string, Field>;
    private name: string;

    constructor(name: string, fields: Field[] = []) {
        this.name = name;
        this.fields = new Map();
        fields.forEach((field: Field) => {
            this.fields.set(field.$name, field);
        });
        // this.guardAgainstCircularReference(children);
    }

    public addFields(...fields: Field[]) {
        fields.forEach((field: Field) => this.addField(field));
    }

    public addField(field: Field) {
        this.fields.set(field.$name, field);
    }

    public get(key: string) {
        return this.$fields.get(key);
    }

    public has(key: string) {
        return this.$fields.has(key);
    }

    public set(key: string, value: Field) {
        return this.$fields.set(key, value);
    }

    public size(): number {
        return this.fields.size;
    }

    public get $fields(): Map<string, Field> {
        return this.fields;
    }

    public get $fieldsArray(): Field[] {
        return Array.from(this.fields.values());
    }

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
