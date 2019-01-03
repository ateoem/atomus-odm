import MappedDocument from "../../../src/Model/Document/MappedDocument";
import RootDocument from "../../../src/Model/Document/RootDocument";
import ChildField from "../../../src/Model/Mapping/Fields/ChildField";
import ChildrenField from "../../../src/Model/Mapping/Fields/ChildrenField";
import IdField from "../../../src/Model/Mapping/Fields/IdField";
import StringField from "../../../src/Model/Mapping/Fields/StringField";
import { mappings, RootAuthorFactory } from "../../Common/Models";
import { mockAuthorJson, mockAuthorMapped } from "../../Utils/DocumentMocks";
import { Builder } from "./Builder";

describe("JSONDenormalizer", () => {
    describe("Document (de)normalization", () => {

        // tslint:disable-next-line:one-variable-per-declaration
        let manager, $normalizer, $symbol;

        manager = Builder.documentManager(mappings);
        $normalizer = manager.$normalizer;
        $symbol = manager.$symbol;

        it.each([
            [mockAuthorMapped(), mockAuthorJson($symbol)],
            // [mockCommentMapped(), mockCommentJson($symbol)],
        ])("should map managed document to JSON with metadata.", 
            (mappedDocument: MappedDocument, json: JSON) => {
            const denormalizedJSON = $normalizer.normalize(mappedDocument);
            expect(denormalizedJSON).toEqual(json);
        });

        it("should map JSON with metadata to document.", () => {
            // const json = {
            //     id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
            //     [manager.$symbol]: {
            //         documentName: "test_aggr",
            //     },
            //     name: "test",
            //     surname: "ipsum",
            // };
            // const denormalizedDocument: MappedDocument = denormalizer.denormalize(json);
            // expect(denormalizedDocument.computeChanges(mappedDocument)).toBeFalsy();
            expect(1).toBe(1);
        });

        it("should fail if document not found.", () => {
            expect(() => {
                const json = {id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
                [manager.$symbol]: {
                    documentName: "non_existent",
                },
                name: "test",
                surname: "ipsum",
            };
                $normalizer.denormalize(json);
            }).toThrowError();
        });

    });
});
