import FieldValue from "../../../src/Model/Document/FieldValue";
import MappedAggregate from "../../../src/Model/Document/MappedDocument";
import AggregateMapping from "../../../src/Model/Mapping/DocumentMapping";
import Field from "../../../src/Model/Mapping/Field";
import FieldType from "../../../src/Model/Mapping/FieldType";
import Builder from "../../Infrastructure/Common/Builder";

describe("MappedDocument", () => {
    const fields = [
        new Field("id", FieldType.uuid),
        new Field("name", FieldType.string),
        new Field("surname", FieldType.string),
    ];
    const exampleAggregateMapping = new AggregateMapping("test_mapping", fields);

    it("should have id set if created as empty.", () => {
        const aggregate = new MappedAggregate(exampleAggregateMapping);
        expect(aggregate.$id).not.toBeNull();
    });

    it("should not have differences to itself.", () => {
        const aggregate = new MappedAggregate(exampleAggregateMapping);
        expect(aggregate.computeChanges(aggregate)).toBeFalsy();
    });

    it("should guard against inconsistency.", () => {
        expect(() => {
            const mockFieldValues = [new FieldValue(new Field("nam1e1", FieldType.string), {value: 1})];
            const aggregate = new MappedAggregate(exampleAggregateMapping, mockFieldValues);
        }).toThrowError();
    });

    it("should compute changes if there is different size in children.", () => {
        const childAggregateMapping = Builder
        .mapping("child_lorem")
        .addField(new Field("child_text", FieldType.string))
        .build();

        const aggregateMapping = Builder
    .mapping("root_lorem")
    .addField(new Field("test", FieldType.string))
    .addField(new Field("id", FieldType.uuid))
    .addField(new Field("lorem_childs", FieldType.children, {mapping: childAggregateMapping}))
    .build();

        const children = [];
        for (let i = 0; i < 5; i += 1) {
        children.push(Builder
            .mappedAggregate(childAggregateMapping)
            .addFieldValue("child_text", "lorem_ipsum" + i)
            .build());
    }

        const mappedAggregate = Builder
    .mappedAggregate(aggregateMapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_childs", children)
    .build();

        const aggregateMock = Builder.aggregateManager();
        const denormalizer = aggregateMock.$normalizer;
        aggregateMock.$mappings.set(aggregateMapping.$name, aggregateMapping);
        aggregateMock.$mappings.set(childAggregateMapping.$name, childAggregateMapping);
        const json = {
            id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
            [aggregateMock.$symbol]: {
                aggregateName: "root_lorem",
            },
            lorem_childs: [
                {child_text: "lorem_ipsum0"},
                {child_text: "lorem_ipsum1"},
                {child_text: "lorem_ipsum2"},
                {child_text: "lorem_ipsum3"},
                {child_text: "lorem_ipsum4"},
            ],
            test: "lorem",
        };
        expect(denormalizer.normalize(mappedAggregate)).toEqual(json);
    });

    it("Should denormalize array of child", () => {
        const childAggregateMapping = Builder
        .mapping("child_lorem")
        .addField(new Field("child_text", FieldType.string))
        .build();

        const aggregateMapping = Builder
    .mapping("root_lorem")
    .addField(new Field("test", FieldType.string))
    .addField(new Field("id", FieldType.uuid))
    .addField(new Field("lorem_childs", FieldType.children, {mapping: childAggregateMapping}))
    .build();

        const children = [];
        for (let i = 0; i < 5; i += 1) {
        children.push(Builder
            .mappedAggregate(childAggregateMapping)
            .addFieldValue("child_text", "lorem_ipsum" + i)
            .build());
    }

        const mappedAggregate = Builder
    .mappedAggregate(aggregateMapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_childs", children)
    .build();

        const secondAggregate = Builder
    .mappedAggregate(aggregateMapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_childs", children.slice(0, 2))
    .build();

        expect(mappedAggregate.computeChanges(secondAggregate)).toBeTruthy();
        expect(secondAggregate.computeChanges(mappedAggregate)).toBeTruthy();

        expect(mappedAggregate.getChildren("lorem_childs")[4].$changes.size).toBe(1);
        expect(mappedAggregate.getChildren("lorem_childs")[4].$changes.has("delete")).toBeTruthy();

        expect(secondAggregate.getChildren("lorem_childs")[4].$changes.has("child_text")).toBeTruthy();
    });
});
