import FieldValue from "../../../src/Model/Document/FieldValue";
import MappedAggregate from "../../../src/Model/Document/MappedDocument";
import AggregateMapping from "../../../src/Model/Mapping/DocumentMapping";
import Field from "../../../src/Model/Mapping/Field";
import FieldType from "../../../src/Model/Mapping/FieldType";

describe("MappedDocument", () => {
    const fields = [
        new Field("id", FieldType.uuid),
        new Field("name", FieldType.string),
        new Field("surname", FieldType.string),
    ];
    const aggregateMapping = new AggregateMapping("test_mapping", fields);

    it("should have id set if created as empty.", () => {
        const aggregate = new MappedAggregate(aggregateMapping);
        expect(aggregate.$id).not.toBeNull();
    });

    it("should not have differences to itself.", () => {
        const aggregate = new MappedAggregate(aggregateMapping);
        expect(aggregate.computeChanges(aggregate).$changed.size).toEqual(0);
    });

    it("should guard against inconsistency.", () => {
        expect(() => {
            const mockFieldValues = [new FieldValue(new Field("nam1e1", FieldType.string), {value: 1})];
            const aggregate = new MappedAggregate(aggregateMapping, mockFieldValues);
        }).toThrowError();
    });
});
