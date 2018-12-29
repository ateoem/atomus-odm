import MappedDocument from "../../../src/Model/Document/MappedDocument";
import RootDocument from "../../../src/Model/Document/RootDocument";
import ChildField from "../../../src/Model/Mapping/Fields/ChildField";
import ChildrenField from "../../../src/Model/Mapping/Fields/ChildrenField";
import IdField from "../../../src/Model/Mapping/Fields/IdField";
import StringField from "../../../src/Model/Mapping/Fields/StringField";
import Builder from "./Builder";

describe("JSONDenormalizer", () => {
    describe("Flat-Document (de)normalization", () => {

        const mapping = Builder
        .mapping("test_aggr")
        .addField(new StringField("name"))
        .addField(new StringField("surname"))
        .addField(new IdField("id"))
        .build();

        const mappedDocument = Builder
        .mappedDocument(mapping)
        .addFieldValue("name", "test")
        .addFieldValue("surname", "ipsum")
        .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
        .build();

        const managedDocument = new RootDocument(mappedDocument);
        const documentMock = Builder.documentManager();
        documentMock.$mappings.set(mapping.$name, mapping);
        const denormalizer = documentMock.$normalizer;
        it("should map managed document to JSON with metadata.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                name: "test",
                surname: "ipsum",
                [documentMock.$symbol]: {
                    documentName: "test_aggr",
                },
            };
            const denormalizedJSON = denormalizer.normalize(managedDocument.$document);
            expect(denormalizedJSON).toEqual(json);
        });

        it("should map JSON with metadata to document.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [documentMock.$symbol]: {
                    documentName: "test_aggr",
                },
                name: "test",
                surname: "ipsum",
            };
            const denormalizedDocument: MappedDocument = denormalizer.denormalize(json);
            expect(denormalizedDocument.computeChanges(mappedDocument)).toBeFalsy();
        });

        it("should fail if document not found.", () => {
            expect(() => {
                const json = {id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [documentMock.$symbol]: {
                    documentName: "non_existent",
                },
                name: "test",
                surname: "ipsum",
            };
                denormalizer.denormalize(json);
            }).toThrowError();
        });

    });

    describe("Child-document (de)normalization", () => {
        const childDocumentMapping = Builder
        .mapping("child_lorem")
        .addField(new StringField("child_text"))
        .build();

        const mapping = Builder
    .mapping("root_lorem")
    .addField(new StringField("test"))
    .addField(new IdField("id"))
    .addField(new ChildField("lorem_child", childDocumentMapping))
    .build();

        const childMappedDocument = Builder
    .mappedDocument(childDocumentMapping)
    .addFieldValue("child_text", "lorem_ipsum")
    .build();

        const mappedDocument = Builder
    .mappedDocument(mapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_child", childMappedDocument)
    .build();

        const documentMock = Builder.documentManager();
        const denormalizer = documentMock.$normalizer;
        documentMock.$mappings.set(mapping.$name, mapping);
        documentMock.$mappings.set(childDocumentMapping.$name, childDocumentMapping);

        it("should map JSON with metadata to document with child.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [documentMock.$symbol]: {
                    documentName: "root_lorem",
                },
                lorem_child: {
                    child_text: "lorem_ipsum",
                },
                test: "lorem",
            };
            const denormalizedDocumentWithChild: MappedDocument = denormalizer.denormalize(json);
            expect(denormalizedDocumentWithChild.computeChanges(mappedDocument)).toBeFalsy();
        });

        it("should map managed document to JSON with metadata.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [documentMock.$symbol]: {
                    documentName: "root_lorem",
                },
                lorem_child: {
                    child_text: "lorem_ipsum",
                },
                test: "lorem",
            };
            const objectJson: any = denormalizer.normalize(mappedDocument);
            expect(objectJson).toEqual(json);
        });
    });

    describe("Multi-level-child-document (de)normalization", () => {
        const childChildDocumentMapping = Builder
        .mapping("child_child_lorem")
        .addField(new StringField("child_child_text"))
        .build();

        const childDocumentMapping = Builder
        .mapping("child_lorem")
        .addField(new StringField("child_text"))
        .addField(new ChildField("child_child", childChildDocumentMapping))
        .build();

        const documentMapping = Builder
    .mapping("root_lorem")
    .addField(new StringField("test"))
    .addField(new IdField("id"))
    .addField(new ChildField("lorem_child", childDocumentMapping))
    .build();

        const childChildMappedDocument = Builder
    .mappedDocument(childChildDocumentMapping)
    .addFieldValue("child_child_text", "child_child_lorem_ipsum")
    .build();

        const childMappedDocument = Builder
    .mappedDocument(childDocumentMapping)
    .addFieldValue("child_text", "child_lorem_ipsum")
    .addFieldValue("child_child", childChildMappedDocument)
    .build();

        const mappedDocument = Builder
    .mappedDocument(documentMapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_child", childMappedDocument)
    .build();

        const documentMock = Builder.documentManager();
        const denormalizer = documentMock.$normalizer;
        documentMock.$mappings.set(documentMapping.$name, documentMapping);
        documentMock.$mappings.set(childDocumentMapping.$name, childDocumentMapping);
        documentMock.$mappings.set(childChildDocumentMapping.$name, childChildDocumentMapping);

        it("should map JSON with metadata to document with child.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [documentMock.$symbol]: {
                    documentName: "root_lorem",
                },
                lorem_child: {
                    child_child: {
                        child_child_text: "child_child_lorem_ipsum",
                    },
                    child_text: "child_lorem_ipsum",
                },
                test: "lorem",
            };
            const denormalizedDocumentWithChild: MappedDocument = denormalizer.denormalize(json);
            denormalizedDocumentWithChild.computeChanges(mappedDocument);
            expect(denormalizedDocumentWithChild.$changes.size).toEqual(0);
        });

        it("should map managed document to JSON with metadata.", () => {
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [documentMock.$symbol]: {
                    documentName: "root_lorem",
                },
                lorem_child: {
                    child_child: {
                        child_child_text: "child_child_lorem_ipsum",
                    },
                    child_text: "child_lorem_ipsum",
                },
                test: "lorem",
            };
            const objectJson: any = denormalizer.normalize(mappedDocument);
            expect(objectJson).toEqual(json);
        });
    });

    describe("Children (de)normalization.", () => {
        it("Should normalize array of child", () => {
            const childDocumentMapping = Builder
            .mapping("child_lorem")
            .addField(new StringField("child_text"))
            .build();

            const rootMapping = Builder
        .mapping("root_lorem")
        .addField(new StringField("test"))
        .addField(new IdField("id"))
        .addField(new ChildrenField("lorem_childs", childDocumentMapping))
        .build();

            const children = [];
            for (let i = 0; i < 5; i += 1) {
            children.push(Builder
                .mappedDocument(childDocumentMapping)
                .addFieldValue("child_text", "lorem_ipsum" + i)
                .build());
        }

            const mappedDocument = Builder
        .mappedDocument(rootMapping)
        .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
        .addFieldValue("test", "lorem")
        .addFieldValue("lorem_childs", children)
        .build();

            const documentMock = Builder.documentManager();
            const denormalizer = documentMock.$normalizer;
            documentMock.$mappings.set(rootMapping.$name, rootMapping);
            documentMock.$mappings.set(childDocumentMapping.$name, childDocumentMapping);
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [documentMock.$symbol]: {
                    documentName: "root_lorem",
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
            expect(denormalizer.normalize(mappedDocument)).toEqual(json);
        });

        it("Should denormalize array of child", () => {
            const childDocumentMapping = Builder
            .mapping("child_lorem")
            .addField(new StringField("child_text"))
            .build();

            const documentMapping = Builder
        .mapping("root_lorem")
        .addField(new StringField("test"))
        .addField(new IdField("id"))
        .addField(new ChildrenField("lorem_childs", childDocumentMapping))
        .build();

            const children = [];
            for (let i = 0; i < 5; i += 1) {
            children.push(Builder
                .mappedDocument(childDocumentMapping)
                .addFieldValue("child_text", "lorem_ipsum" + i)
                .build());
        }

            const mappedDocument = Builder
        .mappedDocument(documentMapping)
        .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
        .addFieldValue("test", "lorem")
        .addFieldValue("lorem_childs", children)
        .build();

            const documentMock = Builder.documentManager();
            const denormalizer = documentMock.$normalizer;
            documentMock.$mappings.set(documentMapping.$name, documentMapping);
            documentMock.$mappings.set(childDocumentMapping.$name, childDocumentMapping);
            const json = {
                id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [documentMock.$symbol]: {
                    documentName: "root_lorem",
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

            const denormalizedMappedDocument = denormalizer.denormalize(json);
            mappedDocument.computeChanges(denormalizedMappedDocument);
            expect(mappedDocument.$changes.size).toEqual(0);
        });
    });
});
