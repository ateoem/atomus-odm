import StringFieldValue from "../../../src/Model/Mapping/FieldValue/StringFieldValue";
import FieldValueCollection from "../../../src/Model/Mapping/FieldValueCollection";
import { FIELD_NAME, FIELD_VALUE_AGE, FIELD_VALUE_NAME, FIELD_VALUE_SURNAME, FIELDS_ARRAY_USER } from "../../Utils/ExampleFields";

describe("FieldValueCollection", () => {
    it("should have has/get/size/$fieldsArray/$name", () => {
        const collection = new FieldValueCollection([FIELD_VALUE_SURNAME, FIELD_VALUE_NAME]);
        expect(collection.has("name")).toBe(true);
        expect(collection.has("surname")).toBe(true);
        expect(collection.size()).toBe(2);

        expect(collection.get("name").isEqual(FIELD_VALUE_NAME)).toBe(true);
        expect(collection.get("surname").isEqual(FIELD_VALUE_SURNAME)).toBe(true);
        expect(collection.$fieldValuesArray.length).toBe(2);
        expect(collection.clone().isEqual(collection)).toBe(true);
    });

    it("should not be equal if has different number of FieldValues.", () => {
        const oneCollection = new FieldValueCollection([FIELD_VALUE_SURNAME, FIELD_VALUE_NAME, FIELD_VALUE_AGE]);
        const secondCollection = new FieldValueCollection([FIELD_VALUE_SURNAME, FIELD_VALUE_NAME]);
        expect(oneCollection.isEqual(secondCollection)).toBe(false);
        expect(secondCollection.isEqual(oneCollection)).toBe(false);
    });

    it("should not be equal if has different value.", () => {
        const oneCollection = new FieldValueCollection([FIELD_VALUE_SURNAME, FIELD_VALUE_NAME]);
        const secondCollection = new FieldValueCollection([FIELD_VALUE_SURNAME, new StringFieldValue(FIELD_NAME, "Paul")]);
        expect(oneCollection.isEqual(secondCollection)).toBe(false);
        expect(secondCollection.isEqual(oneCollection)).toBe(false);
    });
});