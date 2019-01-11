import DocumentChange from "../../../src/Model/Changes/DocumentChange";
import DocumentChanges from "../../../src/Model/Changes/DocumentChanges";
import Field from "../../../src/Model/Schema/Field";
import StringField from "../../../src/Model/Schema/Fields/StringField";
import FieldType from "../../../src/Model/Schema/FieldType";

describe("DocumentChanges", () => {
    it("should have setters/getters.", () => {
        const field = new StringField("test");
        const change = new DocumentChange(field, {value: 1}, {value: 2});
        const documentChanges = new DocumentChanges();
        documentChanges.setChange(change);
        expect(documentChanges.size()).toBe(1);
        expect(documentChanges.has("test")).toEqual(true);
        expect(documentChanges.get("test")).toEqual(change);
    });
});
