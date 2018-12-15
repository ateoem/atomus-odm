import AggregateMapping from "../Mapping/AggregateMapping";
import FieldType from "../Mapping/FieldType";
import ScalarField from "../Mapping/ScalarField";
import Aggregate from "./Aggregate";

test("Aggregate", () => {
    const fields = [
        new ScalarField("name", FieldType.string),
        new ScalarField("surname", FieldType.string),
    ];
    const aggregateMapping = new AggregateMapping("test_mapping", fields);

    const aggregate = Aggregate.createEmpty("test", aggregateMapping);
    const differentAggregate = Aggregate.createEmpty("test", aggregateMapping);

    expect(aggregate.id()).not.toBeNull();
    expect(aggregate.computeChanges(aggregate)).toEqual({changed: []});
    const computedChanges = aggregate.computeChanges(differentAggregate);
    expect(computedChanges.length()).toEqual(1);
    expect(computedChanges.$changed[0].$field.$name).toEqual("id");
});
