import DocumentChanges from "../../../src/Model/Document/DocumentChanges";
import FieldValue from "../../../src/Model/Document/FieldValue";
import MappedAggregate from "../../../src/Model/Document/MappedDocument";
import ManagedAggregate from "../../../src/Model/Document/RootDocument";
import AggregateMapping from "../../../src/Model/Mapping/DocumentMapping";
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
        const aggregateMapping = new AggregateMapping("test_aggr", fields);
        const aggregate = new MappedAggregate(aggregateMapping, fieldValues);
        const managedAggregate = new ManagedAggregate(aggregate);
        expect(managedAggregate.$aggregate).toBe(aggregate);
        expect(managedAggregate.$changes).toBeInstanceOf(Map);
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

        const aggregateMapping = new AggregateMapping("test_aggr", fields);

        const managedAggregate = new ManagedAggregate(new MappedAggregate(aggregateMapping, fieldValues));
        const differentAggregate = new ManagedAggregate(new MappedAggregate(aggregateMapping, fieldValues));

        const computedChanges = differentAggregate.computeChanges(managedAggregate);
        expect(differentAggregate.$changes.size).toEqual(1);
        expect(differentAggregate.$changes.has("id")).toBeTruthy();
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

        const aggregateMapping = new AggregateMapping("test_aggr", fields);

        const managedAggregate = new ManagedAggregate(new MappedAggregate(aggregateMapping, fieldValues));
        const differentAggregate = new ManagedAggregate(new MappedAggregate(aggregateMapping, fieldValues));

        const computedChanges = differentAggregate.computeChanges(managedAggregate);
        expect(differentAggregate.$changes.size).toEqual(1);
        expect(differentAggregate.$changes.has("id")).toBeTruthy();
    });

    it("Should compute changes between child.", () => {
        const loremField = new StringField("lorem");
        const idField = new IdField("id");
        const loremFieldValue = new FieldValue(loremField, "test");

        const childAggregateMapping = new AggregateMapping("lorem_child", [ loremField ]);
        const childField = new ChildField("lorem_child", childAggregateMapping);

        const childFieldValue = new FieldValue(
            childField,
            new MappedAggregate(childAggregateMapping, [loremFieldValue],
                ),
            );

        const rootAggregateMapping = new AggregateMapping("lorem_root", [ childField, loremField, idField ]);
        const childAggregate = new MappedAggregate(childAggregateMapping, [ loremFieldValue ]);

        const firstRootAggregate = new ManagedAggregate(new MappedAggregate(rootAggregateMapping, [loremFieldValue]));
        const secondRootAggregate = new ManagedAggregate(
            new MappedAggregate(rootAggregateMapping, [ loremFieldValue, childFieldValue ]),
        );

        firstRootAggregate.computeChanges(secondRootAggregate);
        const childChanges = firstRootAggregate.getChild("lorem_child").$changes;

        expect(childChanges.size).toEqual(1);
        expect(childChanges.get("lorem").$old).toEqual("");
        expect(childChanges.get("lorem").$changed).toEqual("test");
    });

    it("Should compute changes between multi-level-child.", () => {
        const childChildAggregateMapping = Builder
        .mapping("child_child_lorem")
        .addField(new StringField("child_child_text"))
        .build();

        const childAggregateMapping = Builder
        .mapping("child_lorem")
        .addField(new StringField("child_text"))
        .addField(new ChildField("child_child", childChildAggregateMapping))
        .build();

        const aggregateMapping = Builder
    .mapping("root_lorem")
    .addField(new StringField("test"))
    .addField(new IdField("id"))
    .addField(new ChildField("lorem_child", childAggregateMapping))
    .build();

        const childChildMappedAggregate = Builder
    .mappedAggregate(childChildAggregateMapping)
    .addFieldValue("child_child_text", "child_child_lorem_ipsum")
    .build();

        const secondChildChildMappedAggregate = Builder
    .mappedAggregate(childChildAggregateMapping)
    .addFieldValue("child_child_text", "child_child_lorem_ipsum2")
    .build();

        const childMappedAggregate = Builder
    .mappedAggregate(childAggregateMapping)
    .addFieldValue("child_text", "child_lorem_ipsum")
    .addFieldValue("child_child", childChildMappedAggregate)
    .build();

        const secondChildMappedAggregate = Builder
    .mappedAggregate(childAggregateMapping)
    .addFieldValue("child_text", "child_lorem_ipsum")
    .addFieldValue("child_child", secondChildChildMappedAggregate)
    .build();

        const mappedAggregate = Builder
    .mappedAggregate(aggregateMapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_child", childMappedAggregate)
    .build();

        const secondMappedAggregate = Builder
    .mappedAggregate(aggregateMapping)
    .addFieldValue("id", "9181ee1a-030b-40d3-9d2c-168db5c03c5e")
    .addFieldValue("test", "lorem")
    .addFieldValue("lorem_child", secondChildMappedAggregate)
    .build();

        expect(mappedAggregate.computeChanges(secondMappedAggregate)).toBeFalsy();
        const childChildChanges = mappedAggregate.getChild("lorem_child").getChild("child_child").$changes;
        expect(childChildChanges.size).toEqual(1);
        expect(childChildChanges.get("child_child_text").$old).toEqual("child_child_lorem_ipsum");
        expect(childChildChanges.get("child_child_text").$changed).toEqual("child_child_lorem_ipsum2");
    });
});
