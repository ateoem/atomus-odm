import ChildFieldValue from "../../../src/Model/Mapping/ChildFieldValue";
import ChildrenFieldValue from "../../../src/Model/Mapping/ChildrenFieldValue";
import FieldValue from "../../../src/Model/Mapping/FieldValue";
import StringFieldValue from "../../../src/Model/Mapping/StringFieldValue";
import MappedDocument from "../../../src/Model/ODM/MappedDocument";
import DocumentMapping from "../../../src/Model/Schema/DocumentMapping";
import Field from "../../../src/Model/Schema/Field";
import ChildrenField from "../../../src/Model/Schema/Fields/ChildrenField";
import StringField from "../../../src/Model/Schema/Fields/StringField";
import UuidField from "../../../src/Model/Schema/Fields/UuidField";
import FieldType from "../../../src/Model/Schema/FieldType";
import { RootPostFactory } from "../../Common/Models";
import { Builder } from "../../Infrastructure/Common/Builder";
import { mockAuthorMapped, mockCommentsMapped } from "../../Utils/DocumentMocks";

describe("MappedDocument", () => {
    const fields = [
        new UuidField("id"),
        new StringField("name"),
        new StringField("surname"),
    ];
    const exampleDocumentMapping = new DocumentMapping("test_mapping", fields);

    it("should have id set if created as empty.", () => {
        const document = new MappedDocument(exampleDocumentMapping);
        expect(document.$id).not.toBeNull();
    });

    it("should not have differences to itself.", () => {
        const document = new MappedDocument(exampleDocumentMapping);
        expect(document.computeChanges(document)).toBeFalsy();
    });

    it("should guard against inconsistency.", () => {
        expect(() => {
            const mockFieldValues = [new StringFieldValue(new StringField("nam1e1"), "1")];
            const document = new MappedDocument(exampleDocumentMapping, mockFieldValues);
        }).toThrowError();
    });

    it.skip("should guard against inconsistency in child/ren.", () => {
        expect(() => {
            const childrenField = new ChildrenField("children", exampleDocumentMapping);
            const mockChildMapping = Builder.mapping("test")
            .addField(childrenField)
            .build();
            const emptyMapping = Builder.mapping("empty")
            .build();

            // tslint:disable-next-line:no-unused-expression
            new MappedDocument(mockChildMapping, [new ChildFieldValue(childrenField, new MappedDocument(emptyMapping))]);
         }).toThrowError();
    });

    it("should compute changes for child", () => {
        const fourComments = mockCommentsMapped();
        
        const postWithThreeComments = RootPostFactory(
            "be081a90-10e8-11e9-bace-33bbbc6ffddb",
            "Donec sit amet tortor convallis.",
            mockAuthorMapped(),
            fourComments,
        );

        const postWithTwoComments = RootPostFactory(
            "be081a90-10e8-11e9-bace-33bbbc6ffddb",
            "Donec sit amet tortor convallis.",
            mockAuthorMapped(),
            fourComments.slice(0, 2),
        );

        expect(postWithThreeComments.computeChanges(postWithTwoComments)).toBeTruthy();
        expect(postWithTwoComments.computeChanges(postWithThreeComments)).toBeTruthy();

        expect(postWithTwoComments.getChildren("comments")[2].$changes.size).toBe(1);
        expect(postWithThreeComments.getChildren("comments")[2].$changes.has("delete")).toBeTruthy();

        expect(postWithTwoComments.getChildren("comments")[2].$changes.has("content")).toBeTruthy();
    });
});
