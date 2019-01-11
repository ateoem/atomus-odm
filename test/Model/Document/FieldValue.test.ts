import FieldType from "../../../src/Model/Mapping/Enum/FieldType";
import Field from "../../../src/Model/Mapping/Field/Field";
import StringField from "../../../src/Model/Mapping/Field/StringField";
import FieldValue from "../../../src/Model/Mapping/FieldValue/FieldValue";
import StringFieldValue from "../../../src/Model/Mapping/FieldValue/StringFieldValue";

describe("FieldValue", () => {
    it("should have setters/getters.", () => {
        const field = new StringField("test");
        const fieldValue = new StringFieldValue(field, "test");
        expect(fieldValue.$field).toBe(field);
        expect(fieldValue.$value).toEqual("test");
    });
});
