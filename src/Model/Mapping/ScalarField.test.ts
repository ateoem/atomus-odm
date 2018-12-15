import FieldType from "./FieldType";
import ScalarField from "./ScalarField";

test("ScalarField class", () => {
            const field = new ScalarField("test", FieldType.string);
            expect(field.$name).toBe("test");
            expect(field.$type).toBe(FieldType.string);
});
