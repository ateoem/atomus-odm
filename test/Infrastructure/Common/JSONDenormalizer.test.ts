import ChildField from "../../../src/Model/Mapping/Field/ChildField";
import ChildrenField from "../../../src/Model/Mapping/Field/ChildrenField";
import StringField from "../../../src/Model/Mapping/Field/StringField";
import IdField from "../../../src/Model/Mapping/Field/UuidField";
import MappedDocument from "../../../src/Model/ODM/MappedDocument";
import RootDocument from "../../../src/Model/ODM/RootDocument";
import { mappings, RootAuthorFactory } from "../../Common/Models";
import { mockAuthorJson, mockCommentJson, mockCommentsMapped, mockPostJson, mockRootAuthorMapped, mockRootCommentMapped, mockRootPost } from "../../Utils/DocumentMocks";
import { Builder } from "./Builder";

describe("JSONDenormalizer", () => {
    describe("Document (de)normalization", () => {

        // tslint:disable-next-line:one-variable-per-declaration
        let manager, $normalizer, $symbol;

            manager = Builder.documentManager(mappings);
            $normalizer = manager.$normalizer;
            $symbol = manager.$symbol;

            it.each([
            [mockRootAuthorMapped(), mockAuthorJson($symbol)],
            [mockRootCommentMapped(), mockCommentJson($symbol)],
            [mockRootPost(), mockPostJson($symbol)],
        ])("should map managed document to JSON with metadata.", 
            (mappedDocument: MappedDocument, json: JSON) => {
            const denormalizedJSON = $normalizer.normalize(mappedDocument);
            expect(denormalizedJSON).toEqual(json);
        });

        it.each([
            [mockRootAuthorMapped(), mockAuthorJson($symbol)],
            [mockRootCommentMapped(), mockCommentJson($symbol)],
            [mockRootPost(), mockPostJson($symbol)],
        ])("should map JSON with metadata to document.", 
            (mappedDocument: MappedDocument, json: JSON) => {
            const denormalizedDocument: MappedDocument = $normalizer.denormalize(json);
            expect(denormalizedDocument.computeChanges(mappedDocument)).toBeFalsy();
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
