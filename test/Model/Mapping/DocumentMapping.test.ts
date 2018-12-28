import AggregateMapping from "../../../src/Model/Mapping/DocumentMapping";
import Field from "../../../src/Model/Mapping/Field";
import FieldType from "../../../src/Model/Mapping/FieldType";

describe("DocumentMapping", () => {
    it("should have setters/getters with constructor.", () => {
        const fields = [
            new Field("name", FieldType.string),
            new Field("surname", FieldType.string),
        ];
        const aggregateMapping = new AggregateMapping("test_mapping", fields);

        expect(aggregateMapping.$fieldsArray).toEqual(fields);
        expect(aggregateMapping.size()).toEqual(2);
        expect(aggregateMapping.has("name")).toEqual(true);
        expect(aggregateMapping.$name).toBe("test_mapping");
    });

    it("should have setters/getters with addField.", () => {
        const aggregateMapping = new AggregateMapping("test_mapping");
        aggregateMapping.addField(new Field("name", FieldType.string));
        aggregateMapping.addField(new Field("surname", FieldType.string));

        expect(aggregateMapping.size()).toEqual(2);
        expect(aggregateMapping.has("name")).toEqual(true);
        expect(aggregateMapping.$name).toBe("test_mapping");
    });

    it("should have setters/getters with addFields.", () => {
        const aggregateMapping = new AggregateMapping("test_mapping");
        aggregateMapping.addFields(
            new Field("name", FieldType.string),
            new Field("surname", FieldType.string),
        );

        expect(aggregateMapping.size()).toEqual(2);
        expect(aggregateMapping.has("name")).toEqual(true);
        expect(aggregateMapping.$name).toBe("test_mapping");
    });
});
