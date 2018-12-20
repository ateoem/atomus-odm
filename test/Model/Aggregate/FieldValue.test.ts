import FieldValue from "../../../src/Model/Aggregate/FieldValue";
import Field from "../../../src/Model/Mapping/Field";
import FieldType from "../../../src/Model/Mapping/FieldType";

describe("FieldValue", () => {
    it("should have setters/getters.", () => {
        const field = new Field("test", FieldType.string);
        const fieldValue = new FieldValue(field, {value: "test"});
        expect(fieldValue.$field).toBe(field);
        expect(fieldValue.$value).toEqual({value: "test"});
    });
});
