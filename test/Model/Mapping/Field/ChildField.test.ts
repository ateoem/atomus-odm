import FieldType from "../../../../src/Model/Mapping/Enum/FieldType";
import ChildField from "../../../../src/Model/Mapping/Field/ChildField";
import IdField from "../../../../src/Model/Mapping/Field/IdField";
import StringField from "../../../../src/Model/Mapping/Field/StringField";
import FieldCollection from "../../../../src/Model/Mapping/FieldCollection";
import { nameField, surnameField, userFields, userFieldsArray } from "../../../Utils/ExampleFields";

describe("ChildField", () => {

    const collection = userFields;
    const differentCollection = new FieldCollection("test", [nameField]);

    test("getters/setters/clone", () => {
        const field = new ChildField("lorem", collection);
        expect(field.$name).toBe("lorem");
        expect(field.$type).toBe(FieldType.child);
        expect(field.clone().isEqual(field)).toBe(true);
    });

    it("should be equal if same name and mapping.", () => {
        const firstField = new ChildField("lorem", collection);
        const secondField = new ChildField("lorem", collection);        
        expect(firstField.isEqual(secondField)).toBe(true);
    });
    it("should not be equal if different name and same mapping.", () => {
        const firstField = new ChildField("lorem", collection);
        const secondField = new ChildField("lorem_ipsum", collection);        
        expect(firstField.isEqual(secondField)).toBe(false);
    });

    it("should not be equal if same name and different mapping.", () => {
        const firstField = new ChildField("lorem", collection);
        const secondField = new ChildField("lorem", differentCollection);        
        expect(firstField.isEqual(secondField)).toBe(false);
    });
});