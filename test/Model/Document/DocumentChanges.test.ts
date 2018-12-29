import DocumentChange from "../../../src/Model/Document/DocumentChange";
import DocumentChanges from "../../../src/Model/Document/DocumentChanges";
import Field from "../../../src/Model/Mapping/Field";
import StringField from "../../../src/Model/Mapping/Fields/StringField";
import FieldType from "../../../src/Model/Mapping/FieldType";

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
