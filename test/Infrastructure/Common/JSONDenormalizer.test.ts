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
            expect(denormalizedAggregate.computeChanges(mappedAggregate).$changed.size).toEqual(0);
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
        .mapping("children_lorem")
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
            expect(denormalizedAggregateWithChild.computeChanges(mappedAggregate).$changed.size).toEqual(0);
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
});
