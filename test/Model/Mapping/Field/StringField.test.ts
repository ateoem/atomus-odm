import FieldType from "../../../../src/Model/Mapping/Enum/FieldType";
import StringField from "../../../../src/Model/Mapping/Field/StringField";

describe("StringField", () => {
    test("getters/setters/clone", () => {
        const field = new StringField("lorem");
        expect(field.$name).toBe("lorem");
        expect(field.$type).toBe(FieldType.string);
        expect(field.clone().isEqual(field)).toBe(true);
    });

    it("should be equal if same name.", () => {
        const field = new StringField("lorem");
        const secondField = new StringField("lorem");
        expect(field.isEqual(secondField)).toBe(true);
    });

    it("should not be equal if not same name.", () => {
        const field = new StringField("lorem");
        const secondField = new StringField("lorem_ipsum");
        expect(field.isEqual(secondField)).toBe(false);
    });
});