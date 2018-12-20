import AggregateMapping from "../../../src/Model/Mapping/AggregateMapping";
import FieldType from "../../../src/Model/Mapping/FieldType";
import Field from "../../../src/Model/Mapping/Field";

describe("AggregateMapping", () => {
    it("should have setters/getters.", () => {
        const fields = [
            new Field("name", FieldType.string),
            new Field("surname", FieldType.string),
        ];
        const aggregateMapping = new AggregateMapping("test_mapping", fields);

        expect(aggregateMapping.$fieldsArray).toEqual(fields);
        expect(aggregateMapping.$name).toBe("test_mapping");
    });
});
