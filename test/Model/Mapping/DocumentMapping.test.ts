import DocumentMapping from "../../../src/Model/Mapping/DocumentMapping";
import Field from "../../../src/Model/Mapping/Field";
import StringField from "../../../src/Model/Mapping/Fields/StringField";
import FieldType from "../../../src/Model/Mapping/FieldType";

describe("DocumentMapping", () => {
    it("should have setters/getters with constructor.", () => {
        const fields = [
            new StringField("name"),
            new StringField("surname"),
        ];
        const documentMapping = new DocumentMapping("test_mapping", fields);

        expect(documentMapping.$fieldsArray).toEqual(fields);
        expect(documentMapping.size()).toEqual(2);
        expect(documentMapping.has("name")).toEqual(true);
        expect(documentMapping.$name).toBe("test_mapping");
    });

    it("should have setters/getters with addField.", () => {
        const documentMapping = new DocumentMapping("test_mapping");
        documentMapping.addField(new StringField("name"));
        documentMapping.addField(new StringField("surname"));

        expect(documentMapping.size()).toEqual(2);
        expect(documentMapping.has("name")).toEqual(true);
        expect(documentMapping.$name).toBe("test_mapping");
    });

    it("should have setters/getters with addFields.", () => {
        const documentMapping = new DocumentMapping("test_mapping");
        documentMapping.addFields(
            new StringField("name"),
            new StringField("surname"),
        );

        expect(documentMapping.size()).toEqual(2);
        expect(documentMapping.has("name")).toEqual(true);
        expect(documentMapping.$name).toBe("test_mapping");
    });
});
