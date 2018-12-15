import Field from "../Mapping/Field";
import FieldType from "../Mapping/FieldType";
import ScalarField from "../Mapping/ScalarField";
import AggregateChange from "./AggregateChange";

test("AggregateChange", () => {
    const field = new ScalarField("test", FieldType.string);
    const change = new AggregateChange(field, {value: 1}, {value: 2});
    expect(change.$field).toBe(field);
    expect(change.$changed).toEqual({value: 2});
    expect(change.$old).toEqual({value: 1});
});
