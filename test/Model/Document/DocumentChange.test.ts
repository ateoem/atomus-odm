import DocumentChange from "../../../src/Model/Mapping/DocumentChange";
import FieldType from "../../../src/Model/Mapping/Enum/FieldType";
import Field from "../../../src/Model/Mapping/Field/Field";
import StringField from "../../../src/Model/Mapping/Field/StringField";

describe("DocumentChange", () => {
    it("should have setters/getters.", () => {
        const field = new StringField("test");
        const change = new DocumentChange(field, 1, 2);
        expect(change.$field).toBe(field);
        expect(change.$updated).toEqual("2");
        expect(change.$old).toEqual("1");
    });
});
