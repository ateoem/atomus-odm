import StringFieldValue from "../../../src/Model/Mapping/FieldValue/StringFieldValue";
import FieldValueCollection from "../../../src/Model/Mapping/FieldValueCollection";
import { ageFieldValue, nameField, nameFieldValue, surnameFieldValue, userFieldsArray } from "../../Utils/ExampleFields";

describe("FieldValueCollection", () => {
    it("should have has/get/size/$fieldsArray/$name", () => {
        const collection = new FieldValueCollection([surnameFieldValue, nameFieldValue]);
        expect(collection.has("name")).toBe(true);
        expect(collection.has("surname")).toBe(true);
        expect(collection.size()).toBe(2);

        expect(collection.get("name").isEqual(nameFieldValue)).toBe(true);
        expect(collection.get("surname").isEqual(surnameFieldValue)).toBe(true);
        expect(collection.$fieldValuesArray.length).toBe(2);
        expect(collection.clone().isEqual(collection)).toBe(true);
    });

    it("should not be equal if has different number of FieldValues.", () => {
        const oneCollection = new FieldValueCollection([surnameFieldValue, nameFieldValue, ageFieldValue]);
        const secondCollection = new FieldValueCollection([surnameFieldValue, nameFieldValue]);
        expect(oneCollection.isEqual(secondCollection)).toBe(false);
        expect(secondCollection.isEqual(oneCollection)).toBe(false);
    });

    it("should not be equal if has different value.", () => {
        const oneCollection = new FieldValueCollection([surnameFieldValue, nameFieldValue]);
        const secondCollection = new FieldValueCollection([surnameFieldValue, new StringFieldValue(nameField, "Paul")]);
        expect(oneCollection.isEqual(secondCollection)).toBe(false);
        expect(secondCollection.isEqual(oneCollection)).toBe(false);
    });
});