import FieldType from "../../../src/Model/Mapping/FieldType";
import ScalarField from "../../../src/Model/Mapping/ScalarField";

describe("ScalarField class", () => {
    it("should have getters/setters.", () => {
        const field = new ScalarField("test", FieldType.string);
        expect(field.$name).toBe("test");
        expect(field.$type).toBe(FieldType.string);
    });
});
