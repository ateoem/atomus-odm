import FieldType from "../../../../src/Model/Mapping/Enum/FieldType";
import ChildrenField from "../../../../src/Model/Mapping/Field/ChildrenField";
import FieldCollection from "../../../../src/Model/Mapping/FieldCollection";
import { FIELD_NAME, FIELD_SURNAME, FIELDS_ARRAY_USER } from "../../../Utils/ExampleFields";

describe("ChildField", () => {

    const collection = new FieldCollection("test", FIELDS_ARRAY_USER);
    const differentCollection = new FieldCollection("test", [FIELD_NAME]);

    test("getters/setters/clone", () => {
        const field = new ChildrenField("lorem", collection);
        expect(field.$name).toBe("lorem");
        expect(field.$type).toBe(FieldType.children);
        expect(field.clone().isEqual(field)).toBe(true);
    });

    it("should be equal if same name and mapping.", () => {
        const firstField = new ChildrenField("lorem", collection);
        const secondField = new ChildrenField("lorem", collection);        
        expect(firstField.isEqual(secondField)).toBe(true);
    });
    it("should not be equal if different name and same mapping.", () => {
        const firstField = new ChildrenField("lorem", collection);
        const secondField = new ChildrenField("lorem_ipsum", collection);        
        expect(firstField.isEqual(secondField)).toBe(false);
    });

    it("should not be equal if same name and different mapping.", () => {
        const firstField = new ChildrenField("lorem", collection);
        const secondField = new ChildrenField("lorem", differentCollection);        
        expect(firstField.isEqual(secondField)).toBe(false);
    });
});