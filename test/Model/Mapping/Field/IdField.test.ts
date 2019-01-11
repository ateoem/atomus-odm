import FieldType from "../../../../src/Model/Mapping/Enum/FieldType";
import IdField from "../../../../src/Model/Mapping/Field/IdField";

describe("IdField", () => {
    it("should have getters/setters/clone.", () => {
        const field = new IdField("lorem");
        expect(field.$name).toBe("lorem");
        expect(field.$type).toBe(FieldType.uuid);
        expect(field.clone().isEqual(field)).toBe(true);
    });

    it("should be equal if same name.", () => {
        const field = new IdField("lorem");
        const secondField = new IdField("lorem");
        expect(field.isEqual(secondField)).toBe(true);
    });

    it("should not be equal if not same name.", () => {
        const field = new IdField("lorem");
        const secondField = new IdField("lorem_ipsum");
        expect(field.isEqual(secondField)).toBe(false);
    });
});