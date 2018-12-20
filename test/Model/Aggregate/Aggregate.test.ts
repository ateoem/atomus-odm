import Aggregate from "../../../src/Model/Aggregate/Aggregate";
import FieldValue from "../../../src/Model/Aggregate/FieldValue";
import AggregateMapping from "../../../src/Model/Mapping/AggregateMapping";
import FieldType from "../../../src/Model/Mapping/FieldType";
import Field from "../../../src/Model/Mapping/Field";

describe("Aggregate", () => {
    const fields = [
        new Field("name", FieldType.string),
        new Field("surname", FieldType.string),
    ];
    const aggregateMapping = new AggregateMapping("test_mapping", fields);

    it("should have id set if created as empty.", () => {
        const aggregate = new Aggregate(aggregateMapping);
        expect(aggregate.$id).not.toBeNull();
    });

    it("should not have differences to itself.", () => {
        const aggregate = new Aggregate(aggregateMapping);
        expect(aggregate.computeChanges(aggregate).$changed.size).toEqual(0);
    });

    it("should guard against inconsistency.", () => {
        expect(() => {
            const mockFieldValues = [new FieldValue(new Field("nam1e1", FieldType.string), {value: 1})];
            const aggregate = new Aggregate(aggregateMapping, mockFieldValues);
        }).toThrowError();
    });

    it("should compute changes.", () => {
        const aggregate = new Aggregate(aggregateMapping);
        const differentAggregate = new Aggregate(aggregateMapping);

        const computedChanges = aggregate.computeChanges(differentAggregate);
        expect(computedChanges.$changed.size).toEqual(1);
        expect(computedChanges.$changed.has("id")).toBeTruthy();
    });
});
