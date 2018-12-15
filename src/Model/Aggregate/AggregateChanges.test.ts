import Field from "../Mapping/Field";
import ScalarField from "../Mapping/ScalarField";
import FieldType from "../Mapping/FieldType";
import AggregateChange from "./AggregateChange";
import AggregateChanges from "./AggregateChanges";

test("AggregateChanges", () => {
    const field = new ScalarField("test", FieldType.string);
    const change = new AggregateChange(field, {value: 1}, {value: 2});
    const aggregateChanges = new AggregateChanges();
    aggregateChanges.addChange(change);
    expect(aggregateChanges.length()).toBe(1);
    expect(aggregateChanges.$changed).toEqual([change]);
});