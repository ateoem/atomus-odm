import FieldType from "../../../../src/Model/Mapping/Enum/FieldType";
import IdField from "../../../../src/Model/Mapping/Field/IdField";
import IdFieldValue from "../../../../src/Model/Mapping/FieldValue/UuidFieldValue";
import { MongoDBIDField } from "../../../Utils/ExampleFields";

describe("StringFieldValue", () => {
    it("should have default value.", () => {
        const fieldValue = new IdFieldValue(MongoDBIDField);
        expect(fieldValue.$value).toBe("");
    });

    it("should have setters/getters/clone/isequal", () => {
        const fieldValue = new IdFieldValue(MongoDBIDField, "test");
        expect(fieldValue.$name).toBe("_id");
        expect(fieldValue.$field.isEqual(MongoDBIDField)).toBe(true);
        expect(fieldValue.$value).toBe("test");
        expect(fieldValue.$type).toBe(FieldType.uuid);
        expect(fieldValue.clone().isEqual(fieldValue));
    });

    it("should be equal if same field and value.", () => {
        const field = new IdFieldValue(MongoDBIDField, "lorem");
        const secondField = new IdFieldValue(MongoDBIDField, "lorem");
        expect(field.isEqual(secondField)).toBe(true);
    });

    it("should not be equal if not same field.", () => {
        const field = new IdFieldValue(MongoDBIDField, "lorem");
        const secondField = new IdFieldValue(new IdField("_uuid"), "lorem");
        expect(field.isEqual(secondField)).toBe(false);
    });

    it("should not be equal if same field but different value.", () => {
        const field = new IdFieldValue(MongoDBIDField, "lorem_test");
        const secondField = new IdFieldValue(MongoDBIDField, "lorem");
        expect(field.isEqual(secondField)).toBe(false);
    });
});