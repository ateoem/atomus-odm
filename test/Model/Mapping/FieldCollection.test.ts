import IdField from "../../../src/Model/Mapping/Field/IdField";
import StringField from "../../../src/Model/Mapping/Field/StringField";
import FieldCollection from "../../../src/Model/Mapping/FieldCollection";
import { FIELDS_ARRAY_USER } from "../../Utils/ExampleFields";

describe("FieldCollection", () => {
    const nameField = new StringField("name");
    const surnameField = new StringField("surname");

    it("should have setters/getters.", () => {
        const collection = new FieldCollection("test_mapping", FIELDS_ARRAY_USER);

        expect(collection.$fieldsArray).toEqual(FIELDS_ARRAY_USER);
        expect(collection.size()).toEqual(2);
        expect(collection.has("name")).toEqual(true);
        expect(collection.$name).toBe("test_mapping");
        expect(collection.$fieldsArray.length).toBe(2);
        
        expect(collection.get('name')).not.toBe(nameField);
        expect(collection.get('surname')).not.toBe(surnameField);
        expect(collection.get('name').isEqual(nameField)).toBe(true);
        expect(collection.get('surname').isEqual(surnameField)).toBe(true);
    });

    it("should check if Field Collection clone is equal to origin.", () => {
        const collection = new FieldCollection("test", [nameField, surnameField]);
        expect(collection.clone().isEqual(collection)).toBe(true);
    });
    
    it("should check if Field Collections are equal when same fields applied.", () => {
        const oneCollection = new FieldCollection("test_mapping", FIELDS_ARRAY_USER);
        const secondCollection = new FieldCollection("test_mapping", FIELDS_ARRAY_USER);

        expect(oneCollection.isEqual(secondCollection)).toBe(true);
    });

    it("should check if Field Collections are equal when different names.", () => {
        const oneCollection = new FieldCollection("test_mapping", FIELDS_ARRAY_USER);
        const secondCollection = new FieldCollection("test_mapping2", FIELDS_ARRAY_USER);

        expect(oneCollection.isEqual(secondCollection)).toBe(false);
    });

    it("should check if Field Collection are equal when has different fields.", () => {
        const oneCollection = new FieldCollection("test_mapping", FIELDS_ARRAY_USER);
        const secondCollection = new FieldCollection("test_mapping2", [...FIELDS_ARRAY_USER, new IdField("_id")]);
        expect(oneCollection.isEqual(secondCollection)).toBe(false);
    });

    // it("should guard against circullar reference", () => {
    //     const collection = new FieldCollection("test", [nameField, surnameField]);
    //     const relationChild = new ChildrenField("circular", collectio);
    //     const circularFields = new FieldCollection("test", [...personalFields, relationChild]);
    //     const circularField = new ChildrenField("circular", circularFields);

    //     expect( () => {
    //     new FieldCollection("test", [...personalFields, circularField]);    
    //     }).toThrowError(`[FieldCollection] Circular reference found in field: "circular".`);
    // });
});
