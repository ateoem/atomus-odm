import FieldType from "../../../src/Model/Mapping/Enum/FieldType";
import ChildrenField from "../../../src/Model/Mapping/Field/ChildrenField";
import Field from "../../../src/Model/Mapping/Field/Field";
import StringField from "../../../src/Model/Mapping/Field/StringField";
import UuidField from "../../../src/Model/Mapping/Field/UuidField";
import DocumentMapping from "../../../src/Model/Mapping/FieldCollection";
import ChildFieldValue from "../../../src/Model/Mapping/FieldValue/ChildFieldValue";
import ChildrenFieldValue from "../../../src/Model/Mapping/FieldValue/ChildrenFieldValue";
import FieldValue from "../../../src/Model/Mapping/FieldValue/FieldValue";
import StringFieldValue from "../../../src/Model/Mapping/FieldValue/StringFieldValue";
import MappedDocument from "../../../src/Model/ODM/MappedDocument";
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

    it("should guard against inconsistency in child/ren.", () => {
        expect(() => {
            const childrenField = new ChildrenField("children", exampleDocumentMapping);
            const mockChildMapping = Builder.mapping("test")
            .addField(childrenField)
            .build();
            const emptyMapping = Builder.mapping("empty")
            .build();

            // tslint:disable-next-line:no-unused-expression
            new MappedDocument(mockChildMapping, [new ChildFieldValue(childrenField, new MappedDocument(emptyMapping))]);
         }).toThrowError("a");
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
