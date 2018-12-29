import FieldValue from "../../../src/Model/Document/FieldValue";
import Field from "../../../src/Model/Mapping/Field";
import StringField from "../../../src/Model/Mapping/Fields/StringField";
import FieldType from "../../../src/Model/Mapping/FieldType";

describe("FieldValue", () => {
    it("should have setters/getters.", () => {
        const field = new StringField("test");
        const fieldValue = new FieldValue(field, "test");
        expect(fieldValue.$field).toBe(field);
        expect(fieldValue.$value).toEqual("test");
    });
});
