import ICloneable from "../Common/IClonable";
import IEqualable from "../Common/IEqualable";
import Field from "./Field/Field";
import FieldCollection from "./FieldCollection";
import FieldValue from "./FieldValue/FieldValue";
import FieldValueGenerator from "./FieldValue/FieldValueGenerator";
import FieldValueCollection from "./FieldValueCollection";

class Aggregate implements IEqualable, ICloneable {
    protected fields: FieldCollection;
    protected values: FieldValueCollection;
    
    constructor(fieldCollection: FieldCollection, fieldValueCollection: FieldValueCollection) {
        this.fields = fieldCollection.clone();
        this.values = fieldValueCollection.clone();
        this.initFields();
        this.guardAgainstInconsistency();
    }

    public clone(): Aggregate {
        return new Aggregate(this.fields.clone(), this.values.clone());
    }

    public isEqual(value: any): boolean {
        if (! (value instanceof Aggregate)) {
            return false;
        }

        return (value.fields.isEqual(this.fields) && value.values.isEqual(this.values));
    }
    
    private initFields() {
        this.fields.$fieldsArray.forEach( (field: Field) => {
            if (!this.values.has(field.$name)) {
                this.values = this.values.addField(FieldValueGenerator(field));
            }
        });
    }

    private guardAgainstInconsistency() {
        if (this.values.size() !== this.fields.size()) {
            throw new Error(
                `Document is incosistent: number of fields: "${this.fields.size()}". number of values: "${this.values.size()}".`);
        }

        this.values.$fieldValuesArray.forEach((value: FieldValue) => {
            const field = this.fields.get(value.$name);
            if (!field) {
                throw new Error("Document incosistent.");
            } else if (!field.isEqual(value.$field)) {
                throw new Error("Document incosistent.");
            }
        });
    }
}

export default Aggregate;
