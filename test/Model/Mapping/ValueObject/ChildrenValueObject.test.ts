import AggregateCollection from "../../../../src/Model/Mapping/AggregateCollection";
import ChildrenValueObject from "../../../../src/Model/Mapping/ValueObject/ChildrenValueObject";
import ChildValueObject from "../../../../src/Model/Mapping/ValueObject/ChildValueObject";
import { AGGREGATE_USER_JOE_DOE, AGGREGATE_USERAGE_JAN_KOWALSKI, AGGREGATE_USERAGE_JOE_DOE, FIELD_VALUES_USER_JAN_KOWALSKI, FIELD_VALUES_USER_JOE_DOE, FIELDS_USER, FIELDS_USER_AGE } from "../../../Utils/ExampleFields";

describe('ChildrenValueObject', () => {
    it('should have clone/isEqual.', () => {
        const childVO = new ChildrenValueObject(new AggregateCollection(FIELDS_USER, [FIELD_VALUES_USER_JOE_DOE]));
        expect(childVO.clone().isEqual(childVO)).toBe(true);
    });

    it('should be equal if same fields and values.', () => {
        const childVO1 = new ChildrenValueObject(new AggregateCollection(FIELDS_USER, [FIELD_VALUES_USER_JOE_DOE]));
        const childVO2 = new ChildrenValueObject(new AggregateCollection(FIELDS_USER, [FIELD_VALUES_USER_JOE_DOE]));
        expect(childVO1.clone().isEqual(childVO2)).toBe(true);
        expect(childVO2.clone().isEqual(childVO1)).toBe(true);
    });

    it('should not be equal if different fields.', () => {
        const childWithAge = new ChildrenValueObject(new AggregateCollection(FIELDS_USER, []));
        const childWithoutAge = new ChildrenValueObject(new AggregateCollection(FIELDS_USER_AGE, []));
        expect(childWithAge.isEqual(childWithoutAge)).toBe(false);
        expect(childWithoutAge.isEqual(childWithAge)).toBe(false);
    });

    it('should not be equal if different values.', () => {
        const childOne = new ChildrenValueObject(
            new AggregateCollection(FIELDS_USER, [FIELD_VALUES_USER_JOE_DOE, FIELD_VALUES_USER_JAN_KOWALSKI])
        );
        const childTwo = new ChildrenValueObject(
            new AggregateCollection(FIELDS_USER, [FIELD_VALUES_USER_JOE_DOE, FIELD_VALUES_USER_JOE_DOE])
        );
        
        expect(childTwo.isEqual(childOne)).toBe(false);
        expect(childOne.isEqual(childTwo)).toBe(false);
    });
});