import FieldType from "../../../../src/Model/Mapping/Enum/FieldType";
import IdField from "../../../../src/Model/Mapping/Field/IdField";
import NumberField from "../../../../src/Model/Mapping/Field/NumberField";
import NumberFieldValue from "../../../../src/Model/Mapping/FieldValue/NumberFieldValue";
import StringFieldValue from "../../../../src/Model/Mapping/FieldValue/StringFieldValue";
import { AgeField } from "../../../Utils/ExampleFields";

describe("StringFieldValue", () => {
    it("should have default value.", () => {
        const fieldValue = new NumberFieldValue(AgeField);
        expect(fieldValue.$value).toBe(0);
    });

    it("should have setters/getters/clone/isequal", () => {
        const fieldValue = new NumberFieldValue(AgeField, 12345);
        expect(fieldValue.$name).toBe("age");
        expect(fieldValue.$field.isEqual(AgeField)).toBe(true);
        expect(fieldValue.$value).toBe(12345);
        expect(fieldValue.$type).toBe(FieldType.number);
        expect(fieldValue.clone().isEqual(fieldValue));
    });

    it("should be equal if same field and value.", () => {
        const field = new NumberFieldValue(AgeField, 12345);
        const secondField = new NumberFieldValue(AgeField, 12345);
        expect(field.isEqual(secondField)).toBe(true);
    });

    it("should not be equal if not same field.", () => {
        const field = new NumberFieldValue(AgeField, 12345);
        const secondField = new NumberFieldValue(new NumberField("size"), 12345);
        expect(field.isEqual(secondField)).toBe(false);
    });

    it("should not be equal if same field but different value.", () => {
        const field = new NumberFieldValue(AgeField, 12345);
        const secondField = new NumberFieldValue(AgeField, 123456);
        expect(field.isEqual(secondField)).toBe(false);
    });
});