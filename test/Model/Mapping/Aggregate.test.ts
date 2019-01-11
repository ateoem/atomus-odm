import Aggregate from "../../../src/Model/Mapping/Aggregate";
import StringFieldValue from "../../../src/Model/Mapping/FieldValue/StringFieldValue";
import FieldValueCollection from "../../../src/Model/Mapping/FieldValueCollection";
import { addressField, AgeField, ageFieldValue, surnameFieldValue, userFields, userFieldsArray, userFieldValues } from "../../Utils/ExampleFields";

describe("Document", () => {
    it("should have clone/isEqual.", () => {
        const document = new Aggregate(userFields, userFieldValues);
        expect(document.clone().isEqual(document)).toBe(true);
    });

    it("should guard against inconsistency in number of fields.", () => {
        expect(() => {
            // tslint:disable-next-line:no-unused-expression
            new Aggregate(userFields, new FieldValueCollection([ageFieldValue]));
        }).toThrowError(`Document is incosistent: number of fields: "2". number of values: "3".`);
    });

    it("should guard against inconsistency in field type.", () => {
        expect(() => {
            // tslint:disable-next-line:no-unused-expression
            new Aggregate(userFields, new FieldValueCollection([new StringFieldValue(addressField, "test")]));
        }).toThrowError(`Document is incosistent: number of fields: "2". number of values: "3".`);
    });
});