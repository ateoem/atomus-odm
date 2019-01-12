import AggregateCollection from "../../../src/Model/Mapping/AggregateCollection";
import { FIELD_VALUES_USER_JAN_KOWALSKI, FIELD_VALUES_USER_JOE_DOE, FIELDS_USER, FIELDS_USER_AGE } from "../../Utils/ExampleFields";

describe('AggregateCollection', () => {
    it('should have clone/isEqual/size/fields', () => {
        const collection = new AggregateCollection(
            FIELDS_USER,
            [FIELD_VALUES_USER_JAN_KOWALSKI, FIELD_VALUES_USER_JOE_DOE]
        );
        expect(collection.$size).toBe(2);
        expect(collection.$aggregates.length).toBe(2);
        expect(collection.$fields.isEqual(FIELDS_USER)).toBe(true);
        expect(collection.clone().isEqual(collection)).toBe(true); 
    });

    it('should not be equal if different fields.', () => {
        const userCollection = new AggregateCollection(FIELDS_USER, []);
        const userAgeCollection = new AggregateCollection(FIELDS_USER_AGE, []);

        expect(userCollection.isEqual(userAgeCollection)).toBe(false);
    });

    it('should not be equal if different values.', () => {
        const firstUserCollection = new AggregateCollection(FIELDS_USER, [FIELD_VALUES_USER_JAN_KOWALSKI, FIELD_VALUES_USER_JAN_KOWALSKI]);
        const secondUserCollection = new AggregateCollection(FIELDS_USER, [FIELD_VALUES_USER_JAN_KOWALSKI, FIELD_VALUES_USER_JOE_DOE]);

        expect(secondUserCollection.isEqual(firstUserCollection)).toBe(false);
    });
});