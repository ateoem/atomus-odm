import FieldValue from "./FieldValue";
import ScalarField from "../Mapping/ScalarField";
import FieldType from "../Mapping/FieldType";

test('FieldValue', () => {
    const field = new ScalarField("test", FieldType.string);
    const fieldValue = new FieldValue(field, {value: "test"});
    expect(fieldValue.$field).toBe(field);
    expect(fieldValue.$value).toEqual({value: "test"});
});