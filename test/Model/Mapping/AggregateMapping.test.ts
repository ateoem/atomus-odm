import AggregateMapping from "../../../src/Model/Mapping/AggregateMapping";
import FieldType from "../../../src/Model/Mapping/FieldType";
import ScalarField from "../../../src/Model/Mapping/ScalarField";

describe("AggregateMapping", () => {
    it("should have setters/getters.", () => {
        const fields = [
            new ScalarField("name", FieldType.string),
            new ScalarField("surname", FieldType.string),
        ];
        const aggregateMapping = new AggregateMapping("test_mapping", fields);

        expect(aggregateMapping.$fields).toBe(fields);
        expect(aggregateMapping.$name).toBe("test_mapping");
    });
});
