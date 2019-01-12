import AggregateCollection from "../../../src/Model/Mapping/AggregateCollection";
import { userFields, userJanKowalskiFieldValues, userJohnDoeFieldValues, userWithAgeFields } from "../../Utils/ExampleFields";

describe('AggregateCollection', () => {
    it('should have clone/isEqual/size/fields', () => {
        const collection = new AggregateCollection(
            userFields,
            [userJanKowalskiFieldValues, userJohnDoeFieldValues]
        );
        expect(collection.$size).toBe(2);
        expect(collection.$aggregates.length).toBe(2);
        expect(collection.$fields.isEqual(userFields)).toBe(true);
        expect(collection.clone().isEqual(collection)).toBe(true); 
    });

    it('should not be equal if different fields.', () => {
        const userCollection = new AggregateCollection(userFields, []);
        const userAgeCollection = new AggregateCollection(userWithAgeFields, []);

        expect(userCollection.isEqual(userAgeCollection)).toBe(false);
    });

    it('should not be equal if different values.', () => {
        const firstUserCollection = new AggregateCollection(userFields, [userJanKowalskiFieldValues, userJanKowalskiFieldValues]);
        const secondUserCollection = new AggregateCollection(userFields, [userJanKowalskiFieldValues, userJohnDoeFieldValues]);

        expect(secondUserCollection.isEqual(firstUserCollection)).toBe(false);
    });
});