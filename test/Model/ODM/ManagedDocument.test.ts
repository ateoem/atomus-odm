import DocumentChanges from "../../../src/Model/Document/DocumentChanges";
import FieldValue from "../../../src/Model/Document/FieldValue";
import MappedDocument from "../../../src/Model/Document/MappedDocument";
import ManagedDocument from "../../../src/Model/Document/RootDocument";
import DocumentMapping from "../../../src/Model/Mapping/DocumentMapping";
import Field from "../../../src/Model/Mapping/Field";
import ChildField from "../../../src/Model/Mapping/Fields/ChildField";
import IdField from "../../../src/Model/Mapping/Fields/IdField";
import StringField from "../../../src/Model/Mapping/Fields/StringField";
import FieldType from "../../../src/Model/Mapping/FieldType";
import Builder from "../../Infrastructure/Common/Builder";

describe("ManagedDocument", () => {
    it("should have getters/setters.", () => {
        const nameField = new StringField("name");
        const surnameField = new StringField("surname");
        const idField = new IdField("id");

        const fields = [ nameField, surnameField, idField ];
        const fieldValues = [
            new FieldValue(nameField, { value: "test" }),
            new FieldValue(surnameField, { value: "ipsum" }),
            new FieldValue(idField, { value: "9181ee1a-030b-40d3-9d2c-168db5c03c5e" }),
        ];
        const documentMapping = new DocumentMapping("test_aggr", fields);
        const document = new MappedDocument(documentMapping, fieldValues);
        const managedDocument = new ManagedDocument(document);
        expect(managedDocument.$document).toBe(document);
        expect(managedDocument.$changes).toBeInstanceOf(Map);
    });

    it("should compute changes.", () => {
        const nameField = new StringField("name");
        const surnameField = new StringField("surname");
        const idField = new IdField("id");

        const fields = [ nameField, surnameField, idField ];
        const fieldValues = [
            new FieldValue(nameField, { value: "test" }),
            new FieldValue(surnameField, { value: "ipsum" }),
        ];

        const documentMapping = new DocumentMapping("test_aggr", fields);

        const managedDocument = new ManagedDocument(new MappedDocument(documentMapping, fieldValues));
        const differentDocument = new ManagedDocument(new MappedDocument(documentMapping, fieldValues));

        const computedChanges = differentDocument.computeChanges(managedDocument);
        expect(differentDocument.$changes.size).toEqual(1);
        expect(differentDocument.$changes.has("id")).toBeTruthy();
    });

    it("should compute changes.", () => {
        const nameField = new StringField("name");
        const surnameField = new StringField("surname");
        const idField = new IdField("id");

        const fields = [ nameField, surnameField, idField ];
        const fieldValues = [
            new FieldValue(nameField, { value: "test" }),
            new FieldValue(surnameField, { value: "ipsum" }),
        ];

        const documentMapping = new DocumentMapping("test_aggr", fields);

        const managedDocument = new ManagedDocument(new MappedDocument(documentMapping, fieldValues));
        const differentDocument = new ManagedDocument(new MappedDocument(documentMapping, fieldValues));

        const computedChanges = differentDocument.computeChanges(managedDocument);
        expect(differentDocument.$changes.size).toEqual(1);
        expect(differentDocument.$changes.has("id")).toBeTruthy();
    });

    it("Should compute changes between child.", () => {
        const loremField = new StringField("lorem");
        const idField = new IdField("id");
        const loremFieldValue = new FieldValue(loremField, "test");

        const childDocumentMapping = new DocumentMapping("lorem_child", [ loremField ]);
        const childField = new ChildField("lorem_child", childDocumentMapping);

        const childFieldValue = new FieldValue(
            childField,
            new MappedDocument(childDocumentMapping, [loremFieldValue],
                ),
            );

        const rootDocumentMapping = new DocumentMapping("lorem_root", [ childField, loremField, idField ]);
        const childDocument = new MappedDocument(childDocumentMapping, [ loremFieldValue ]);

        const firstRootDocument = new ManagedDocument(new MappedDocument(rootDocumentMapping, [loremFieldValue]));
        const secondRootDocument = new ManagedDocument(
            new MappedDocument(rootDocumentMapping, [ loremFieldValue, childFieldValue ]),
        );

        firstRootDocument.computeChanges(secondRootDocument);
        const childChanges = firstRootDocument.getChild("lorem_child").$changes;

        expect(childChanges.size).toEqual(1);
        expect(childChanges.get("lorem").$old).toEqual("");
        expect(childChanges.get("lorem").$updated).toEqual("test");
    });

    it("Should compute changes between multi-level-child.", () => {
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

        const secondChildChildMappedDocument = Builder
    .mappedDocument(childChildDocumentMapping)
    .addFieldValue("child_child_text", "child_child_lorem_ipsum2")
    .build();

        const childMappedDocument = Builder
    .mappedDocument(childDocumentMapping)
    .addFieldValue("child_text", "child_lorem_ipsum")
    .addFieldValue("child_child", childChildMappedDocument)
    .build();

        const secondChildMappedDocument = Builder
    .mappedDocument(childDocumentMapping)
    .addFieldValue("child_text", "child_lorem_ipsum")
    .addFieldValue("child_child", secondChildChildMappedDocument)
    .build();

        const mappedDocument = Builder
    .mappedDocument(documentMapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_child", childMappedDocument)
    .build();

        const secondMappedDocument = Builder
    .mappedDocument(documentMapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_child", secondChildMappedDocument)
    .build();

        expect(mappedDocument.computeChanges(secondMappedDocument)).toBeFalsy();
        const childChildChanges = mappedDocument.getChild("lorem_child").getChild("child_child").$changes;
        expect(childChildChanges.size).toEqual(1);
        expect(childChildChanges.get("child_child_text").$old).toEqual("child_child_lorem_ipsum");
        expect(childChildChanges.get("child_child_text").$updated).toEqual("child_child_lorem_ipsum2");
    });
});
