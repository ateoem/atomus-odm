import Aggregate from "../../../src/Model/Mapping/Aggregate";
import StringFieldValue from "../../../src/Model/Mapping/FieldValue/StringFieldValue";
import FieldValueCollection from "../../../src/Model/Mapping/FieldValueCollection";
import { FIELD_ADDRESS, FIELD_AGE, FIELD_VALUE_AGE, FIELD_VALUE_SURNAME, FIELD_VALUES_USER_JAN_KOWALSKI, FIELD_VALUES_USER_JOE_DOE, FIELDS_ARRAY_USER, FIELDS_USER, FIELDS_USER_AGE } from "../../Utils/ExampleFields";

describe("Document", () => {
    it("should have clone/isEqual.", () => {
        const document = new Aggregate(FIELDS_USER, FIELD_VALUES_USER_JOE_DOE);
        expect(document.clone().isEqual(document)).toBe(true);
    });

    it("should guard against inconsistency in number of fields.", () => {
        expect(() => {
            // tslint:disable-next-line:no-unused-expression
            new Aggregate(FIELDS_USER, new FieldValueCollection([FIELD_VALUE_AGE]));
        }).toThrowError(`Document is incosistent: number of fields: "2". number of values: "3".`);
    });

    it("should guard against inconsistency in field type.", () => {
        expect(() => {
            // tslint:disable-next-line:no-unused-expression
            new Aggregate(FIELDS_USER, new FieldValueCollection([new StringFieldValue(FIELD_ADDRESS, "test")]));
        }).toThrowError(`Document is incosistent: number of fields: "2". number of values: "3".`);
    });

    it('should not be equal if different fields.', () => {
        const userCollection = new Aggregate(FIELDS_USER);
        const userAgeCollection = new Aggregate(FIELDS_USER_AGE);

        expect(userCollection.isEqual(userAgeCollection)).toBe(false);
    });

    it('should not be equal if different values.', () => {
        const firstUserCollection = new Aggregate(FIELDS_USER, FIELD_VALUES_USER_JAN_KOWALSKI);
        const secondUserCollection = new Aggregate(FIELDS_USER, FIELD_VALUES_USER_JOE_DOE);

        expect(secondUserCollection.isEqual(firstUserCollection)).toBe(false);
    });
});