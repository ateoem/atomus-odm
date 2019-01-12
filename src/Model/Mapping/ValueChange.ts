import Field from "./Field/Field";
import FieldValue from "./FieldValue/FieldValue";
import ValueObject from "./ValueObject/ValueObject";
import ICloneable from "../Common/IClonable";

class ValueChange implements ICloneable {
    private old: ValueObject;
    private $$new: ValueObject;
    private toBeDeleted: boolean;
    private dirty = false;

    constructor(old: ValueObject, $new: ValueObject, toBeDeleted: boolean = false) {
        if (!$new.isEqual(old)) {
            if ($new.constructor.name !== old.constructor.name) {
                throw new Error("ValuesObjects provided in change have different types.");
            }
            this.old = old.clone();
            this.$$new = $new.clone();
            this.toBeDeleted = toBeDeleted;
            this.dirty = true;
        }
    }

    public get isDirty(): boolean {
        return this.dirty;
    }

    public get $toBeDeleted(): any {
        return this.toBeDeleted;
    }

    public get $old(): any {
        return this.old.$value;
    }

    public get $oldValueObject(): any {
        return this.old;
    }

    public get $new(): any {
        return this.$$new.$value;
    }

    public get $newValueObject(): any {
        return this.$new;
    }

    public clone(): ValueChange {
        return new ValueChange(this.$oldValueObject, this.$newValueObject);
    }
}

export default ValueChange;
