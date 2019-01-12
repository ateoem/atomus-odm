import FieldType from "../../../../src/Model/Mapping/Enum/FieldType";
import StringFieldValue from "../../../../src/Model/Mapping/FieldValue/StringFieldValue";
import { FIELD_NAME, FIELD_SURNAME } from "../../../Utils/ExampleFields";

describe("StringFieldValue", () => {
    it("should have default value.", () => {
        const fieldValue = new StringFieldValue(FIELD_SURNAME);
        expect(fieldValue.$value).toBe("");
    });

    it("should have setters/getters/clone/isequal", () => {
        const fieldValue = new StringFieldValue(FIELD_SURNAME, "test");
        expect(fieldValue.$name).toBe("surname");
        expect(fieldValue.$field.isEqual(FIELD_SURNAME)).toBe(true);
        expect(fieldValue.$value).toBe("test");
        expect(fieldValue.$type).toBe(FieldType.string);
        expect(fieldValue.clone().isEqual(fieldValue)).toBe(true);
    });

    it("should be equal if same field and value.", () => {
        const field = new StringFieldValue(FIELD_SURNAME, "lorem");
        const secondField = new StringFieldValue(FIELD_SURNAME, "lorem");
        expect(field.isEqual(secondField)).toBe(true);
    });

    it("should not be equal if not same field.", () => {
        const field = new StringFieldValue(FIELD_SURNAME, "lorem");
        const secondField = new StringFieldValue(FIELD_NAME, "lorem");
        expect(field.isEqual(secondField)).toBe(false);
    });

    it("should not be equal if same field but different value.", () => {
        const field = new StringFieldValue(FIELD_SURNAME, "lorem_test");
        const secondField = new StringFieldValue(FIELD_SURNAME, "lorem");
        expect(field.isEqual(secondField)).toBe(false);
    });
});