import DocumentChange from "../../../src/Model/Document/DocumentChange";
import DocumentChanges from "../../../src/Model/Document/DocumentChanges";
import FieldValue from "../../../src/Model/Document/FieldValue";
import MappedAggregate from "../../../src/Model/Document/MappedDocument";
import ManagedAggregate from "../../../src/Model/Document/RootDocument";
import AggregateMapping from "../../../src/Model/Mapping/DocumentMapping";
import Field from "../../../src/Model/Mapping/Field";
import FieldType from "../../../src/Model/Mapping/FieldType";

describe("ManagedDocument", () => {
    it("should have getters/setters.", () => {
        const nameField = new Field("name", FieldType.string);
        const surnameField = new Field("surname", FieldType.string);
        const idField = new Field("id", FieldType.uuid);

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
        const nameField = new Field("name", FieldType.string);
        const surnameField = new Field("surname", FieldType.string);
        const idField = new Field("id", FieldType.uuid);

        const fields = [ nameField, surnameField, idField ];
        const fieldValues = [
            new FieldValue(nameField, { value: "test" }),
            new FieldValue(surnameField, { value: "ipsum" }),
        ];

        const aggregateMapping = new AggregateMapping("test_aggr", fields);

        const managedAggregate = new ManagedAggregate(new MappedAggregate(aggregateMapping, fieldValues));
        const differentAggregate = new ManagedAggregate(new MappedAggregate(aggregateMapping, fieldValues));

        const computedChanges = differentAggregate.computeChanges(managedAggregate);
        expect(computedChanges.size()).toEqual(1);
        expect(computedChanges.has("id")).toBeTruthy();
    });

    it("should compute changes.", () => {
        const nameField = new Field("name", FieldType.string);
        const surnameField = new Field("surname", FieldType.string);
        const idField = new Field("id", FieldType.uuid);

        const fields = [ nameField, surnameField, idField ];
        const fieldValues = [
            new FieldValue(nameField, { value: "test" }),
            new FieldValue(surnameField, { value: "ipsum" }),
        ];

        const aggregateMapping = new AggregateMapping("test_aggr", fields);

        const managedAggregate = new ManagedAggregate(new MappedAggregate(aggregateMapping, fieldValues));
        const differentAggregate = new ManagedAggregate(new MappedAggregate(aggregateMapping, fieldValues));

        const computedChanges = differentAggregate.computeChanges(managedAggregate);
        expect(computedChanges.size()).toEqual(1);
        expect(computedChanges.has("id")).toBeTruthy();
    });

    it("Should compute changes between child.", () => {
        const loremField = new Field("lorem", FieldType.string);
        const idField = new Field("id", FieldType.uuid);
        const loremFieldValue = new FieldValue(loremField, "test");

        const childAggregateMapping = new AggregateMapping("lorem_child", [ loremField ]);
        const childField = new Field("lorem_child", FieldType.child, {mapping: childAggregateMapping});

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
        const childChanges: DocumentChanges = firstRootAggregate.$childChanges.get("lorem_child");

        expect(childChanges.size()).toEqual(1);
        expect(childChanges.get("lorem").$old).toEqual("");
        expect(childChanges.get("lorem").$changed).toEqual("test");
    });
});
