import FieldType from "../../../../src/Model/Mapping/Enum/FieldType";
import ChildField from "../../../../src/Model/Mapping/Field/ChildField";
import ChildrenField from "../../../../src/Model/Mapping/Field/ChildrenField";
import IdField from "../../../../src/Model/Mapping/Field/IdField";
import StringField from "../../../../src/Model/Mapping/Field/StringField";
import FieldCollection from "../../../../src/Model/Mapping/FieldCollection";

describe("ChildField", () => {
    const nameField = new StringField("name");
    const surnameField = new StringField("surname");
    const fields = [
        nameField,
        surnameField,
    ];

    const collection = new FieldCollection("test", fields);
    const differentCollection = new FieldCollection("test", [nameField]);

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