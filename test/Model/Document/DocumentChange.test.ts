import DocumentChange from "../../../src/Model/Changes/DocumentChange";
import Field from "../../../src/Model/Schema/Field";
import StringField from "../../../src/Model/Schema/Fields/StringField";
import FieldType from "../../../src/Model/Schema/FieldType";

describe("DocumentChange", () => {
    it("should have setters/getters.", () => {
        const field = new StringField("test");
        const change = new DocumentChange(field, 1, 2);
        expect(change.$field).toBe(field);
        expect(change.$updated).toEqual("2");
        expect(change.$old).toEqual("1");
    });
});
