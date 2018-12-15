import Aggregate from "../../../src/Model/Aggregate/Aggregate";
import AggregateMapping from "../../../src/Model/Mapping/AggregateMapping";
import FieldType from "../../../src/Model/Mapping/FieldType";
import FieldValue from "../../../src/Model/Aggregate/FieldValue";
import ScalarField from "../../../src/Model/Mapping/ScalarField";

describe("Aggregate", () => {
    const fields = [
        new ScalarField("name", FieldType.string),
        new ScalarField("surname", FieldType.string),
    ];
    const aggregateMapping = new AggregateMapping("test_mapping", fields);

    it("should have id set if created as empty.", () => {
        const aggregate = Aggregate.createEmpty("test", aggregateMapping);
        expect(aggregate.id()).not.toBeNull();
    });

    it("should not have differences to itself.", () => {
        const aggregate = Aggregate.createEmpty("test", aggregateMapping);
        expect(aggregate.computeChanges(aggregate)).toEqual({changed: []});
    });

    it("should guard against inconsistency.", () => {
        expect(() => {
            const mockFieldValues = [new FieldValue(new ScalarField("nam1e1", FieldType.string), {value: 1})];
            Aggregate.createEmpty("test", aggregateMapping, mockFieldValues);
        }).toThrowError();
    });

    it("should compute changes.", () => {
        const aggregate = Aggregate.createEmpty("test", aggregateMapping);
        const differentAggregate = Aggregate.createEmpty("test", aggregateMapping);

        const computedChanges = aggregate.computeChanges(differentAggregate);
        expect(computedChanges.length()).toEqual(1);
        expect(computedChanges.$changed[0].$field.$name).toEqual("id");
    });
});
