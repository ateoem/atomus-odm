import ICloneable from "../Common/IClonable";
import IEqualable from "../Common/IEqualable";
import ChildField from "./Field/ChildField";
import ChildrenField from "./Field/ChildrenField";
import Field from "./Field/Field";

class FieldCollection implements ICloneable, IEqualable {
    private fields: Map<string, Field>;
    private name: string;

    constructor(name: string, fields: Field[] = []) {
        this.name = name;
        this.fields = new Map();
        fields.forEach((field: Field) => this.fields.set(field.$name, field.clone()) );
        this.guardAgainstCircularReference();
    }

    public get(key: string): Field {
        return this.fields.get(key);
    }

    public has(key: string): boolean {
        return this.fields.has(key);
    }

    public size(): number {
        return this.fields.size;
    }

    public get $fieldsArray(): Field[] {
        return Array.from(this.fields.values());
    }

    public get $name(): string {
        return this.name;
    }

    public clone(): FieldCollection {
        return new FieldCollection(this.$name, this.$fieldsArray);
    }

    public isEqual(value: any): boolean {
        if (! (value instanceof FieldCollection) ) {
            return false;
        }
        if (this.$fieldsArray.length !== value.$fieldsArray.length || value.$name !== this.$name) {
            return false;
        }

        return !Boolean(this.$fieldsArray.find((field: Field) => {
            return (!value.has(field.$name) || !value.get(field.$name).isEqual(field));
        }));
    }

    private guardAgainstCircularReference(): void {
        return this.$fieldsArray.forEach( (field: Field) => {
            if ( (field instanceof ChildField || field instanceof ChildrenField)
            && field.$fields.isEqual(this)) {
                throw new Error(`[FieldCollection] Circular reference found in field: "${field.$name}".`);
            }
        });
    }
}

export default FieldCollection;
