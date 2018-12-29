import JSONDenormalizer from "../../../src/Infrastructure/Common/JSONDenormalizer";
import FieldValue from "../../../src/Model/Document/FieldValue";
import MappedAggregate from "../../../src/Model/Document/MappedDocument";
import ManagedAggregate from "../../../src/Model/Document/RootDocument";
import AggregateMapping from "../../../src/Model/Mapping/DocumentMapping";
import Field from "../../../src/Model/Mapping/Field";
import FieldType from "../../../src/Model/Mapping/FieldType";
import Builder from "./Builder";

describe("AggregateManager", () => {
    describe("Flat-Document (de)normalization", () => {

        const aggregateMapping = Builder
        .mapping("test_aggr")
        .addField(new Field("name", FieldType.string))
        .addField(new Field("surname", FieldType.string))
        .addField(new Field("id", FieldType.uuid))
        .build();

        const mappedAggregate = Builder
        .mappedAggregate(aggregateMapping)
        .addFieldValue("name", "test")
        .addFieldValue("surname", "ipsum")
        .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
        .build();

        const managedAggregate = new ManagedAggregate(mappedAggregate);
        const aggregateMock = Builder.aggregateManager();
        aggregateMock.$mappings.set(aggregateMapping.$name, aggregateMapping);
        const denormalizer = aggregateMock.$normalizer;
        it("should map managed aggregate to JSON with metadata.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                name: "test",
                surname: "ipsum",
                [aggregateMock.$symbol]: {
                    aggregateName: "test_aggr",
                },
            };
            const denormalizedJSON = denormalizer.normalize(managedAggregate.$aggregate);
            expect(denormalizedJSON).toEqual(json);
        });

        it("should map JSON with metadata to aggregate.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [aggregateMock.$symbol]: {
                    aggregateName: "test_aggr",
                },
                name: "test",
                surname: "ipsum",
            };
            const denormalizedAggregate: MappedAggregate = denormalizer.denormalize(json);
            expect(denormalizedAggregate.computeChanges(mappedAggregate)).toBeFalsy();
        });

        it("should fail if document not found.", () => {
            expect(() => {
                const json = {id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [aggregateMock.$symbol]: {
                    aggregateName: "non_existent",
                },
                name: "test",
                surname: "ipsum",
            };
                denormalizer.denormalize(json);
            }).toThrowError();
        });

    });

    describe("Child-document (de)normalization", () => {
        const childAggregateMapping = Builder
        .mapping("child_lorem")
        .addField(new Field("child_text", FieldType.string))
        .build();

        const aggregateMapping = Builder
    .mapping("root_lorem")
    .addField(new Field("test", FieldType.string))
    .addField(new Field("id", FieldType.uuid))
    .addField(new Field("lorem_child", FieldType.child, {mapping: childAggregateMapping}))
    .build();

        const childMappedAggregate = Builder
    .mappedAggregate(childAggregateMapping)
    .addFieldValue("child_text", "lorem_ipsum")
    .build();

        const mappedAggregate = Builder
    .mappedAggregate(aggregateMapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_child", childMappedAggregate)
    .build();

        const aggregateMock = Builder.aggregateManager();
        const denormalizer = aggregateMock.$normalizer;
        aggregateMock.$mappings.set(aggregateMapping.$name, aggregateMapping);
        aggregateMock.$mappings.set(childAggregateMapping.$name, childAggregateMapping);

        it("should map JSON with metadata to aggregate with child.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [aggregateMock.$symbol]: {
                    aggregateName: "root_lorem",
                },
                lorem_child: {
                    child_text: "lorem_ipsum",
                },
                test: "lorem",
            };
            const denormalizedAggregateWithChild: MappedAggregate = denormalizer.denormalize(json);
            expect(denormalizedAggregateWithChild.computeChanges(mappedAggregate)).toBeFalsy();
        });

        it("should map managed aggregate to JSON with metadata.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [aggregateMock.$symbol]: {
                    aggregateName: "root_lorem",
                },
                lorem_child: {
                    child_text: "lorem_ipsum",
                },
                test: "lorem",
            };
            const objectJson: any = denormalizer.normalize(mappedAggregate);
            expect(objectJson).toEqual(json);
        });
    });

    describe("Multi-level-child-document (de)normalization", () => {
        const childChildAggregateMapping = Builder
        .mapping("child_child_lorem")
        .addField(new Field("child_child_text", FieldType.string))
        .build();

        const childAggregateMapping = Builder
        .mapping("child_lorem")
        .addField(new Field("child_text", FieldType.string))
        .addField(new Field("child_child", FieldType.child, {mapping: childChildAggregateMapping}))
        .build();

        const aggregateMapping = Builder
    .mapping("root_lorem")
    .addField(new Field("test", FieldType.string))
    .addField(new Field("id", FieldType.uuid))
    .addField(new Field("lorem_child", FieldType.child, {mapping: childAggregateMapping}))
    .build();

        const childChildMappedAggregate = Builder
    .mappedAggregate(childChildAggregateMapping)
    .addFieldValue("child_child_text", "child_child_lorem_ipsum")
    .build();

        const childMappedAggregate = Builder
    .mappedAggregate(childAggregateMapping)
    .addFieldValue("child_text", "child_lorem_ipsum")
    .addFieldValue("child_child", childChildMappedAggregate)
    .build();

        const mappedAggregate = Builder
    .mappedAggregate(aggregateMapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_child", childMappedAggregate)
    .build();

        const aggregateMock = Builder.aggregateManager();
        const denormalizer = aggregateMock.$normalizer;
        aggregateMock.$mappings.set(aggregateMapping.$name, aggregateMapping);
        aggregateMock.$mappings.set(childAggregateMapping.$name, childAggregateMapping);
        aggregateMock.$mappings.set(childChildAggregateMapping.$name, childChildAggregateMapping);

        it("should map JSON with metadata to aggregate with child.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [aggregateMock.$symbol]: {
                    aggregateName: "root_lorem",
                },
                lorem_child: {
                    child_child: {
                        child_child_text: "child_child_lorem_ipsum",
                    },
                    child_text: "child_lorem_ipsum",
                },
                test: "lorem",
            };
            const denormalizedAggregateWithChild: MappedAggregate = denormalizer.denormalize(json);
            denormalizedAggregateWithChild.computeChanges(mappedAggregate);
            expect(denormalizedAggregateWithChild.$changes.size).toEqual(0);
        });

        it("should map managed aggregate to JSON with metadata.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [aggregateMock.$symbol]: {
                    aggregateName: "root_lorem",
                },
                lorem_child: {
                    child_child: {
                        child_child_text: "child_child_lorem_ipsum",
                    },
                    child_text: "child_lorem_ipsum",
                },
                test: "lorem",
            };
            const objectJson: any = denormalizer.normalize(mappedAggregate);
            expect(objectJson).toEqual(json);
        });
    });

    describe("Children (de)normalization.", () => {
        it("Should normalize array of child", () => {
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

            const denormalizedMappedAggregate = denormalizer.denormalize(json);
            mappedAggregate.computeChanges(denormalizedMappedAggregate);
            expect(mappedAggregate.$changes.size).toEqual(0);
        });
    });
});
