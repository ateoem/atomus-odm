import FieldValue from "../../../src/Model/Aggregate/FieldValue";
import FieldType from "../../../src/Model/Mapping/FieldType";
import ScalarField from "../../../src/Model/Mapping/ScalarField";

describe("FieldValue", () => {
    it("should have setters/getters.", () => {
        const field = new ScalarField("test", FieldType.string);
        const fieldValue = new FieldValue(field, {value: "test"});
        expect(fieldValue.$field).toBe(field);
        expect(fieldValue.$value).toEqual({value: "test"});
    });
});
