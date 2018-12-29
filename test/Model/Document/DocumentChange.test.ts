import DocumentChange from "../../../src/Model/Document/DocumentChange";
import Field from "../../../src/Model/Mapping/Field";
import StringField from "../../../src/Model/Mapping/Fields/StringField";
import FieldType from "../../../src/Model/Mapping/FieldType";

describe("DocumentChange", () => {
    it("should have setters/getters.", () => {
        const field = new StringField("test");
        const change = new DocumentChange(field, 1, 2);
        expect(change.$field).toBe(field);
        expect(change.$updated).toEqual("2");
        expect(change.$old).toEqual("1");
    });
});
