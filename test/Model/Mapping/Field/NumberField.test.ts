import FieldType from "../../../../src/Model/Mapping/Enum/FieldType";
import NumberField from "../../../../src/Model/Mapping/Field/NumberField";

describe("NumberField", () => {
    test("should have getters/setters/clone.", () => {
        const field = new NumberField("lorem");
        expect(field.$name).toBe("lorem");
        expect(field.$type).toBe(FieldType.number);
        expect(field.clone().isEqual(field)).toBe(true);
    });

    it("should be equal if same name.", () => {
        const field = new NumberField("lorem");
        const secondField = new NumberField("lorem");
        expect(field.isEqual(secondField)).toBe(true);
    });

    it("should not be equal if not same name.", () => {
        const field = new NumberField("lorem");
        const secondField = new NumberField("lorem_ipsum");
        expect(field.isEqual(secondField)).toBe(false);
    });
});