import ICloneable from "../Common/IClonable";
import IEqualable from "../Common/IEqualable";
import Field from "./Field/Field";
import FieldCollection from "./FieldCollection";
import FieldValue from "./FieldValue/FieldValue";

class FieldValueCollection implements ICloneable, IEqualable{
    private fieldValues: Map<string, FieldValue>;

    constructor(fields: FieldValue[] = []) {
        this.fieldValues = new Map();
        fields.forEach((fieldValue: FieldValue) => this.fieldValues.set(fieldValue.$name, fieldValue.clone()) );
    }

    public get(key: string): FieldValue {
        return this.fieldValues.get(key);
    }

    public has(key: string): boolean {
        return this.fieldValues.has(key);
    }

    public size(): number {
        return this.fieldValues.size;
    }

    public get $fieldValuesArray(): FieldValue[] {
        return Array.from(this.fieldValues.values());
    }

    public addField(value: FieldValue): FieldValueCollection {
        return new FieldValueCollection([...this.$fieldValuesArray, value]);
    }

    public clone(): FieldValueCollection {
        return new FieldValueCollection(this.$fieldValuesArray);
    }

    public isEqual(fieldValue: any): boolean {
        if (! (fieldValue instanceof FieldValueCollection) ) {
            return false;
        }
        if (this.$fieldValuesArray.length !== fieldValue.$fieldValuesArray.length) {
            return false;
        }

        return !Boolean(this.$fieldValuesArray.find((field: FieldValue) => {
            return (!fieldValue.has(field.$name) || !fieldValue.get(field.$name).isEqual(field));
        }));
    }
}

export default FieldValueCollection;
