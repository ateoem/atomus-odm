import AggregateMapping from "./AggregateMapping";
import FieldType from "./FieldType";
import ScalarField from "./ScalarField";

test("AggregateMapping class", () => {
    const fields = [
        new ScalarField("test", FieldType.string),
        new ScalarField("test2", FieldType.string),
    ];
    const aggregateMapping = new AggregateMapping("test_mapping", fields);
    expect(aggregateMapping.$fields).toBe(fields);
    expect(aggregateMapping.$name).toBe("test_mapping");
});
