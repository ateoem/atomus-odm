import FieldValue from "../../../src/Model/Mapping/FieldValue";
import StringFieldValue from "../../../src/Model/Mapping/StringFieldValue";
import Field from "../../../src/Model/Schema/Field";
import StringField from "../../../src/Model/Schema/Fields/StringField";
import FieldType from "../../../src/Model/Schema/FieldType";

describe("FieldValue", () => {
    it("should have setters/getters.", () => {
        const field = new StringField("test");
        const fieldValue = new StringFieldValue(field, "test");
        expect(fieldValue.$field).toBe(field);
        expect(fieldValue.$value).toEqual("test");
    });
});
